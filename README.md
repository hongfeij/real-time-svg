# SVG Synchronizer Tool

## Overview
The SVG Synchronizer Tool provides real-time synchronization of SVG files between a producer and a server. When the producer generates a SVG file in a designated folder, it sends them to the server. The server receives the file, updating or creating the SVG file with the received content.

## Setup and Installation

### Prerequisites
- Node.js and npm
- `.env` file with the required environment variables placed in the root directory

### Environment Variables
- `SERVER_URL`: The URL of the server including port
- `SRC_SVG_FOLDER_PATH`: Relative path to the folder watched by the producer for SVG files
- `DEST_SVG_FOLDER_PATH`: Relative path to the folder where the server will save SVG files
- `SERVER_PORT`: Port on which the server listens

### Installation Steps
1. **Clone the Repository**:

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Run the Server**:
    ```sh
    node server.ts
    ```

4. **Run the Producer** (in a separate terminal window):
    ```sh
    node producer.ts
    ```

## Usage
1. Place SVG files into the folder specified by `SVG_FOLDER_PATH` in your `.env` file.
2. The producer detects any new or modified SVG files and sends them to the server.
3. The server will save or overwrite these SVGs in the folder specified by `DEST_SVG_FOLDER_PATH` in your `.env` file, retaining the filename.
