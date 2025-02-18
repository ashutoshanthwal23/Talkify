require("dotenv").config();
const express = require('express');
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const ACTIONS = require("./actions");

const app = express();
const _dirname = path.resolve();

const DBConnect = require("./database");

const server = require('http').createServer(app);

// Socket.IO setup
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://talkify-frontend-5ji6.onrender.com',  
    methods: ['GET', 'POST'],
    credentials: true,  
  }
});

app.use(cookieParser());
app.use(express.json({ limit: '8mb' }));


const allowedOrigins = [
  'https://talkify-frontend-5ji6.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};


app.use(cors(corsOptions));

// Database connection
 DBConnect();

// Express settings

// Routes setup
const router = require("./routes");

app.use(router);

app.get("/", (req, res) => {
  console.log(res.send("hello"));
})

// Static file serving for storage
app.use("/storage", express.static("storage"));

// Handle OPTIONS requests for preflight
app.options('*', cors(corsOptions));

// Socket.IO handling
const socketUserMapping = {};

io.on("connection", (socket) => {
  console.log('New connection:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId]
      });
    });

    socket.join(roomId);
  });

  // Mute the mic
  socket.on(ACTIONS.MUTE, ({ userId, roomId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.MUTE, { userId });
    });
  });

  // Un-mute the mic
  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.UN_MUTE, { userId });
    });
  });

  // Handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate
    });
  });

  // Handle relay SDP
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription
    });
  });

  socket.on(ACTIONS.ANSWER_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.ANSWER_SDP, { peerId: socket.id, sessionDescription });
  });

  socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      if (clientId !== socket.id) {
        io.to(clientId).emit(ACTIONS.MUTE_INFO, {
          userId,
          isMute,
        });
      }
    });
  });

  // Leave the room
  const leaveRoom = ({ roomId }) => {
    const { rooms } = socket;
    rooms.forEach(roomId => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach(clientId => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id
        });
      });

      socket.leave(roomId);
    });

    delete socketUserMapping[socket.id];
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);
});

// Server listening
const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
