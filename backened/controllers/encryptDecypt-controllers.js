const encryptDecryptService = require("../services/encryptDecrypt-service");

class EncryptDecryptController {
  async encryptData(req, res){
    const { text } = req.body;
    try{
      const encryptedData = await encryptDecryptService.encrypt(text);
      return res.json({ encryptedData})
    } catch(err){
      console.log(err);
      return res.status(500).json({message: "server error"})
    }
  }

  async decryptData(req, res){
    const { encryptedData } = req.params;
    const expiryTime = req.query.expires;

    if(Date.now() > +expiryTime){
      return res.json({message: "link expired"})
    }

    const toBeDecrypted = encryptedData.split("?")[0]
    const decrypted = await encryptDecryptService.decrypt(toBeDecrypted);
    res.redirect(`${process.env.CLIENT_URL}/${decrypted}`)
  }
}

module.exports = new EncryptDecryptController();