import { useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Form from "./components/InputForm";
import data from './mockData';
import MessageList from "./components/MessageList";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [ownRoomId, setOwnRoomId] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return;
    socketRef.current = io("http://192.168.0.105:5000", {
      auth: {
        sessionId: localStorage.getItem("sessionId"),
      },
    });
    socketRef.current.on("connect", (sk) => {
      console.log(sk);
    });
    socketRef.current.on("socketDisconnected", (sk) => {
      setRoomId("");
      setMessage("");
      setMessages([]);
      setJoined(false);
      console.log("socket left");
    });
    // socketRef.current.on('socketDisconnected', () => console.log('socket left'))
    socketRef.current.on("test", (msg) => console.log("test called" + msg));
    socketRef.current.on("sessionId", (id) => {
      console.log(id);
      setOwnRoomId(id);
      // ownId = id
    });
    return () => {
      if (socketRef.current) socketRef.current.close();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("chat message", (message) => {
      console.log("msg received", message);
      setMessages((prev) => [...prev, message]);
    });
    socketRef.current.on("new connection", (data) => {
      console.log("new joinee", data);
      setJoined(true);
      setRoomId(data.roomId);
      setIsHost(true);
    });
    socketRef.current.on("old messages", ({ messages }) => {
      setMessages(messages);
      // console.log('old', msgs)
    });
    // socketRef.current.on('test', (msg) => console.log('test called' + msg))
  }, [socketRef]);

  const sendMessage = (msg) => {
    socketRef.current.emit("chat message", { msg, roomId });
    // setMessage("");
  };

  const joinRoom = () => {
    socketRef.current.emit("joinRoom", roomId, (oldMessages) => {
      setMessages(oldMessages);
      setJoined(true);
    });
  };

  const leaveRoom = () => socketRef.current.emit("leaveRoom", roomId);

  useEffect(() => {
    console.log({ joined, roomId });
  }, [joined, roomId]);

  // return 

  return (
    <Layout>
      {joined && roomId ? (
        <>
        <MessageList messages={messages} room={roomId} onSendMessage={sendMessage} />
          {/* {" "}
          <h3>Messages</h3>
          <ul>
            {messages?.map((msg, i) => (
              <li key={i}>
                {msg.type}-{msg.message}
              </li>
            ))}
          </ul>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
          {!isHost && <button onClick={leaveRoom}>Leave room</button>} */}
        </>
      ) : (
        <></>
      )}

      {!joined && (
        <Form
          roomId={roomId}
          setRoomId={setRoomId}
          submitHandler={joinRoom}
          ownRoom={ownRoomId}
        />
      )}
    </Layout>
  );
}

// #333e50  hsl(217,22%,26%)rgb(51,62,80)

// #2f3a4a  hsl(216,22%,24%)rgb(47,58,74) depth

// #d94255  hsl(352,67%,55%)rgb(217,66,85) red

export default App;
