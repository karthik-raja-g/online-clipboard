import { useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return;
    socketRef.current = io("http://localhost:3000", {
      auth: {
        sessionId: localStorage.getItem("sessionId")
      },
    });
    socketRef.current.on("old messages", (msgs) => {
      console.log('old messfaes', msgs)
      setMessages(msgs)
    });
    socketRef.current.on("register room", (id) => {
      console.log('register messaeg', id)
      localStorage.setItem("sessionId", id)
    }
    );
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
  }, [socketRef]);

  const sendMessage = (msg) => {
    socketRef.current.emit("chat message", message);
    setMessage("");
  };

  return (
    <main>
      <h3>Messages</h3>
      <ul>
        {messages?.map((msg) => (
          <li>{msg}</li>
        ))}
      </ul>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}

export default App;
