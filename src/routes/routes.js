// routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const warehouseController = require('../controllers/warehouseController');
const tablesController = require('../controllers/tablesController')
const verifyToken = require('../middleware/authMiddleware');


// Route for user login
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/warehouse/insert', warehouseController.insert);
router.post('/warehouse/getList', warehouseController.getItemsByUserId);
router.post('/tables/insert', tablesController.insert);
router.post('/tables/getList', tablesController.getItemsByUserId);



// Use the middleware in your route
router.get('/protected-route', verifyToken, (req, res) => {
    // Access req.userId here, since the middleware has already run
    res.json({ message: 'Protected route accessed successfully', userId: req.userId });
});
module.exports = router;
