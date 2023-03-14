import { useState, useEffect } from 'react';

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

export default function Message({messageObject, members, userId, fixAuthorCase = true}) {
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
          <div style={{backgroundColor: color}}className={'max-w-[75%] w-fit break-words p-3 rounded-3xl ' + messageSide}>
          {messageObject.message}
          </div>
          <div className={'py-1 ' + authorSide}>
          {!messageObject.hideTime && `${hours}:${minutes} ${timeSuffix}`}
          </div>

      </li>
      </>
  )
}