import styled from "styled-components";

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0.75em;
  border-radius: 2px;
  color: black;
  background-color: #e6f2ff;
  gap: 0.5em;
  font-size: 16px;
`;
const MessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
  word-break: break-all;
`;

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

const ActionText = styled.p`
  cursor: pointer;
  margin: 0;
  padding: 0.3em;
  border-radius: 2px;
  background-color: #b3d9ff;
  font-size: 0.75em;
  &:hover {
    background-color: #99ccff;
  }
`;

const Message = ({ message, type }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };
  const openLink = () => {
    const url = new URL(message);
    window.open(url, "_blank");
  }
  return (
    <MessageBox>
      <MessageText>{message}</MessageText>
      <ActionIcons>
        <ActionText onClick={handleCopy}>Copy</ActionText>
        {type === "link" ? (
          <ActionText onClick={openLink}>
            Open link in new tab
          </ActionText>
        ) : null}
      </ActionIcons>
    </MessageBox>
  );
};

export default Message;
