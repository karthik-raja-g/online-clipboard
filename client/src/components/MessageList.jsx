import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import Message from "./Message";

const Container = styled.div`
  display: grid;
  /* grid-template-rows: 40px auto; */
  grid-template-columns: 40% 60%;
  box-sizing: border-box;
  width: clamp(280px, 85vw, 900px);
  border: 1px solid white;
  margin: auto;
  height: 90vh;

  @media (max-width: 768px) {
    grid-template-rows: 25% auto;
    grid-template-columns: 100%;
  }
  /* @media (max-width: 425px) {
    grid-template-rows: 15% auto;
  } */
`;

const MessagesContainer = styled.div`
  box-sizing: border-box;
  /* width: clamp(280px, 75vw, 100%); */
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  gap: 1em;
  /* max-height: 80%; */
  overflow-y: auto;
  color: #fff;
  /* margin: auto; */
  background-color: #2f3a4a;
  border-radius: 2px;
  padding: 1em;
  height: 100%;
  font-size: clamp(14px, 4vw, 1em);
`;

const MessageForm = styled.form`
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  padding: 1em;

  @media (max-width: 425px) {
    justify-content: center;
  }
`;
const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  background-color: #2f3a4a;
  color: #d1dfec;
  height: 40px;
  border-radius: 2px;
  /* letter-spacing: 0.5em; */
  font-size: 1em;
  padding: 0 0.5em;
  /* border: none; */
`;

const Clip = styled.div`
  height: 2em;
  line-height: 2em;
  border: 1px solid white;
  margin: auto;
  width: 50%;
  text-align: center;
  border-radius: 4px 4px 0 0;
`;

const MessageList = ({ messages = [], onSendMessage, room }) => {
  const [message, setMessage] = useState("");
  const messagesRef = useRef(null);
  const handleSend = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };
  useEffect(() => {
    // console.log(messagesRef.current.scrollTo)
    messagesRef.current.scrollTo({
      behavior: 'smooth',
      // top: messagesRef.current.offsetTop
      bottom: 0
    })
  },[messages])
  return (
    <div>
      <Clip>Room - {room}</Clip>
      <Container>
        <MessageForm onSubmit={handleSend}>
          <TextInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button label="Send" clickHandler={handleSend} />
        </MessageForm>
        <MessagesContainer ref={messagesRef}>
          {messages.map((msg) => (
            <Message {...msg} />
          ))}
        </MessagesContainer>
      </Container>
    </div>
  );
};

export default MessageList;
