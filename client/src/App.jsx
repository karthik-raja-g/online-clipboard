import { useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return;
    socketRef.current = io("http://localhost:5000", {
      auth: {
        sessionId: localStorage.getItem("sessionId"),
      },
    });
    socketRef.current.on("connect", (sk) => console.log(sk));
    socketRef.current.on("test", (msg) => console.log("test called" + msg));
    socketRef.current.on("sessionId", (id) => {
      console.log(id);
    });
    return () => {
      if (socketRef.current) socketRef.current.close();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("chat message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    // socketRef.current.on('test', (msg) => console.log('test called' + msg))
  }, [socketRef]);

  const sendMessage = (msg) => {
    socketRef.current.emit("chat message", { msg: message, roomId });
    setMessage("");
  };

  const joinRoom = () => {
    socketRef.current.emit("join room request", roomId, (info) => {
      console.log(info, "info");
      setJoined(true);
    });
  };

  return (
    <>
      <main>
        {joined ? (
          <>
            {" "}
            <h3>Messages</h3>
            <ul>
              {messages?.map((msg,i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </>
        ) : (
          <></>
        )}
      </main>
      <div style={{margin: '20px 0'}}>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button onClick={joinRoom}>Join room</button>
      </div>
    </>
  );
}

export default App;
