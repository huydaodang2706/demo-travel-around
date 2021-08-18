import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Chatroom.css";
// import io from "socket.io-client";

export default function Chatroom(props) {
  let socket = props.socket;
  //   const chatroomID = window.location.href.split("/")[5]
  const user = useSelector((state) => state.user);
  let userID = user.userData ? user.userData._id : "";
  let username = user.userData ? user.userData.name : "";
  const [socketId, setSocketId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [guilderId, setGuilderId] = useState("");
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  // After Login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {

    socket.on("joinRoom-announce", ({ username }) => {
      console.log(`the user ${username} has join the room with us`);
    });
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  },[])
  useEffect(() => {
    
    if (username !== ""){
      socket.on("connect-success", ({ roomId }) => {
        setLoggedIn(true);
        setRoomId(roomId)
        socket.emit("joinRoom", {roomId, username});
        console.log('Connect success and client send joinRoom package')
      });
  
    }
  }, [username]);
  useEffect(() => {
    // console.log("UserID:" + userID);
    // console.log("Username:" + username);
    // console.log("User data:" + user);
    if (userID !== "") {
      socket.emit("load-user-infor-done", {});
    }
    if (userID !== "" && socketId !== ""){
      socket.on("request-connect", ({requestId, requestSocketId, roomType}) => {
        console.log(`Socket id in request-connect ${socketId}`)
        socket.emit('accept-connect', {
          guilderId: userID,
          guilderSocketId: socketId,
          userId: requestId,
          userSocketId: requestSocketId,
          roomType: roomType
        })
        console.log('Guilder receive request-connect package and emit accept-connect package')
      })
    }

    socket.on("get-user-info", (socket_Id) => {
      setSocketId(socket_Id);
      socket.emit("send-user-info", {
        socketId: socket_Id,
        userId: userID,
      });
    });

  }, [userID, socketId]);

  const connectToGuilder = () => {
    // console.log(socketId)
    socket.emit("request-guilder", {
      socketId: socketId,
      userId: userID,
      username: username,
      roomType: "video-call",
      guilderId: guilderId,
    });
    console.log('Emit package request-guilder')

  };

  const sendMessage = async () => {
    let messageContent = {
      room: roomId,
      content: {
        author: username,
        message: message,
      },
    };

    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input
              type="text"
              placeholder="Name..."
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            {/* Input Partner ID */}
            <input
              type="text"
              placeholder="Guilder ID..."
              onChange={(e) => {
                setGuilderId(e.target.value);
              }}
            />
          </div>
          <button onClick={connectToGuilder}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, key) => {
              return (
                <div
                  className="messageContainer"
                  id={val.author == userName ? "You" : "Other"}
                >
                  <div className="messageIndividual">
                    {val.author}: {val.message}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="messageInputs">
            <input
              type="text"
              placeholder="Message..."
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
