import ChatUtility from "./ChatUtility";
import ChatMessage from "./ChatMessage";
import socketIO from "socket.io-client"
import { useState, useEffect, useRef } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Avatar, Divider, IconButton, TextField } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

const socketPath = "https://bsbucla-chat.up.railway.app";
export default function ChatBox({ groupId }) {
  const { user } = UserAuth();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket?.disconnect();
    }
    if (groupId !== "") {
      setSocket(
        socketIO(socketPath, {
          query: { token: user.accessToken, groupId },
          transports: ["websocket", "polling", "flashsocket"],
        })
      );
    }
  }, [groupId]);

  // Keep socket alive
  useEffect(() => {
    const interval = setInterval(() => {
      socket?.emit('keep_alive');
    }, 60000);
    return () => clearInterval(interval);
  })

  // Receive chatroom log history on connection
  useEffect(() => {
    socket?.on('s_history', messages => {

      // Iteratively check previous messages for
      // Same Author, Time, Day
      for (const [index, message] of messages.entries()) {
        message.date = ChatUtility.messageDate(message);
        message.hideAuthor = false;
        message.hideTime = false;
        message.hideDay = false;

        // Check previous message
        if (index > 0) {
          const prevMessage = messages[index-1];
          if (ChatUtility.sameId(message, prevMessage)) {
            message.hideAuthor = true;
            message.hideTime = ChatUtility.sameMinute(prevMessage, message)
          }
          message.hideDay = ChatUtility.sameDay(prevMessage, message); 
        }
      }

      // Scroll to bottom after receiving history
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView(true);
      }, 10);

      setMessages(messages);
    });
  }, [socket]);

  /*
  We want to scroll the new message into view
  if the user was already at the bottom.

  If the user isn't at the bottom, they're probably
  reading an old message and doesn't want to be
  auto-scrolled to the new message
  */
  useEffect(() => {
    if (lastMessageVisible) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
      }, 10);
    }
  }, [messages]);

  useEffect(() => {
      socket?.once('s_message', newMessage => {
        newMessage.date = ChatUtility.messageDate(newMessage);
        newMessage.hideAuthor = false;
        newMessage.hideDay = false;
        newMessage.hideTime = false;

        const lastMessage = messages.at(messages.length - 1);

        // Check previous message for:
        // Author, Time, Day
        if (messages.length > 0) {
          if (ChatUtility.sameId(lastMessage, newMessage)) {
            // Hide new message author if last message has same author
            newMessage.hideAuthor = true;

            // Hide last message time if new message is on same minute
            lastMessage.hideTime = (ChatUtility.sameMinute(lastMessage, newMessage));
          }
          
          // Hide new message day if last message has same day
          newMessage.hideDay = ChatUtility.sameDay(lastMessage, newMessage);
        }

        setMessages([...messages, newMessage]);
      });
  }, [messages]);

  // Reset socket if failed to join chatroom
  useEffect(() => {
    socket?.on("s_failed_connect", () => {
      setSocket(null);
    });
  }, [socket]);

  // Receive group member information
  useEffect(() => {
    socket?.on('s_group_members', data => {
      setMembers(data);
    });
  }, [socket]);
    
  const lastMessageVisible = ChatUtility.useIntersection(lastMessageRef, '0px');
  return (
    <div className="flex flex-col w-full h-full">
      {/* Messages list */}
      <ul className="px-5 grow overflow-hidden hover:overflow-y-scroll">
        {
          messages.map(messageObject => {
            return (
              <ChatMessage key={messageObject._id}
                messageObject={messageObject} 
                members={members} 
                userId={user.uid}
              />
            )
          })
        }
        <div ref={lastMessageRef} className="py-2"></div>
      </ul>

      {/* Line divider between messages and text input */}
      <Divider />

      {/* 
        Text Input

        Press ArrowForward button to send message
        or just press ENTER key
      */}
      <div className="flex p-5">
        <TextField 
          placeholder="Type something here..."
          id="outlined-basic" 
          variant="outlined" 
          sx={{ '& fieldset': {borderRadius: '25px'} }}
          className="grow"
          onChange={e => setMessage(e.target.value)}
          value={message}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' && socket && message !== '') {
              ev.preventDefault();
              socket.emit('c_message', message);
              setMessage('');
            }
          }}
        />

        {/* ArrowForward button to send message */}
        <IconButton 
          className="grow" 
          style={{ backgroundColor: 'transparent' }}
          onClick={(e) => {
            if (socket && message !== '') {
              socket.emit('c_message', message);
              setMessage('');
            }
          }}
          >
          <Avatar className="hover:bg-blue-400" sx={{ bgcolor: blue[300] }}>
            <ArrowForward fontSize="large"/>
          </Avatar>
        </IconButton>
      </div>
    </div>
  )
}