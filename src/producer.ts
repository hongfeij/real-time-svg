import { io } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

const socket = io('http://172.30.78.47:3494');

socket.on('connect', () => {
  console.log('Connected to Server');

  const svgFolderPath = path.join(__dirname, '../svg_folder');

  // Function to send SVG file to the server
  const sendSvgFile = (filename: string) => {
    const filePath = path.join(svgFolderPath, filename);
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    socket.emit('send-svg', svgContent, (response: any) => {
      console.log('Server responded:', response);
    });
  };

  // Initially send existing SVG files
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

  // Watch for new SVG files
  fs.watch(svgFolderPath, (eventType, filename) => {
    if (eventType === 'rename' && filename && path.extname(filename) === '.svg') {  // Checking if a new SVG file is added
      sendSvgFile(filename);
    }
  });
});
