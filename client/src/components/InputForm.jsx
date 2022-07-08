import styled from "styled-components";
import Button from "./Button";

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

const Form = ({ roomId, setRoomId, submitHandler, ownRoom }) => {
  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    submitHandler();
  };
  return (
    <InputForm onSubmit={handleSubmit}>
      <p>{ownRoom}</p>
      <TextInput value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <Button label="Join" clickHandler={submitHandler} />
    </InputForm>
  );
};

export default Form;
