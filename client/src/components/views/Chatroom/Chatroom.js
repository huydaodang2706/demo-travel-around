import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Chatroom.css";
// import io from "socket.io-client";

export default function Chatroom(props) {
  let socket = props.socket
  //   const chatroomID = window.location.href.split("/")[5]
  const user = useSelector((state) => state.user);
  let userID = user.userData ? user.userData._id : "";
  let username = user.userData ? user.userData.name : "";

  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");

  // After Login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
    console.log('UserID:' + userID)
    console.log('Username:' + username)
    console.log('User data:' + user)
    socket.on("get-user-info", (socketId) => {
      socket.emit("send-user-info", {
        socketId: socketId,
        userId: userID
      })
    })
  }, []);

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
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
            <input
              type="text"
              placeholder="Room..."
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
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
