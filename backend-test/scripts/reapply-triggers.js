// Script to reapply triggers to the database
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
  database: process.env.DB_NAME || 'order_processing',
  multipleStatements: true
};

async function reapplyTriggers() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);

    console.log('⚙️  Reapplying triggers...');
    let triggers = readFileSync(join(__dirname, '../database/triggers-new.sql'), 'utf8');
    
    // Remove DELIMITER statements and USE statement
    triggers = triggers.replace(/USE order_processing;/g, '');
    triggers = triggers.replace(/DELIMITER \$\$/g, '');
    triggers = triggers.replace(/DELIMITER ;/g, '');
    
    // Split by $$ delimiter and execute each trigger
    const triggerStatements = triggers.split('$$').filter(s => s.trim().length > 0);
    for (const statement of triggerStatements) {
      const cleaned = statement.trim();
      if (cleaned && !cleaned.startsWith('--') && cleaned.length > 10) {
        try {
          console.log('Creating trigger:', cleaned.substring(0, 50) + '...');
          await connection.query(cleaned);
          console.log('✅ Trigger created successfully');
        } catch (err) {
          if (err.message.includes('already exists')) {
            console.log('⚠️  Trigger already exists, dropping and recreating...');
            // Extract trigger name and drop it
            const triggerNameMatch = cleaned.match(/CREATE TRIGGER `?(\w+)`?/i);
            if (triggerNameMatch) {
              await connection.query(`DROP TRIGGER IF EXISTS \`${triggerNameMatch[1]}\``);
              await connection.query(cleaned);
              console.log('✅ Trigger recreated successfully');
            }
          } else {
            console.error('❌ Error creating trigger:', err.message);
            throw err;
          }
        }
      }
    }

    console.log('✅ All triggers reapplied successfully!');

  } catch (error) {
    console.error('❌ Error reapplying triggers:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

reapplyTriggers();

