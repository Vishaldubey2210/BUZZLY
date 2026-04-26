'use strict';

const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');

const getIo = () => { try { return require('../sockets').getIo(); } catch { return null; } };

class UserController {
  async getMe(req, res, next) {
    try {
      const user = await userService.getUserById(req.user._id);
      sendSuccess(res, { data: user });
    } catch (error) { next(error); }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user._id, req.body);
      sendSuccess(res, { data: user, message: 'Profile updated' });
    } catch (error) { next(error); }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      const isFollowing = await userService.isFollowing(req.user._id, req.params.id);
      sendSuccess(res, { data: { ...user.toObject(), isFollowing } });
    } catch (error) { next(error); }
  }

  async searchUsers(req, res, next) {
    try {
      const users = await userService.searchUsers(req.query.q || '', req.user._id);
      sendSuccess(res, { data: users });
    } catch (error) { next(error); }
  }

  async getSuggestions(req, res, next) {
    try {
      const suggestions = await userService.getSuggestions(req.user._id);
      sendSuccess(res, { data: suggestions });
    } catch (error) { next(error); }
  }

  async getLeaderboard(req, res, next) {
    try {
      const users = await userService.getLeaderboard();
      sendSuccess(res, { data: users });
    } catch (error) { next(error); }
  }

  async getUserStats(req, res, next) {
    try {
      const stats = await userService.getUserStats(req.params.id || req.user._id);
      sendSuccess(res, { data: stats });
    } catch (error) { next(error); }
  }

  async followUser(req, res, next) {
    try {
      const result = await userService.followUser(req.user._id, req.params.id, getIo());
      sendSuccess(res, { data: result, message: result.following ? 'Following!' : 'Unfollowed' });
    } catch (error) { next(error); }
  }

  async getFollowers(req, res, next) {
    try {
      const users = await userService.getFollowers(req.params.id);
      sendSuccess(res, { data: users });
    } catch (error) { next(error); }
  }

  async getFollowing(req, res, next) {
    try {
      const users = await userService.getFollowing(req.params.id);
      sendSuccess(res, { data: users });
    } catch (error) { next(error); }
  }

  async addDrinkJourney(req, res, next) {
    try {
      const entries = await userService.addDrinkJourneyEntry(req.user._id, req.body);
      sendSuccess(res, { data: entries, message: 'Drink journey updated' });
    } catch (error) { next(error); }
  }

  async updateDrinkJourney(req, res, next) {
    try {
      const entries = await userService.updateDrinkJourneyEntry(req.user._id, req.params.entryId, req.body);
      sendSuccess(res, { data: entries, message: 'Entry updated' });
    } catch (error) { next(error); }
  }

  async deleteDrinkJourney(req, res, next) {
    try {
      await userService.deleteDrinkJourneyEntry(req.user._id, req.params.entryId);
      sendSuccess(res, { message: 'Entry deleted' });
    } catch (error) { next(error); }
  }
}

module.exports = new UserController();
