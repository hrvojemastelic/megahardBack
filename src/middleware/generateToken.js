const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    // Define your secret key (you should ideally store this in a secure environment)
    const secretKey = 'your_secret_key';
    
    // Generate the JWT token with user ID payload
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Adjust expiration as needed
    
    return token;
};

module.exports = generateToken;
