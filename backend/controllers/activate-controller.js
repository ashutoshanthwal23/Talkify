const userService = require("../services/user-service");
const sharp = require('sharp');
const path = require("path");
const UserDto = require("../dtos/user-dto");
const { uploadToCloudinary } = require("../services/cloudinary");


class ActivateController {
  async activate(req, res){
    if(!req.file){
      return res.status(400).json({message: 'file is required'})
    }

    const { name } = req.body;

    const avatar = req.file.buffer;

    if(!name || !avatar){
      return res.status(400).json({message: 'All fields are required'})
    }

    let avatarUrl;

    try{
      avatarUrl = await uploadToCloudinary(avatar);

    } catch(err){
      console.log(err)
      return res.status(500).json({message: "couldn't process the image"})
    }

    const userId = req.user._id

    // update user
    try{
      const user = await userService.findUser({_id: userId})
      if(!user){
        return res.status(404).json({message: "user not found"})
      }
  
      user.activated = true
      user.name = name
      user.avatar = avatarUrl
      await user.save();
  
      res.json({auth: true, user: new UserDto(user)})

    } catch(err){
      res.status(500).json({message: "something went wrong"})
    }
  }
}

module.exports = new ActivateController();