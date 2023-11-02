import { io } from 'socket.io-client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3494';
const SRC_SVG_FOLDER_PATH = process.env.SRC_SVG_FOLDER_PATH || '../svg_folder';
const svgFolderPath = path.join(__dirname, SRC_SVG_FOLDER_PATH);

const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to Server');

  if (!fs.existsSync(svgFolderPath)) {
    fs.mkdirSync(svgFolderPath, { recursive: true });
  }

  const sendSvgFile = (filename: string) => {
    const filePath = path.join(svgFolderPath, filename);
    if (fs.existsSync(filePath)) {
      const svgContent = fs.readFileSync(filePath, 'utf-8');
      socket.emit('send-svg', svgContent, filename, (response: any) => {
        console.log('Server responded:', response);
      });
    }
  };


  fs.readdir(svgFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading the svg_folder directory', err);
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.svg') {
        sendSvgFile(file);
      }
    });
  });

  fs.watch(svgFolderPath, (eventType, filename) => {
    if (filename && path.extname(filename) === '.svg') {
        const filePath = path.join(svgFolderPath, filename);
        if (eventType === 'rename' && !fs.existsSync(filePath)) {
            socket.emit('delete-svg', filename);
        } else if ((eventType === 'change' || eventType === 'rename') && fs.existsSync(filePath)) {
            sendSvgFile(filename);
        }
    }
});


});

socket.on('connect_error', (error) => {
  console.error('Connection Error:', error);
});

socket.on('connect_timeout', () => {
  console.error('Connection Timeout');
});