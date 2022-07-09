import { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
  display: grid;
  /* grid-template-rows: 40px auto; */
  grid-template-columns: 40% 60%;
  box-sizing: border-box;
  width: clamp(280px, 80vw, 900px);
  border: 1px solid white;
  margin: auto;
  height: 90vh;

  @media (max-width: 768px) {
    grid-template-rows: 25% auto;
    grid-template-columns: 100%;
  }
`;

const MessagesContainer = styled.div`
  box-sizing: border-box;
  /* width: clamp(280px, 75vw, 100%); */
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  /* max-height: 80%; */
  overflow-y: auto;
  color: #fff;
  /* margin: auto; */
  background-color: #2f3a4a;
  border-radius: 2px;
  padding: 1.2em;
  height: 100%;
`;

const MessageForm = styled.form`
  border: 1px solid white;
`;
const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  background-color: #2f3a4a;
  color: #d1dfec;
  height: 40px;
  border-radius: 2px;
  letter-spacing: 0.5em;
  font-size: 1em;
  padding: 0 0.5em;
  /* border: none; */
`;

const Clip = styled.div`
  height: 40px;
  border: 1px solid white;
  margin: auto;
  width: 50%;
  text-align: center;
  border-radius: 4px 4px 0 0;
`;

const MessageList = ({ messages = [], onSendMessage, room }) => {
  const [message, setMessage] = useState("");
  const handleSend = (e) => {
    e.preventDefault();
    onSendMessage(message)
    setMessage("");
  };
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
        <MessagesContainer>
          {messages.map((msg) => (
            <li>{msg.message}</li>
          ))}
        </MessagesContainer>
      </Container>
    </div>
  );
};

export default MessageList;
