const RoomDto = require("../dtos/room-dto");
const roomService = require("../services/room-service");
const userService = require("../services/user-service");

class RoomsControlleer {
  async create(req, res){
    const { topic, roomType } = req.body;

    if(!topic || !roomType){
      return res.status(400).json({message: "All fields are required"})
    }

    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id
    });

    return res.json(new RoomDto(room))
  }

  async index(req, res){
    const rooms = await roomService.getAllRooms('open');
    const allRooms = rooms.map(room => new RoomDto(room));
    return res.json(allRooms)
  }

  async show(req, res) {
    const room = await roomService.getRoom(req.params.roomId);
    return res.json(room)
  }

  async clientRoom(req, res){
    const rooms = await roomService.getClientRoom(req.user._id);
    const allRooms = rooms.map(room => new RoomDto(room));
    return res.json(allRooms)
  }

  async delete(req, res){
    try{
      await roomService.deleteRoom(req.params.roomId);
      return res.json({message: "deleted"})
    } catch(err){
      console.log(err);
      return res.json({message: "delete failed"})
    }
  }

}

module.exports = new RoomsControlleer()