import styled from "styled-components";
import Button from "./Button";
import Loader from "./Loader";
import copyIcon from "../icons/copyIcon.svg";

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: clamp(280px, 75vw, 350px);
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

const Text = styled.p`
  margin: 0;
  font-size: 1em;
  color: #d1dfec;
`;

const RoomText = styled(Text)`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const CopyImg = styled.img`
  width: 1em;
  height: 1em;
  cursor: pointer;

  &:active {
    transform: scale(1.2);
  }
`;
const Form = ({ roomId, setRoomId, submitHandler, ownRoom }) => {
  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    submitHandler();
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(ownRoom);
  };
  return (
    <InputForm onSubmit={handleSubmit}>
      {!ownRoom ? (
        <Text>
          Getting room name... <Loader />
        </Text>
      ) : (
        <RoomText>
          {ownRoom}{" "}
          <CopyImg src={copyIcon} alt="Copy room name" onClick={handleCopy} />
        </RoomText>
      )}
      <TextInput value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <Button label="Join" clickHandler={submitHandler} />
    </InputForm>
  );
};

export default Form;
