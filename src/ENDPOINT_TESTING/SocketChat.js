import { Button } from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import socketIO from "socket.io-client"
import { UserAuth } from "../context/AuthContext";

const socketPath = 'https://bsbucla-chat.up.railway.app';

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!
THIS WILL CAUSE A BUG LATER
IF MEMBER COUNT > 12
!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
const COLORS = [
  'sky',
  'orange',
  'blue',
  'indigo',
  'red',
  'violet',
  'green',
  'fuchsia',
  'yellow',
  'pink',
  'teal',
  'rose'
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

function Message({messageObject, members, userId, fixAuthorCase = true}) {
  const authorIsUser = messageObject.userId === userId;
  const [color, setColor] = useState(null);
  let author = '';

  if (!messageObject.hideAuthor) {
    author = authorIsUser ? 
    ''
    : 
    members.filter(mem => mem.firebaseId === messageObject.userId)[0]?.name
  ;

  // Make only first letter of each name capitalized
  if (fixAuthorCase && author !== '')
    author = author?.split(' ').map(name => name[0].toUpperCase() + name.substring(1).toLowerCase()).join(' ');
  }

  /*
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  COLOR BUG
  Sometimes the color isn't rendered
  May be due to a caching issue with
  Tailwind CSS processing?
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      const col = COLORS[members.map(mem => mem.firebaseId).indexOf(userId)]
      setColor(authorIsUser ? 'bg-lime-200 ' : `bg-${col}-200 `);
    }, 10);

    return () => clearTimeout(timer);
    
  }, [userId])

  // Eggert time god
  const hours = messageObject.date.getHours() % 12 || 12;
  const minutes = messageObject.date.getMinutes().toString().padStart(2, '0');
  const timeSuffix = messageObject.date.getHours() < 12 ? 'AM' : 'PM';

  // Side depending on authorIsUser
  const authorSide = authorIsUser ? 'text-right ' : ' ';
  const messageSide = authorIsUser ? 'order-last ml-auto ' : 'order-first ';

  return (
    <>
    { !messageObject.hideDay &&
    <li className='text-center'>
      {messageObject.date.toLocaleDateString('en-us', { weekday: 'long' })}, {messageObject.date.toLocaleDateString('en-us', { month: 'long' })} {messageObject.date.getDay()}
      {messageObject.date.getFullYear() !== (new Date()).getFullYear() && (', ' + messageObject.date.getFullYear())}
    </li>
    }
    <li className='p-1 w-full'>
      {/* Message author */}
      <div className={'messageAuthor ' + authorSide}>
        <p>
        {author}
        </p>
      </div>
        <div className={'max-w-[75%] w-fit break-words p-3 rounded-3xl ' + color + messageSide}>
          {messageObject.message}
        </div>
        <div className={'py-1 ' + authorSide}>
        {!messageObject.hideTime && `${hours}:${minutes} ${timeSuffix}`}
        </div>

    </li>
    </>
  )
}

export default function SocketChatPage() {
  const { user } = UserAuth();
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  
  const lastMessageRef = useRef(null);
  
  const lastMessageVisible = useIntersection(lastMessageRef, '0px');

  // Receive chatroom log history on connection
  useEffect(() => {
    socket?.on('s_history', messages => {
      for (const [index, message] of messages.entries()) {
        message.date = new Date(parseInt(message._id.substring(0,8), 16)*1000);
        if (index > 0) {
          if (messages[index-1].userId === message.userId) {
            message.hideAuthor = true;
            if (((messages[index-1].date.getTime() / 60000) | 0) === ((message.date.getTime() / 60000) | 0)) {
              message.hideTime = true;
            }
            else {
              message.hideTime = false;
            }
          }
          else {
            message.hideAuthor = false;
            message.hideTime = false;
          }
          if (messages[index-1].date.toLocaleDateString() === message.date.toLocaleDateString()) {
            message.hideDay = true; 
          }
          else {
            message.hideDay = false;
          }
        }
        else {
          message.hideAuthor = false;
          message.hideTime = false;
          message.hideDay = false;
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
        console.log('yes');
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
      }, 10);
    }
  }, [messages])

  // Receive new message object from server
  useEffect(() => {
    socket?.on('s_message', newMessage => {
      newMessage.date = new Date(parseInt(newMessage._id.substring(0,8), 16)*1000);
      if (messages.length > 0) {
        if (messages.at(-1).userId === newMessage.userId) {
          newMessage.hideAuthor = true;
        }
        else {
          newMessage.hideAuthor = false;
        }
        if (messages.at(-1).date.toLocaleDateString() === newMessage.date.toLocaleDateString()) {
          newMessage.hideDay = true;
        }
        else {
          newMessage.hideDay = false;
        }
      }
      setMessages([...messages, newMessage]);
    });
  }, [socket, messages]);

  // Reset socket if failed to join chatroom
  useEffect(() => {
    socket?.on('s_failed_connect', () => {
      setSocket(null);
    })
  }, [socket]);

  useEffect(() => {
    socket?.on('s_group_members', data => {
      setMembers(data);
    });
  }, [socket])

  return(
    <div className="flex justify-center h-3/4">
      <div className="flex flex-col w-1/2">
        <input type="text" 
            value={groupId} 
            onChange={(e) => setGroupId(e.target.value)}/>

        <Button onClick={(e) => {
          if (!socket && groupId !== '') {
            setSocket(socketIO(socketPath, { query: { token: user.accessToken, groupId }, transports: ['websocket', 'polling', 'flashsocket']}));
          }
        }}>
          Connect to Socket
        </Button>

        <input type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}/>

        <Button onClick={(e) => {
          if (socket) {
            socket.emit('c_message', message);
          }
        }}>
          Send
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
        
      </div>
    </div>
  )
}