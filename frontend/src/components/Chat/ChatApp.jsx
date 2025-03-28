import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import Style from "./css/style.css";
import { SOCKET_URL } from "../../services/api";

// Use the SOCKET_URL from our centralized service
console.log("Chat connecting to socket server:", SOCKET_URL);
const socket = io.connect(SOCKET_URL);

function App(props) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(props.id);
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <div className=" text-slate-600 text-[150%] text-left ml-2">
            Contact With Owner
          </div>
          <input
            type="text"
            placeholder="Type Your Alias Here...."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          {/*<input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />*/}
          <button onClick={joinRoom}>Chat</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
