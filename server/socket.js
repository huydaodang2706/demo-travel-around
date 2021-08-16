const {v4:uuidV4}  = require('uuid');

const sockets = {};
const { User } = require("./models/User");


sockets.init = (server) => {
  // socket.io setup
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  // const jwt = require("jsonwebtoken");

  // socket login go here
  // io.use(async (socket, next) => {
  //   // Must be matched with the frontend
  //   try {
  //     const token = socket.handshake.query.token;
  //     if (token !== "undefined" && token !== "null" && token !== "") {
  //       decode = await jwt.verify(token, "secret");
  //       const userId = decode.userId;
  //       userFound = await User.findOne({ _id: userId });
  //       socket.userId = userFound._id;
  //       next();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

    const connectedQueue = [];
    const chatRoomQueue = []
  //client socket
  io.on("connection", (socket) => {
    // Push socket id and user information to array queue
    console.log("Connected: " + socket.id);

    // Text chat room
    io.to(socket.id).emit("get-user-info", socket.id);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log("User Joined Room: " + data);
    });
  
    socket.on("send_message", (data) => {
      console.log(data);
      socket.to(data.room).emit("receive_message", data.content);
    });
  

    // Video chat room

    socket.on("send-user-info", ({ socketId, userId }) => {
      addConnectedQueue(connectedQueue, socketId, userId);
      console.log(`socketId: ${socketId}`)
      console.log(`userId: ${userId}`)
    });

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.id);
      removeFromConnectedQueue(connectedQueue, socket.id);
    });

    //Send a prompt to request for a call to guilder socket
    socket.on("request-guilder",({ socketId, userId, username, roomType, guilderId }) => {
        let userInfo = {
          socketId: socketId,
          userId: userId,
          username: username,
          roomType: roomType,
          guilderId: guilderId,
        };
        if (inputType === "video-call") {
          // Search for guilder socket
          guilderSocketIndex = searchGuilderId(
            connectedQueue,
            userInfo.guilderId
          );
          // Guilder has already online for calling
          if (guilderIndex != -1) {
            //Send request-connect package to guilder for response
            io.to(connectedQueue[guilderIndex].socketId).emit(
              "request-connect",
              {
                requestId: userInfo.userId,
                requestSocketId: userInfo.socketId,
                roomType: userInfo.roomType
              }
            );
          }
        }
      }
    );
      // Receive accept-connect package from guilder (response from guilder)
    socket.on('accept-connect', async ({guilderId, guilderSocketId, userId, userSocketId, roomType}) => {
        try {
            roomId = await createRoom(userId, guilderId, userSocketId, guilderSocketId, roomType, chatRoomQueue)
            io.to(userSocketId).emit('connect-success',({
                roomId: roomId
            }))
            io.to(guilderSocketId).emit('connect-success',({
                roomId: roomId
            }))                
        } catch (error) {
        console.log(error)            
        }
    })

    //Cancel request from user
    socket.on('cancel-connect', ({requestId, requestSocketId}) => {
        io.to(requestSocketId).emit('refuse-connect',{})
    })

    //Join room 
    socket.on('joinRoom', ({chatRoomId, username}) => {
        socket.join(chatRoomId)
        console.log(`The user ${username} has joined chatroom: ${chatRoomId}`)
        io.to(chatRoomId).emit('joinRoom-announce', {
            username: username
        })
    })

    //Leave room
    socket.on('leave-room', ({chatRoomId, username}) => {
        socket.leave(chatRoomId)
        console.log(`The user ${username} has left chatroom: ${chatRoomId}`)
        io.to(chatRoomId).emit('leaveRoom-announce', {
            username: username
        })
    })
  });
};

const addConnectedQueue = (queue, socketId, userId) => {
  for (x of queue) {
    if (x.socketId === socketId) {
      console.log("User has already in connected List");
      return null;
    }
  }
  queue.push({ socketId, userId });
  return socketId;
};

const removeFromConnectedQueue = (queue, socketId) => {
  var index = queue.findIndex((item) => compareObject(item, socketId));
  if (index != -1) {
    return queue.splice(index, 1);
  }
  return null;
};

const compareObject = (obj1, id) => {
  return obj1.socketId === id;
};

const searchGuilderId = (queue, guilderId) => {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].userId === guilderId) {
      return i;
    }
  }
  return -1;
};

const createRoom = async (userId1, userId2, userSocketId1, userSocketId2, roomType, roomQueue) => {
    const name = await generateName(4);
    
    const chatRoom = {
        name: name,
        roomType: roomType,
        userId1: userId1,
        userSocketId1: userSocketId1,
        userId2: userId2,
        userSocketId2: userSocketId2,
        roomId: uuidV4()// -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 
    }
    roomQueue.push(chatRoom)
    return chatRoom.roomId
}

const generateName = () => {
    return 'A random room name'
}
module.exports = sockets;