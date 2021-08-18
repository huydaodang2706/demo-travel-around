import React, { Suspense } from "react";
import { Route, Switch ,withRouter} from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import { useEffect } from "react";
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import Chatroom from "./views/Chatroom/Chatroom";
import io from "socket.io-client";
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside
let socket;
function App(props) {
  const CONNECTION_PORT = "localhost:5000/";
  const socket = io(CONNECTION_PORT, {});

  // const setupSocket = async () => {
  //   socket = io(CONNECTION_PORT, {});
  //   socket.on("disconnect", () => {
  //     socket = null;
  //     console.log("Socket Disconnected!");
  //   });
  //   socket.on("connection", () => {
  //     console.log("Socket Connected!");
  //   });
  // };
  // useEffect(() => {
  //   setupSocket();
  // }, [CONNECTION_PORT]);
  const LandingPageWithSocket = () => (<LandingPage socket={socket}/>)
  const LoginPageWithSocket = () => (<LoginPage socket={socket} />)
  const ChatroomWithSocket = () => <Chatroom socket={socket} />;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPageWithSocket, true)} />
          <Route exact path="/login" component={Auth(LoginPageWithSocket, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          
          <Route
            exact
            path="/chatroom"
            component={Auth(ChatroomWithSocket, true)}
          />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default withRouter(App);
