import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function CustomTooltip({ children, tooltipContent }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({
        top: event.clientY + -30,
        left: event.clientX + 10,
      });
    };

    if (showTooltip) {
      setTimeout(() => setIsVisible(true), 50); // Небольшая задержка перед показом
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      setIsVisible(false);
      document.removeEventListener("mousemove", handleMouseMove);
    }

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}

      {showTooltip &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(20, 20, 20, 0.9)", // Полупрозрачный фон
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              zIndex: 1000,
              whiteSpace: "nowrap",
              transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              opacity: isVisible ? 1 : 0,
              scale: isVisible ? 1 : 0.99,
              pointerEvents: "none", // Чтобы подсказка не мешала взаимодействию с элементами
            }}
          >
            {tooltipContent}
          </div>,
          document.body
        )}
    </div>
  );
}

export default CustomTooltip;
