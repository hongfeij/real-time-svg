import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DEST_SVG_FOLDER_PATH = process.env.DEST_SVG_FOLDER_PATH!;
const SERVER_PORT = Number(process.env.SERVER_PORT!);

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

  socket.on('send-svg', async (data) => {
    console.log('Received SVG:', data.content);

    const filePath = path.join(__dirname, DEST_SVG_FOLDER_PATH, data.filename);

    try {
      await fs.promises.writeFile(filePath, data.content, { flag: 'w' }); 
      console.log(`SVG updated at ${filePath}`);
    } catch (err) {
      console.error('Error writing SVG to file:', err);
    }
  });

  socket.on('error', (err) => {
    console.error('Socket Error:', err);
  });
});

const PORT = SERVER_PORT;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error('Server Error:', err);
});
