// routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const warehouseController = require('../controllers/warehouseController');


// Route for user login
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/warehouse/insert', warehouseController.insert);
router.post('/warehouse/getList', warehouseController.getItemsByUserId);

module.exports = router;
