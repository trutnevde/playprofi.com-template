import { useState, useEffect } from "react";

const TypingText = ({ text = "", speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    setIsTyping(true);
    setDisplayedText("");
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();

    return () => {
      setIsTyping(false);
    };
  }, [text, speed]);

  return (
    <p className="text-supporting">
      {displayedText}
      {isTyping && <span className="cursor-blink">|</span>}
    </p>
  );
};

export default TypingText;
