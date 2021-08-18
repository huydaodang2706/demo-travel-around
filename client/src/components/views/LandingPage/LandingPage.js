import React  from "react";
import { useSelector } from "react-redux";
import { withRouter} from 'react-router-dom';
import "./LandingPage.css";
function LandingPage(props) {
  // const content_type = useRef("")

  // 0 - nothing, 1 - waiting for the other person to accept

  const user = useSelector((state) => state.user);
  const handleVideoUpload = () => {
    props.history.push('/chatroom')
  }
  const handleVideoCall = () => {
    props.history.push('/chatroom')
  }
  return (
    <>
      {/* {redirect ? <Redirect to={roomLink} userRole={role.current} /> : ""} */}
      <div className="container">
        <div className="box" onClick={handleVideoUpload}>
          <div className="column-title">
            <h1 style={{ fontSize: "48px", fontWeight: "normal" }}>
              Đăng video
            </h1>
            <h1 style={{ fontSize: "20px", fontWeight: "normal" }}>
              Donate your video
            </h1>
            <p className="content-hover">
              {/* Recording voice clips is an integral part of building our open
              dataset; some would say it's the fun part too. */}
              Upload your video clips at any other language and you will receive
              an clips that meet your language
            </p>
            <a
              href="https://www.w3schools.com/"
              className="guide"
              target="_blank"
            >
              Guide
            </a>
          </div>
       
        </div>
        <div className="box1" onClick={handleVideoCall}>
          <div className="column-title">
            <h1 style={{ fontSize: "48px", fontWeight: "normal" }}>
              Video cùng guilder
            </h1>
            <h1 style={{ fontSize: "20px", fontWeight: "normal" }}>
              Contact guilder for experience
            </h1>
            <p className="content-hover">
              You can search for favorite destination and have a phone call with
              your guilder All languages are supported
            </p>
            <a href="https://www.w3schools.com/" className="guide">
              Guide
            </a>
          </div>
          
        </div>
      </div>
    </>
  );
}
export default withRouter(LandingPage);
