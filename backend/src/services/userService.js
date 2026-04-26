'use strict';

const User = require('../models/User');
const Connection = require('../models/Connection');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

const pushNotification = async (io, notifData) => {
  try {
    const notif = await Notification.create(notifData);
    const populated = await notif.populate('sender', 'buzzName avatar');
    if (io) io.to(notifData.recipient.toString()).emit('new_notification', populated);
  } catch {}
};

class UserService {
  async getUserById(id) {
    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowed = ['buzzName', 'bio', 'headline', 'city', 'website', 'drinkPreferences', 'avatar', 'coverImage', 'notificationPrefs', 'location', 'locationSet'];
    const filtered = Object.keys(updateData)
      .filter(k => allowed.includes(k))
      .reduce((obj, k) => { obj[k] = updateData[k]; return obj; }, {});
    const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true })
      .select('-password -refreshToken');
    if (!user) throw new Error('User not found');
    return user;
  }

  // Drink Journey CRUD
  async addDrinkJourneyEntry(userId, entry) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { drinkJourney: entry } },
      { new: true }
    ).select('drinkJourney');
    return user.drinkJourney;
  }

  async updateDrinkJourneyEntry(userId, entryId, entry) {
    const user = await User.findOne({ _id: userId, 'drinkJourney._id': entryId });
    if (!user) throw new Error('Entry not found');
    await User.updateOne(
      { _id: userId, 'drinkJourney._id': entryId },
      { $set: { 'drinkJourney.$': { ...entry, _id: entryId } } }
    );
    const updated = await User.findById(userId).select('drinkJourney');
    return updated.drinkJourney;
  }

  async deleteDrinkJourneyEntry(userId, entryId) {
    await User.findByIdAndUpdate(userId, { $pull: { drinkJourney: { _id: entryId } } });
    return true;
  }

  // Follow/Unfollow
  async followUser(followerId, targetId, io) {
    if (followerId.toString() === targetId.toString()) throw new Error('Cannot follow yourself');
    const target = await User.findById(targetId);
    if (!target) throw new Error('User not found');

    const alreadyFollowing = target.followers.includes(followerId);

    if (alreadyFollowing) {
      await User.findByIdAndUpdate(targetId, { $pull: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $pull: { following: targetId } });
    } else {
      await User.findByIdAndUpdate(targetId, { $addToSet: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $addToSet: { following: targetId } });
      await pushNotification(io, {
        recipient: targetId, sender: followerId, type: 'follow',
        content: 'started following you 🍻',
      });
    }

    const updated = await User.findById(targetId).select('followers following');
    return {
      following: !alreadyFollowing,
      followerCount: updated.followers.length,
      followingCount: updated.following.length,
    };
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
    }).select('buzzName handle avatar level xp bio headline city drinkPreferences').limit(10);
  }

  async getSuggestions(currentUserId) {
    const existingConnections = await Connection.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
    });
    const me = await User.findById(currentUserId).select('following');
    const excludeIds = new Set([currentUserId.toString()]);
    existingConnections.forEach(c => {
      excludeIds.add(c.requester.toString());
      excludeIds.add(c.recipient.toString());
    });
    (me?.following || []).forEach(id => excludeIds.add(id.toString()));

    return User.aggregate([
      {
        $match: {
          _id: { $nin: [...excludeIds].map(id => {
            const mongoose = require('mongoose');
            return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
          }).filter(Boolean) }
        }
      },
      { $sample: { size: 10 } },
      { $project: { buzzName: 1, handle: 1, avatar: 1, level: 1, xp: 1, bio: 1, headline: 1, city: 1, drinkPreferences: 1 } },
    ]);
  }

  async getLeaderboard() {
    return User.find().select('buzzName handle avatar level xp headline city').sort({ xp: -1 }).limit(20);
  }

  async getUserStats(userId) {
    const postCount = await Post.countDocuments({ author: userId });
    const connectionCount = await Connection.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    });
    const user = await User.findById(userId).select('followers following savedPosts');
    return {
      postCount,
      connectionCount,
      followerCount: user?.followers?.length || 0,
      followingCount: user?.following?.length || 0,
    };
  }

  async getFollowers(userId) {
    const user = await User.findById(userId).populate('followers', 'buzzName handle avatar level xp headline bio');
    return user?.followers || [];
  }

  async getFollowing(userId) {
    const user = await User.findById(userId).populate('following', 'buzzName handle avatar level xp headline bio');
    return user?.following || [];
  }

  async isFollowing(viewerId, targetId) {
    const target = await User.findById(targetId).select('followers');
    return target?.followers?.includes(viewerId) || false;
  }
}

module.exports = new UserService();
