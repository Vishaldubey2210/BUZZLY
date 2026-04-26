'use strict';

const Event = require('../models/Event');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

class EventController {
  async getEvents(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const filter = {};
      if (req.query.category) filter.category = req.query.category;

      const events = await Event.find(filter)
        .populate('createdBy', 'buzzName handle avatar')
        .sort({ isFeatured: -1, date: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Event.countDocuments(filter);
      sendPaginated(res, { data: events, page, limit, total });
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req, res, next) {
    try {
      const newEvent = new Event({
        ...req.body,
        createdBy: req.user._id,
      });
      await newEvent.save();
      sendCreated(res, { data: newEvent, message: 'Event created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this event' });
      }

      Object.assign(event, req.body);
      await event.save();
      sendSuccess(res, { data: event, message: 'Event updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
      }

      await event.deleteOne();
      sendSuccess(res, { message: 'Event deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const event = await Event.findById(req.params.id)
        .populate('createdBy', 'buzzName handle avatar')
        .populate('attendees', 'buzzName handle avatar level');
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      sendSuccess(res, { data: event });
    } catch (error) {
      next(error);
    }
  }

  async rsvpEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ success: false, message: 'Event is full' });
      }

      const alreadyRsvp = event.attendees.includes(req.user._id);
      if (alreadyRsvp) {
        return res.status(400).json({ success: false, message: 'Already RSVPed' });
      }

      event.attendees.push(req.user._id);
      await event.save();
      sendSuccess(res, { data: event, message: 'RSVP successful! See you there 🍻' });
    } catch (error) {
      next(error);
    }
  }

  async unrsvpEvent(req, res, next) {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { $pull: { attendees: req.user._id } },
        { new: true }
      );
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      sendSuccess(res, { data: event, message: 'RSVP cancelled' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
