const jwt = require("jsonwebtoken")
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET
const RefreshModel = require("../models/refresh-model")

class TokenService{
  generateTokens(payload){
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: '1y'
    });

    return { accessToken, refreshToken }
  }

  async storeRefreshToken(token, userId){
    try{
      await RefreshModel.create({token, userId})
    } catch(err){
      console.log(err)
    }
  }

  verifyAccessToken(token){
    return jwt.verify(token, accessTokenSecret);
  }

  verifyRefreshToken(token){
    return jwt.verify(token, refreshTokenSecret);
  }

  async findRefreshToken(userId, refreshToken){
    return await RefreshModel.findOne({userId, token: refreshToken})
  }

  async updateRefreshToken(userId, refreshToken){
    return await RefreshModel.updateOne({userId, token: refreshToken})
  }

  async removeToken(refreshToken){
    await RefreshModel.deleteOne({ token: refreshToken })
  }

}

module.exports = new TokenService()