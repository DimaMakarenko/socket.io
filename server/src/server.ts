import http from 'http';
import express from 'express';
import { ServerSocket } from './socket';

const application = express();

// Server Handling
const httpServer = http.createServer(application);

// Start the Socket

new ServerSocket(httpServer)

// Log the request
application.use((request, response, next) => {
  console.info(`Method :[${request.method}] - URL: [${request.url}] - IP: [${request.socket.remoteAddress}]`);
  
  response.on('finish', () => {
    console.info(`Method :[${request.method}] - URL: [${request.url}] - IP: [${request.socket.remoteAddress}]`);
  });

  next();
})


// Parse the body of the request
application.use(express.urlencoded({ extended: true }));
application.use(express.json());

// Rules of our API
application.use((request, response, next) => {
  response.header('Access-Control-Alow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (request.method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return response.status(200).json();
  }

  next();
})

// Health check
application.get('/ping', (_, response) => {
  return response.status(200).json({ status: 'Ok!' })
})

// Error handling
application.use((_, response) => {
  const error = new Error('Not found');

  response.status(404).json({
    message: error.message
  });
});

// Listen
httpServer.listen(3007, () => console.info('Server is running'))
