// Script to create a new admin account
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'order_processing';

async function createAdmin() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.query(`USE ${DB_NAME}`);

    // Admin credentials
    const username = 'superadmin';
    const password = 'admin123';
    const name = 'Super Administrator';

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT AdminID, Username FROM admin WHERE Username = ?',
      [username]
    );

    if (existing.length > 0) {
      console.log(`⚠️  Admin with username "${username}" already exists!`);
      console.log(`   AdminID: ${existing[0].AdminID}`);
      console.log(`   Username: ${existing[0].Username}`);
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const [result] = await connection.execute(
      'INSERT INTO admin (Username, Password, Name) VALUES (?, ?, ?)',
      [username, hashedPassword, name]
    );

    console.log('✅ Admin account created successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${name}`);
    console.log(`   AdminID: ${result.insertId}`);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();

