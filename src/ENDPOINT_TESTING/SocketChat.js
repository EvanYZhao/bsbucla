import { Button } from "@mui/material";
import { useState, useEffect, useId } from "react";
import socketIO from "socket.io-client"
import { UserAuth } from "../context/AuthContext";

const socketPath = 'https://bsbucla-chat.up.railway.app'

export default function SocketChatPage() {
  const { user } = UserAuth();
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);

  const IDgen = useId();

  // Receive chatroom log history on connection
  useEffect(() => {
    socket?.on('s_history', data => setMessages(data));
  }, [socket]);

  // Receive new message object from server
  useEffect(() => {
    socket?.on('s_message', data => {
      setMessages([...messages, data]);
    });
  }, [socket, messages]);

  // Reset socket if failed to join chatroom
  useEffect(() => {
    socket?.on('s_failed_connect', () => {
      setSocket(null);
    })
  });

  return(
    <div class="flex justify-center">
      <div class="flex flex-col w-1/3">
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
        <ul>
          {
            messages.map(m => <li id={IDgen}>{m.message}</li>)
          }
        </ul>
        
      </div>
    </div>
  )
}