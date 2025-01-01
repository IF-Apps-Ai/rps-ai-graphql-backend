// Import bcrypt
const bcrypt = require('bcrypt');

// Hashing a password
const password = 'myPassword'; // Password to be hashed
const salt = bcrypt.genSaltSync(); // Generate a salt
const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password
console.log('Hashed Password:', hashedPassword);

// Comparing passwords
const isMatch = bcrypt.compareSync(password, hashedPassword); // Compare password with the hashed version
console.log('Password Match:', isMatch);
