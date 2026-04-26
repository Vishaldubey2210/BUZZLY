'use strict';

const Venue = require('../models/Venue');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

class VenueController {
  async getVenues(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const filter = {};
      if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
      if (req.query.type) filter.type = req.query.type;

      const venues = await Venue.find(filter)
        .sort({ isFeatured: -1, followers: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Venue.countDocuments(filter);
      sendPaginated(res, { data: venues, page, limit, total });
    } catch (error) {
      next(error);
    }
  }

  async getVenueById(req, res, next) {
    try {
      const venue = await Venue.findById(req.params.id).populate('createdBy', 'buzzName handle avatar');
      if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
      sendSuccess(res, { data: venue });
    } catch (error) {
      next(error);
    }
  }

  async followVenue(req, res, next) {
    try {
      const venue = await Venue.findById(req.params.id);
      if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });

      const alreadyFollowing = venue.followers.includes(req.user._id);
      if (alreadyFollowing) {
        venue.followers.pull(req.user._id);
      } else {
        venue.followers.push(req.user._id);
      }
      await venue.save();

      const User = require('../models/User');
      if (alreadyFollowing) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { followedVenues: venue._id } });
      } else {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { followedVenues: venue._id } });
      }

      sendSuccess(res, {
        data: { following: !alreadyFollowing, followerCount: venue.followers.length },
        message: alreadyFollowing ? 'Unfollowed venue' : 'Following venue'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VenueController();
