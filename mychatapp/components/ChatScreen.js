import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, IconButton } from "@material-ui/core";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import getRecipientEmail from "../Utils/getRecipientEmail";
import { useRef, useState } from "react";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import Menu from "./Menu";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const endOfMessagesRef = useRef(null);

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = () => {
    setOpen(() => !open);
  };

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const deleteHandler = (val) => {
    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .doc(val)
      .delete();
  };

  // const valId = messagesSnapshot?.docs?.map((message) => message.id);

  // const allDelete = () => {
  //   db.collection("chats")
  //     .doc(router.query.id)
  //     .collection("messages")
  //     .doc([valId])
  //     .delete();
  //   alert("message deleted");
  // };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <>
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getDate(),
            }}
            id={message.id}
            onClick={deleteHandler}
          />
        </>
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // Update last seen..
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
      id: Math.random().toString(),
    });
    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>
            {recipientEmail[0].toUpperCase()}
            {recipientEmail[1]}
          </Avatar>
        )}

        <HeaderInformation>
          <h3>
            {recipientEmail[0].toUpperCase()}
            {recipientEmail.substr(1, recipientEmail.indexOf("@") - 1)}
          </h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active..</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton title="Attach">
            <AttachFile />
          </IconButton>
          <IconButton title="Menu">
            <MoreVert onClick={toggleMenu} />
          </IconButton>
        </HeaderIcons>
        {open && (
          <Menu
            ele1="Contact info"
            ele2="Select messages"
            ele3="Mute notifications"
            ele4="Clear chats"
            ele5="Delete chat"
          />
        )}
      </Header>
      <MessageContainer>
        {/* show Messages */}
        {showMessages()}

        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <IconButton title="Speak Now">
          <Mic />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 80vh;
`;
