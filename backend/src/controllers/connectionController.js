'use strict';

const connectionService = require('../services/connectionService');
const { sendSuccess, sendCreated } = require('../utils/response');

class ConnectionController {
  async sendRequest(req, res, next) {
    try {
      let io; try { io = require('../sockets').getIo(); } catch {}
      const connection = await connectionService.sendRequest(req.user._id, req.params.userId, io);
      sendCreated(res, { data: connection, message: 'Connection request sent' });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      let io; try { io = require('../sockets').getIo(); } catch {}
      const connection = await connectionService.acceptRequest(req.params.id, req.user._id, io);
      sendSuccess(res, { data: connection, message: 'Request accepted' });
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const connection = await connectionService.rejectRequest(req.params.id, req.user._id);
      sendSuccess(res, { data: connection, message: 'Request declined' });
    } catch (error) {
      next(error);
    }
  }

  async getConnections(req, res, next) {
    try {
      const connections = await connectionService.getConnections(req.user._id);
      sendSuccess(res, { data: connections });
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const requests = await connectionService.getPendingRequests(req.user._id);
      sendSuccess(res, { data: requests });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConnectionController();
