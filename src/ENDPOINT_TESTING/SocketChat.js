import { Button, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import socketIO from "socket.io-client"
import { UserAuth } from "../context/AuthContext";
import Message from "../components/ChatMessage"

const socketPath = 'https://bsbucla-chat.up.railway.app';

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!
THIS WILL CAUSE A BUG LATER
IF MEMBER COUNT > 12
!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
const COLORS = [
  '#bae6fd',
  '#fed7aa',
  '#bfdbfe',
  '#c7d2fe',
  '#fecaca',
  '#ddd6fe',
  '#bbf7d0',
  '#f5d0fe',
  '#fef08a',
  '#fbcfe8',
  '#99f6e4',
  '#fecdd3'
]

function useIntersection(element, rootMargin)  {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    element.current && observer.observe(element.current);

    return () => observer.unobserve(element.current);
  }, []);

  return isVisible;
};

export default function SocketChatPage() {
  const { user } = UserAuth();
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  
  const lastMessageRef = useRef(null);
  
  const lastMessageVisible = useIntersection(lastMessageRef, '0px');

  const messageDate = (message) => {
    return new Date(parseInt(message._id.substring(0,8), 16)*1000)
  }

  const sameId = (message1, message2) => {
    return message1.userId === message2.userId;
  }

  const sameMinute = (message1, message2) => {
    const minute = (message) => {
      return (message.date.getTime() / 60000) | 0
    }
    return minute(message1) === minute(message2);
  }

  const sameDay = (message1, message2) => {
    const day = (message) => {
      return message.date.toLocaleDateString();
    }
    return day(message1) === day(message2);
  }

  // Receive chatroom log history on connection
  useEffect(() => {
    socket?.on('s_history', messages => {

      // Iteratively check previous messages for
      // Same Author, Time, Day
      for (const [index, message] of messages.entries()) {
        message.date = messageDate(message);
        message.hideAuthor = false;
        message.hideTime = false;
        message.hideDay = false;

        // Check previous message
        if (index > 0) {
          const prevMessage = messages[index-1];
          if (sameId(message, prevMessage)) {
            message.hideAuthor = true;
            message.hideTime = sameMinute(prevMessage, message)
          }
          message.hideDay = sameDay(prevMessage, message); 
        }
        else {
          
        }
      }
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
        newMessage.date = messageDate(newMessage);
        newMessage.hideAuthor = false;
        newMessage.hideDay = false;
        newMessage.hideTime = false;

        const lastMessage = messages.at(messages.length - 1);

        // Check previous message for:
        // Author, Time, Day
        if (messages.length > 0) {
          if (sameId(lastMessage, newMessage)) {
            // Hide new message author if last message has same author
            newMessage.hideAuthor = true;

            // Hide last message time if new message is on same minute
            lastMessage.hideTime = (sameMinute(lastMessage, newMessage));
          }
          
          // Hide new message day if last message has same day
          newMessage.hideDay = sameDay(lastMessage, newMessage);
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

  useEffect(() => {
    socket?.on('s_group_members', data => {
      setMembers(data);
    });
  }, [socket]);

  return(
    <div className="flex justify-center h-3/4">
      <div className="flex flex-col w-1/2">
        <input type="text" 
            value={groupId} 
            onChange={(e) => setGroupId(e.target.value)}/>

        <Button
          onClick={(e) => {
            if (!socket && groupId !== "") {
              setSocket(
                socketIO(socketPath, {
                  query: { token: user.accessToken, groupId },
                  transports: ["websocket", "polling", "flashsocket"],
                })
              );
            }
          }}
        >
          Connect to Socket
        </Button>

        <ul className="p-2 h-full overflow-y-scroll">
          {
            messages.map(messageObject => {
              return (
                <Message key={messageObject._id}
                  messageObject={messageObject} 
                  members={members} 
                  userId={user.uid}
                />
              )
            })
          }
          <div ref={lastMessageRef}></div>
        </ul>

        <Button onClick={(e) => {
          if (socket && message !== '') {
            socket.emit('c_message', message);
            setMessage('');
          }
        }}>
          Send
        </Button>
        <TextField
          id="filled-multiline-static"
          label="Message"
          multiline
          rows={4}
          variant="filled"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </div>
  );
}
