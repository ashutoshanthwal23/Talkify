const crypto = require('crypto');
const EncryptModel = require("../models/encrypt-model"); // Assuming you have a model to store encrypted data

class EncryptDecrypt {
  
  // Function to derive a 256-bit key from a password using PBKDF2
  deriveKey(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, key) => {
        if (err) return reject(err);
        resolve(key);
      });
    });
  }

  // Encryption function
  async encrypt(text) {
    const password = process.env.SECRET_KEY;

    // Generate a random salt for encryption
    const salt = crypto.randomBytes(16);

    // Derive the key from the password and the salt
    const key = await this.deriveKey(password, salt);

    // Generate a random IV (Initialization Vector)
    const iv = crypto.randomBytes(16); // AES-256-CBC requires a 16-byte IV

    // Create a cipher instance
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Save the encrypted data, iv, and salt in the database
    await EncryptModel.create({
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      salt: salt.toString('hex')
    });

    // Return the encrypted data
    const time = Date.now();
    const expiryTime = time + 1000 * 60 * 5;
    return `${process.env.BASE_URL}/encrypted/${encrypted}?expires=${expiryTime}`;
  }

  // Decryption function
  async decrypt(encryptedData) {
    try {
      const password = process.env.SECRET_KEY;

      // Fetch the record containing the encrypted data
      const record = await EncryptModel.findOne({ encryptedData });

      if (!record) {
        throw new Error("Encrypted data not found");
      }

      const { iv, salt } = record;  // Retrieve iv and salt from the database

      // Derive the key using both the password and the salt
      const key = await this.deriveKey(password, Buffer.from(salt, 'hex'));  // Pass the salt here
      console.log("key:", key.toString('hex')); // Log the derived key

      // Create the decipher using the derived key and IV
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
      console.log("decipher:", decipher);

      // Decrypt the data
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
      
    } catch (err) {
      console.log("Decryption error:", err);
      throw new Error("Decryption failed: " + err.message);
    }
  }
}

module.exports = new EncryptDecrypt();
