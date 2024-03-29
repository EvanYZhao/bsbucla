import { Button, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import socketIO from "socket.io-client"
import { UserAuth } from "../context/AuthContext";
import ChatMessage from "../components/Chat/ChatMessage"
import ChatUtility from "../components/Chat/ChatUtility"

const socketPath = 'https://bsbucla-chat.up.railway.app';

export default function SocketChatPage() {
  const { user } = UserAuth();
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  
  const lastMessageRef = useRef(null);
  
  const lastMessageVisible = ChatUtility.useIntersection(lastMessageRef, '0px');

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

  return(
    <div className="flex justify-center h-3/4">
      <div className="flex flex-col w-1/2">
        {/* Group ID Text Field */}
        <input type="text" 
            value={groupId} 
            onChange={(e) => setGroupId(e.target.value)}/>

        {/* Connect to Socket Button */}
        <Button
          onClick={() => {
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

        {/* Messages list */}
        <ul className="p-2 h-full overflow-y-scroll">
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
          <div ref={lastMessageRef}></div>
        </ul>

        {/* Send New Message Button */}
        <Button onClick={(e) => {
          if (socket && message !== '') {
            socket.emit('c_message', message);
            setMessage('');
          }
        }}>
          Send
        </Button>

        {/* New Message Text Field */}
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
