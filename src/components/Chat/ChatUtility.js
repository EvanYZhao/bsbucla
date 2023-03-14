import { useEffect, useState } from "react";

/**
 * Determines whether a `React.MutableRefObject` is visible or not
 * @param {React.MutableRefObject<null>} element 
 * @param {string} rootMargin 
 * @returns 
 */
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

function messageDate (message) {
  return new Date(parseInt(message._id.substring(0,8), 16)*1000)
}

function sameId (message1, message2) {
  return message1.userId === message2.userId;
}

function sameMinute (message1, message2) {
  const minute = (message) => {
    return (message.date.getTime() / 60000) | 0
  }
  return minute(message1) === minute(message2);
}

function sameDay (message1, message2) {
  const day = (message) => {
    return message.date.toLocaleDateString();
  }
  return day(message1) === day(message2);
}

const ChatUtility = {
  useIntersection,
  messageDate,
  sameId,
  sameMinute,
  sameDay
}

export default ChatUtility;