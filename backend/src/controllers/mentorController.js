'use strict';

const MentorProfile = require('../models/MentorProfile');
const MentorshipSession = require('../models/Session');
const { sendSuccess, sendCreated } = require('../utils/response');

class MentorController {
  async registerMentor(req, res, next) {
    try {
      const existing = await MentorProfile.findOne({ user: req.user._id });
      if (existing) {
        return res.status(400).json({ success: false, message: 'You are already registered as a mentor' });
      }

      const mentor = new MentorProfile({
        user: req.user._id,
        ...req.body
      });
      await mentor.save();
      sendCreated(res, { data: mentor, message: 'Successfully registered as a mentor!' });
    } catch (error) { next(error); }
  }

  async getMentors(req, res, next) {
    try {
      const filter = req.query.expertise ? { expertise: req.query.expertise } : {};
      const mentors = await MentorProfile.find(filter).populate('user', 'buzzName headline avatar city level');
      sendSuccess(res, { data: mentors });
    } catch (error) { next(error); }
  }

  async bookSession(req, res, next) {
    try {
      const mentorProfile = await MentorProfile.findById(req.body.mentorProfileId).populate('user');
      if (!mentorProfile) return res.status(404).json({ success: false, message: 'Mentor not found' });
      if (mentorProfile.user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Cannot book a session with yourself' });
      }

      const session = new MentorshipSession({
        mentor: mentorProfile.user._id,
        mentee: req.user._id,
        scheduledAt: req.body.scheduledAt,
        amount: mentorProfile.pricingPerSession,
        notes: req.body.notes || '',
        paymentStatus: 'paid', // Mocking instant payment
        status: 'confirmed'
      });

      await session.save();
      mentorProfile.sessionCount += 1;
      await mentorProfile.save();

      sendCreated(res, { data: session, message: 'Session booked and paid successfully!' });
    } catch (error) { next(error); }
  }

  async getMySessions(req, res, next) {
    try {
      const asMentee = await MentorshipSession.find({ mentee: req.user._id }).populate('mentor', 'buzzName avatar');
      const asMentor = await MentorshipSession.find({ mentor: req.user._id }).populate('mentee', 'buzzName avatar');
      sendSuccess(res, { data: { asMentee, asMentor } });
    } catch (error) { next(error); }
  }
}

module.exports = new MentorController();
