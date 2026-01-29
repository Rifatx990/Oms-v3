// backend/src/utils/socket.js
const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join:branch', (branchId) => {
        socket.join(`branch:${branchId}`);
      });

      socket.on('order:created', (order) => {
        socket.to(`branch:${order.branch}`).emit('order:new', order);
      });

      socket.on('order:updated', (order) => {
        socket.to(`branch:${order.branch}`).emit('order:update', order);
      });

      socket.on('due:payment', (payment) => {
        socket.to(`branch:${payment.branch}`).emit('due:paid', payment);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  }
};
