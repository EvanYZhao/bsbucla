import { useState, useEffect } from 'react';
import ChatMemberPopup from './ChatMemberPopup';

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

export default function ChatMessage({messageObject, members, userId, fixAuthorCase = true}) {
  const authorIsUser = messageObject.userId === userId;
  const [color, setColor] = useState(null);
  const [author, setAuthor] = useState(null);

  const [openMember, setOpenMember] = useState(false);

  useEffect(() => {
    if (!messageObject.hideAuthor) {
      setAuthor(authorIsUser ? 
          ''
          : 
          members.filter(mem => mem.firebaseId === messageObject.userId)[0]);
      ;
    }
  }, [messageObject, members]);

  useEffect(() => {
    // Make only first letter of each name capitalized
    if (author && fixAuthorCase && author?.name !== '')
      author.name = author?.name?.split(' ').map(name => name[0].toUpperCase() + name.substring(1).toLowerCase()).join(' ');
  })

  useEffect(() => {
      const colorName = COLORS[members.map(mem => mem.firebaseId).indexOf(userId)];
      setColor(authorIsUser ? '#d9f99d' : colorName);
  }, [members, userId])

  // Eggert time god
  const hours = messageObject.date.getHours() % 12 || 12;
  const minutes = messageObject.date.getMinutes().toString().padStart(2, '0');
  const timeSuffix = messageObject.date.getHours() < 12 ? 'AM' : 'PM';

  // Side depending on authorIsUser
  const authorSide = authorIsUser ? 'text-right ' : '';
  const messageSide = authorIsUser ? 'order-last ml-auto justify-end ' : 'order-first ';

  return (
      <li>
        { !messageObject.hideDay &&
        <div className='text-center'>
        {messageObject.date.toLocaleDateString('en-us', { weekday: 'long' })}, {messageObject.date.toLocaleDateString('en-us', { month: 'long' })} {messageObject.date.getDate()}
        {messageObject.date.getFullYear() !== (new Date()).getFullYear() && (', ' + messageObject.date.getFullYear())}
        </div>
        }
        <div className='p-1 w-full'>
          {/* Message author */}
          {/* <div className={'messageAuthor ' + authorSide}>
              <p>
              {author?.name}
              </p>
          </div> */}
          <div className={"flex flex-row space-x-4 " + messageSide}>
            <div className="w-10 h-10">
              <img 
                className="h-full rounded-full hover:brightness-90" 
                src={author?.picture} 
                referrerPolicy='no-referrer'
                onClick={() => {setOpenMember(true)}}
                />
            </div>
            <div style={{backgroundColor: color}} className={'max-w-[75%] w-fit break-words p-3 rounded-3xl '}>
            {messageObject.message}
            </div>
          </div>
          
          <div className={'py-1 ml-14 ' + authorSide}>
            {!messageObject.hideTime && `${hours}:${minutes} ${timeSuffix}`}
          </div>
        </div>
        <ChatMemberPopup member={author} open={openMember} onClose={() => setOpenMember(false)}/>
      </li>
  )
}