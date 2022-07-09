import styled from "styled-components";
import CopyIcon from "../icons/copyIcon.svg";
import NewTabIcon from "../icons/open.png";

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0.75em;
  border-radius: 2px;
  color: black;
  background-color: #e6f2ff;
  gap: 0.5em;
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

const ActionIcon = styled.img`
  cursor: pointer;
  width: 0.9em;
`;

const Message = ({ message, type }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    console.log(navigator)
  };
  return (
    <MessageBox>
      <MessageText>{message}</MessageText>
      <ActionIcons>
        <ActionIcon
          src={CopyIcon}
          alt="Copy message text"
          onClick={handleCopy}
        />
        {type === "link" ? (
          <ActionIcon
            src={NewTabIcon}
            alt="Open link in new tab"
            onClick={() => window.open(message, "_blank")}
          />
        ) : null}
      </ActionIcons>
    </MessageBox>
  );
};

export default Message;
