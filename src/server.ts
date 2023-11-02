import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const SERVER_PORT = parseInt(process.env.SERVER_PORT || '3494', 10);
const DEST_SVG_FOLDER_PATH = process.env.DEST_SVG_FOLDER_PATH || '../dest_svg_folder';
const destSvgFolderPath = path.join(__dirname, DEST_SVG_FOLDER_PATH);

const app = express();
app.get("/", (req, res) => {
  res.send("Server is running.");
});
app.use(express.static('public'));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('send-svg', (data, filename) => {
    console.log('Received SVG:', data);

    if (!fs.existsSync(destSvgFolderPath)) {
      fs.mkdirSync(destSvgFolderPath, { recursive: true });
    }

    const filePath = path.join(destSvgFolderPath, filename);

    try {
      fs.writeFileSync(filePath, data);
      console.log(`SVG saved to ${filePath}`);
    } catch (err) {
      console.error('Error writing SVG to file:', err);
    }
  });

  socket.on('delete-svg', (filename) => {
    const filePath = path.join(destSvgFolderPath, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`SVG deleted: ${filePath}`);
      } catch (err) {
        console.error('Error deleting SVG file:', err);
      }
    }
  });

  socket.on('error', (err) => {
    console.error('Socket Error:', err);
  });
});

httpServer.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${SERVER_PORT}`);
}).on('error', (err) => {
  console.error('Server Error:', err);
});
