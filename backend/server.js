'use strict';

const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const { initSocket } = require('./src/sockets');

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    initSocket(server);

    // Start listening
    server.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
