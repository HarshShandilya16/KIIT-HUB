import dotenv from 'dotenv';
// Configure environment variables at the start
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/db/conn';
import app from './app'; // Import the Express app from app.ts

// Check for required environment variables
if (!process.env.PORT) {
  console.warn("PORT environment variable not found, using default 5001");
}

if (!process.env.DB) {
  console.warn("DB environment variable not found, MongoDB connection will fail");
}

// Log important configuration
console.log("Server starting with configuration:");
console.log(`- Port: ${process.env.PORT || 5001}`);
console.log(`- Database: ${process.env.DB ? "Configured" : "Not configured"}`);
console.log(`- Environment: ${process.env.NODE_ENV || "development"}`);

// Add health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Port number from environment variable
const port = process.env.PORT || 5001;

// Initialize MongoDB connection and start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Create the server
    const server = http.createServer(app);

    // Configure Socket.io
    const io = new Server(server, {
      path: '/socket.io',
      allowEIO3: true, // Add compatibility for older clients
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003',
          'http://localhost:3004',
          'http://localhost:3005',
          'http://localhost:3006',
          'http://localhost:8000',
          'http://localhost:8080',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:5173',
          'http://192.168.1.2:3000',
          'https://kiithub-frontend.vercel.app',
          'https://kiithub.vercel.app',
          'https://kiit-hub.vercel.app',
          'https://kiit-hub-w7f4.vercel.app'
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true
      },
      transports: ['polling'], // Only use polling to avoid WebSocket issues
      pingTimeout: 30000,
      pingInterval: 25000
    });

    io.on("connection", (socket) => {
      console.log("New socket connection: ", socket.id);
      
      // Handle chat room joining
      socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User ${socket.id} joined room: ${data}`);
      });

      // Handle message sending
      socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
        console.log(`Message sent in room ${data.room} by ${socket.id}`);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    // Add Socket.io health check route
    app.get('/socket-health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        socketio: io ? 'initialized' : 'not initialized',
        timestamp: new Date().toISOString(),
        version: '1.0.1'
      });
    });

    // Start listening only after MongoDB is connected
    server.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`Try accessing these routes to test:
- http://localhost:${port}/health     (Health check)
- http://localhost:${port}/test       (API test)
- http://localhost:${port}/wishlist-test (Wishlist API test)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(err => {
  console.error('Unhandled error during server startup:', err);
  process.exit(1);
});
