import { io } from 'socket.io-client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = process.env.SERVER_URL!;
const SRC_SVG_FOLDER_PATH = process.env.SRC_SVG_FOLDER_PATH!;

const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to Server');

  const svgFolderPath = path.join(__dirname, SRC_SVG_FOLDER_PATH);

  const sendSvgFile = (filename: string) => {
    const filePath = path.join(svgFolderPath, filename);
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    socket.emit('send-svg', { filename, content: svgContent }, (response: any) => {
      console.log('Server responded:', response);
    });
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
    if (eventType === 'rename' && filename && path.extname(filename) === '.svg') {
      sendSvgFile(filename);
    }
  });
});
