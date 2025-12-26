// Script to check for books with stock below threshold and create replenishment orders
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'order_processing',
  multipleStatements: true
};

async function checkLowStock() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);

    console.log('📊 Checking for books with stock below threshold...');
    
    // Find books with stock below threshold that don't have pending orders
    const [books] = await connection.execute(
      `SELECT b.ISBN, b.Title, b.StockQty, b.ThresholdQty, b.PublisherID, p.Name as PublisherName
       FROM book b
       LEFT JOIN publisher p ON b.PublisherID = p.PublisherID
       WHERE b.StockQty < b.ThresholdQty
         AND b.ThresholdQty > 0
         AND b.PublisherID IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM order_publisher op
           WHERE op.ISBN = b.ISBN
           AND op.Status = 'Pending'
         )
       ORDER BY b.ISBN`
    );

    if (books.length === 0) {
      console.log('✅ No books found with stock below threshold that need orders.');
      return;
    }

    console.log(`\n📦 Found ${books.length} book(s) with stock below threshold:`);
    books.forEach(book => {
      console.log(`   - ${book.ISBN}: ${book.Title}`);
      console.log(`     Stock: ${book.StockQty}, Threshold: ${book.ThresholdQty}, Publisher: ${book.PublisherName || 'N/A'}`);
    });

    console.log('\n🔄 Creating replenishment orders...');
    
    let ordersCreated = 0;
    for (const book of books) {
      try {
        const quantityOrdered = Math.max(20, book.ThresholdQty * 2);
        
        await connection.execute(
          `INSERT INTO order_publisher(ISBN, PublisherID, AdminID, OrderDate, QuantityOrdered, Status)
           VALUES(?, ?, 1, CURDATE(), ?, 'Pending')`,
          [book.ISBN, book.PublisherID, quantityOrdered]
        );
        
        console.log(`   ✅ Created order for ${book.ISBN} (${book.Title}) - Quantity: ${quantityOrdered}`);
        ordersCreated++;
      } catch (err) {
        console.error(`   ❌ Error creating order for ${book.ISBN}:`, err.message);
      }
    }

    console.log(`\n✅ Created ${ordersCreated} replenishment order(s) successfully!`);

  } catch (error) {
    console.error('❌ Error checking low stock:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkLowStock();

