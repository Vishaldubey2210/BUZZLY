'use strict';

const User = require('../models/User');

class UserService {
  async getUserById(id) {
    const user = await User.findById(id).select('-createdAt -updatedAt -__v');
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-createdAt -updatedAt -__v');
    
    if (!user) throw new Error('User not found');
    return user;
  }

  async searchUsers(query, currentUserId) {
    return User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        {
          $or: [
            { buzzName: { $regex: query, $options: 'i' } },
            { handle: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    })
    .select('buzzName handle avatar level')
    .limit(10);
  }

  async getSuggestions(currentUserId) {
    // Basic aggregation: exclude self, suggest random 5
    return User.aggregate([
      { $match: { _id: { $ne: currentUserId } } },
      { $sample: { size: 5 } },
      { $project: { buzzName: 1, handle: 1, avatar: 1, level: 1 } }
    ]);
  }
}

module.exports = new UserService();
