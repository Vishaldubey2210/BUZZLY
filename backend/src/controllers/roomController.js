'use strict';

const Room = require('../models/Room');
const { sendSuccess, sendCreated } = require('../utils/response');
const crypto = require('crypto');

class RoomController {
  async getRooms(req, res, next) {
    try {
      const rooms = await Room.find({ type: { $ne: 'private' } }).populate('admin', 'buzzName avatar');
      sendSuccess(res, { data: rooms });
    } catch (error) { next(error); }
  }

  async createRoom(req, res, next) {
    try {
      const { name, type } = req.body;
      const inviteCode = type === 'private' ? crypto.randomBytes(4).toString('hex') : undefined;
      
      const room = new Room({
        name, type, inviteCode,
        admin: req.user._id,
        participants: [req.user._id]
      });
      await room.save();
      sendCreated(res, { data: room, message: 'Room created successfully' });
    } catch (error) { next(error); }
  }

  async joinRoom(req, res, next) {
    try {
      const { inviteCode } = req.body;
      let room;

      if (inviteCode) {
        room = await Room.findOne({ inviteCode });
      } else {
        room = await Room.findById(req.params.id);
      }

      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      if (room.type === 'request' && room.admin.toString() !== req.user._id.toString()) {
        if (!room.requests.includes(req.user._id)) {
          room.requests.push(req.user._id);
          await room.save();
          return sendSuccess(res, { message: 'Join request sent to admin' });
        }
        return res.status(400).json({ success: false, message: 'Join request already sent' });
      }

      if (!room.participants.includes(req.user._id)) {
        room.participants.push(req.user._id);
        await room.save();
      }

      const populatedRoom = await Room.findById(room._id).populate('participants', 'buzzName avatar');
      sendSuccess(res, { data: populatedRoom, message: 'Joined room successfully' });
    } catch (error) { next(error); }
  }

  async leaveRoom(req, res, next) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      room.participants = room.participants.filter(p => p.toString() !== req.user._id.toString());
      
      if (room.participants.length === 0) {
        await room.deleteOne();
      } else if (room.admin.toString() === req.user._id.toString()) {
        room.admin = room.participants[0]; // Assign new admin
        await room.save();
      } else {
        await room.save();
      }

      sendSuccess(res, { message: 'Left room successfully' });
    } catch (error) { next(error); }
  }
}

module.exports = new RoomController();
