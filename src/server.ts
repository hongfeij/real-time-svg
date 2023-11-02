import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';

// Initialize Express app
const app = express();

// 1. Basic Route Handling
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// 2. Static Files Middleware (If you are serving any static files)
app.use(express.static('public'));  

// Create an HTTP server and pass the Express app as the handler
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Ensure to restrict the origin in production environment for security.
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO Connections
io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('send-svg', async (data) => {
    console.log('Received SVG:', data);

    const timestamp = new Date().toISOString().replace(/[:\-\.]/g, '_');
    const filePath = path.join(__dirname, '../dest_svg_folder', `received_${timestamp}.svg`);

    try {
      await fs.promises.writeFile(filePath, data);
      console.log(`SVG saved to ${filePath}`);
      socket.broadcast.emit('receive-svg', data); 
    } catch (err) {
      console.error('Error writing SVG to file:', err);
    }
  });
  
  // Listening to error event (optional, and might not be supported for every client-side error)
  socket.on('error', (err) => {
    console.error('Socket Error:', err);
  });
});

// Define a port and start listening
const PORT = 3494;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error('Server Error:', err);
});
