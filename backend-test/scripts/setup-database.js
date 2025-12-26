// Database Setup Script - New Database Structure
// This script helps set up the database with proper password hashes
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

const DB_NAME = process.env.DB_NAME || 'order_processing';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);

    // Drop and create database
    console.log(`📦 Dropping and creating database ${DB_NAME}...`);
    await connection.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await connection.query(`USE ${DB_NAME}`);

    // Read and execute schema
    console.log('📋 Creating tables...');
    const schema = readFileSync(join(__dirname, '../database/schema-new.sql'), 'utf8');
    await connection.query(schema);

    // Read and execute triggers
    console.log('⚙️  Creating triggers...');
    let triggers = readFileSync(join(__dirname, '../database/triggers-new.sql'), 'utf8');
    
    // Remove DELIMITER statements (not needed for mysql2)
    triggers = triggers.replace(/DELIMITER \$\$/g, '');
    triggers = triggers.replace(/DELIMITER ;/g, '');
    
    // Split by $$ delimiter and execute each trigger
    const triggerStatements = triggers.split('$$').filter(s => s.trim().length > 0);
    for (const statement of triggerStatements) {
      const cleaned = statement.trim();
      if (cleaned && !cleaned.startsWith('--') && cleaned.length > 10) {
        try {
          await connection.query(cleaned);
        } catch (err) {
          // Ignore duplicate trigger errors
          if (!err.message.includes('already exists')) {
            console.warn('Warning creating trigger:', err.message);
          }
        }
      }
    }

    // Generate password hashes
    console.log('🔐 Generating password hashes...');
    const passwordHash = await bcrypt.hash('password123', 10);

    // Read seed data and replace password placeholder
    console.log('🌱 Seeding database...');
    let seedData = readFileSync(join(__dirname, '../database/seed-data-new.sql'), 'utf8');
    
    // Replace all password placeholders with actual hash
    seedData = seedData.replace(
      /\$2b\$10\$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZ?/g,
      passwordHash
    );

    await connection.query(seedData);

    console.log('✅ Database setup completed successfully!');
    console.log('\n📝 Test Users:');
    console.log('   Admin: admin / password123');
    console.log('   Admin: admin2 / password123');
    console.log('   Admin: manager / password123');
    console.log('   Customer: john_doe / password123');
    console.log('   Customer: jane_smith / password123');
    console.log('   Customer: mike_jones / password123');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
