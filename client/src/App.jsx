import { useState, useRef } from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Form from "./components/InputForm";
import MessageList from "./components/MessageList";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [ownRoomId, setOwnRoomId] = useState("");
  const [members,setMembers] = useState(0);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return;
    socketRef.current = io(import.meta.env.VITE_APP_SERVER_URL, {
      auth: {
        sessionId: localStorage.getItem("sessionId"),
      },
    });
    socketRef.current.on("connect", (sk) => {
    });
    socketRef.current.on("socketDisconnected", (sk) => {
      setRoomId("");
      setMessage("");
      setMessages([]);
      setJoined(false);
      console.log("socket left");
    });
    // socketRef.current.on('socketDisconnected', () => console.log('socket left'))
    socketRef.current.on("sessionId", (id) => {
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
      setMessages((prev) => [...prev, message]);
    });
    socketRef.current.on("new connection", (data) => {
      setJoined(true);
      setRoomId(data.roomId);
      setIsHost(true);
      setMembers((prev) => prev + 1);
    });
    socketRef.current.on("old messages", ({ messages }) => {
      setMessages(messages);
    });
    socketRef.current.on("joinError", message => setError(message))
  }, [socketRef]);

  const sendMessage = (msg) => {
    socketRef.current.emit("chat message", { msg, roomId });
  };

  const joinRoom = () => {
    setError("");
    socketRef.current.emit("joinRoom", roomId, (oldMessages) => {
      setMessages(oldMessages);
      setJoined(true);
    });
  };

  const leaveRoom = () => socketRef.current.emit("leaveRoom", roomId);

  return (
    <Layout>
      {joined && roomId ? (
        <MessageList
          messages={messages}
          room={roomId}
          onSendMessage={sendMessage}
        />
      ) : null}
      {!joined && (
        <Form
          roomId={roomId}
          setRoomId={setRoomId}
          submitHandler={joinRoom}
          ownRoom={ownRoomId}
          error={error}
        />
      )}
    </Layout>
  );
}

// #333e50  hsl(217,22%,26%)rgb(51,62,80)

// #2f3a4a  hsl(216,22%,24%)rgb(47,58,74) depth

// #d94255  hsl(352,67%,55%)rgb(217,66,85) red

export default App;
