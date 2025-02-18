const otpService = require("../services/otp-service")
const hashService = require("../services/hash-service")
const userService = require("../services/user-service")
const tokenService = require("../services/token-service")
const mailService = require("../services/mail-service")
const UserDto = require("../dtos/user-dto")

class AuthController {
  async sendOtp(req, res){
    const { phone, email } = req.body

    if(!phone && !email){
      return res.status(400).json({ message: 'All fields are required' })
    }

    const otp = await otpService.generateOtp();

    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    let data;

    if(phone){
      data = `${phone}.${otp}.${expires}`
    }

    if(email) {
      data = `${email}.${otp}.${expires}`
    }
    
    const hash = hashService.hashOtp(data)

   try {
    if(phone){
      await otpService.sendBySms(phone, otp);
    }

    if(email){
      const msg = `your otp for talkify is ${otp}`;
      await mailService.sendByMail(email, "OTP", msg);
    }

    return res.json({
      hash: `${hash}.${expires}`,
      phone,
      email,
      otp
    })

   } catch(err){
    console.log(err)
    res.status(500).json({ message: "message sending failed"})
   }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone, email } = req.body;

    if(!otp || !hash){
      return res.status(400).json({ message: "All fields are required"})
    }
    if(!phone && !email){
      return res.status(400).json({ message: "All fields are required"})
    }

    const [hashedOtp, expires] = hash.split(".");
    if(Date.now() > +expires){
      return res.status(400).json({message: "OTP expired"})
    }

    let data;
    if(phone){
      data = `${phone}.${otp}.${expires}`
    }

    if(email){
      data = `${email}.${otp}.${expires}`
    }

    const isValid = otpService.verifyOtp(hashedOtp, data);
    if(!isValid){
      return res.status(400).json({message: "Invalid OTP"})
    }

    let user;
    try{
      const filter = {};
      if(phone) filter.phone = phone;
      if(email) filter.email = email;

      user = await userService.findUser(filter)
      if(!user){
        user = await userService.createUser(filter)
      }
    }
    catch(err){
      console.log(err)
      return res.status(500).json({message: "Db error"})
    }

    const  { accessToken, refreshToken } = tokenService.generateTokens({_id: user._id, activated: false});

    await tokenService.storeRefreshToken(refreshToken, user._id)

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    })

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    })

    const userDto = new UserDto(user);

    return res.json({auth: true, user: userDto});
  }

  async refresh(req, res){
    // get refresh token form cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    // check if token is valid
    let userData;
    try{
      userData = tokenService.verifyRefreshToken(refreshTokenFromCookie);

    } catch(err){
      console.log(err)
      return res.status(401).json({message: "Invalid token"})
    }

    // check if token is in db
    try{
      const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
      
      if(!token){
        return res.status(401).json({message: 'invalid token'})
      }
    } catch(err){
      return res.status(500).json({message: 'internal error'})
    }    

    // check if valid user
    const user = await userService.findUser({_id: userData._id})
    if(!user){
      return res.status(404).json({message: "no user"})
    }

    // generate tokens
    const  { accessToken, refreshToken } = tokenService.generateTokens({_id: user._id});

    try{
      await tokenService.updateRefreshToken(user._id, refreshToken)
    } catch(err){
      return res.status(500).json({message: "internal error"})
    }

    // put in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    })

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    })

    const userDto = new UserDto(user)
    res.json({auth: true, user: userDto})
  }

  async logout(req, res){
    const { refreshToken } = req.cookies;
    await tokenService.removeToken(refreshToken)

    // delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.json({ user: null, auth: false })
  }
}


module.exports = new AuthController();