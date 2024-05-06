const db = require('../../config/db');
const Table = require('../models/table');

exports.insert = async (req, res) => {
    const { tables, userId, tabs } = req.body;
  
    console.log("THIS IS INSERT TABLES");
    try {
      // Check if itemList is empty or null
      if (!tables || tables.length === 0) {
        return res.status(400).json({ success: false, error: 'Item list is empty or null' });
      }
  
      // Check if userId is null
      if (userId === null) {
        return res.status(400).json({ success: false, error: 'User ID is null' });
      }

      // Check if userId is null
      if (userId === null) {
        return res.status(400).json({ success: false, error: 'Tabs number is null' });
      }
  
      // Assuming your db module provides a 'query' function for executing SQL queries
      const connection = await db.getConnection();
  
      try {
        // Convert the tables to JSON with auto-incremented ids based on the index
        const tablesWithAutoIncrement = tables.map((table, index) => ({
          id: index + 1,
          name: table.name || '',       // Ensure each field is present, use default values if necessary
          toPay: table.toPay || 0,
          quantity: table.quantity || 0,
          category: table.category || 0,
          items: table.items || [],
          x:table.x || 0,
          y:table.y || 0,
          tabId: table.tabId || 0 
        }));
  
        // Convert the items to JSON
        const itemsJson = JSON.stringify(tablesWithAutoIncrement);
  
        // Check if a record with the given userId already exists
        const [existingRows] = await connection.query('SELECT COUNT(*) AS count FROM tabs WHERE user_id = ?', [userId]);
  
        if (existingRows[0].count > 0) {
          // If a record exists, update it
          await connection.query('UPDATE tabs SET tables = ?, tabs = ? WHERE user_id = ?', [itemsJson,tabs, userId]);
        } else {
          // If no record exists, insert a new one
          await connection.query('INSERT INTO tabs (user_id, tabs,tables) VALUES (?, ?, ?)', [userId, tabs, itemsJson]);
        }
  
        // You can send a response as needed
        res.status(200).json({ success: true, message: 'Data inserted or updated successfully' });
      } catch (error) {
        console.error('Error inserting/updating data', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } finally {
        // Release the connection when done
        connection.release();
      }
    } catch (error) {
      console.error('Error establishing a database connection', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  
  exports.getItemsByUserId = async (req, res) => {
    const { userId } = req.body;
  
    console.log('user id =   ', userId);
    try {
      const connection = await db.getConnection();
  
      try {
        const [row] = await connection.query('SELECT tabs, tables FROM tabs WHERE user_id = ?', [userId]);
  
        console.log('Database row:', row);
  
        if (!row) {
          return res.status(200).json({ success: true, message: 'No data found' });
        }
  
        const tabs = row[0].tabs ? Number(row[0].tabs) : null; // Convert tabs to a number if it's not null
        const tables = row[0].tables ? (typeof row[0].tables === 'string' ? JSON.parse(row[0].tables) : row[0].tables) : null;
  
        console.log('Final items:', { tabs, tables });
        res.status(200).json({ success: true, data: { tabs, tables } });
  
      } catch (error) {
        console.error('Error fetching items', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error establishing a database connection', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  