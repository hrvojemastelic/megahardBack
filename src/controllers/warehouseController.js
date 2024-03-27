const db = require('../../config/db');
const Warehouse = require('../models/warehouse');
exports.insert = async (req, res) => {
    const { itemList, userId } = req.body;
  
    try {
      // Check if itemList is empty or null
      if (!itemList || itemList.length === 0) {
        return res.status(400).json({ success: false, error: 'Item list is empty or null' });
      }
  
      // Check if userId is null
      if (userId === null) {
        return res.status(400).json({ success: false, error: 'User ID is null' });
      }
  
      // Assuming your db module provides a 'query' function for executing SQL queries
      const connection = await db.getConnection();
  
      try {
        // Convert the items to JSON with auto-incremented ids based on the index
        const itemsWithAutoIncrement = itemList.map((item, index) => ({
          id: index + 1,
          name: item.name || '',       // Ensure each field is present, use default values if necessary
          value: item.value || 0,
          quantity: item.quantity || 0,
          category: item.category || 0,
          qToPay:item.qToPay || 1
        }));
  
        // Convert the items to JSON
        const itemsJson = JSON.stringify(itemsWithAutoIncrement);
  
        // Check if a record with the given userId already exists
        const [existingRows] = await connection.query('SELECT COUNT(*) AS count FROM warehouse WHERE userId = ?', [userId]);
  
        if (existingRows[0].count > 0) {
          // If a record exists, update it
          await connection.query('UPDATE warehouse SET items_json = ? WHERE userId = ?', [itemsJson, userId]);
        } else {
          // If no record exists, insert a new one
          await connection.query('INSERT INTO warehouse (userId, items_json) VALUES (?, ?)', [userId, itemsJson]);
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
  
    try {
      const connection = await db.getConnection();
  
      try {
        const [rows] = await connection.query('SELECT items_json FROM warehouse WHERE userId = ?', [userId]);
  
        if (rows.length === 0) {
          return res.status(200).json({ success: true, message: 'List is empty' });
        }
  
        const items = rows.map((row) => {
          const parsedJson = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : row.items_json;
  
          // Check if parsedJson is an array and has at least one item
          if (Array.isArray(parsedJson) && parsedJson.length > 0) {
            return parsedJson.map(({ id, name, value, quantity, category,qToPay }) => ({
              id,
              name: name || '',
              value: value || 0,
              quantity: quantity || 0,
              category: category || '',
              qToPay:qToPay || 1
            }));
          } else {
            console.error('Invalid or empty parsedJson:', parsedJson);
            return []; // Return an empty array when there are no items
          }
        }).flat(); // Use flat() to flatten the array of arrays into a single array
  
        if (items.length === 0) {
          return res.status(200).json({ success: true, message: 'List is empty' });
        }
  
        console.log('Final items array:', items);
        res.status(200).json({ success: true, items });
  
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
  