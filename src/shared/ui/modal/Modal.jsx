import { useEffect, useRef } from "react";
// import { CloseSquare } from "iconsax-react";

export default function Modal({ isPopupOpen, closePopup, title, children }) {
  const popupRef = useRef(null);

  // Блокировка скролла + закрытие кликом вне модалки
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        closePopup();
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        closePopup();
      }
    }

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isPopupOpen, closePopup]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-in-out ${isPopupOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        ref={popupRef}
        className={`relative w-auto rounded-lg p-6 text-white transition-all duration-300 ease-in-out${isPopupOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Заголовок */}
        <p className="absolute -top-20 left-1/2 w-fit -translate-x-1/2 whitespace-nowrap text-5xl font-semibold">
          {title}
        </p>

        <div className="relative size-full rounded-xl bg-dark-coal p-10">
          {/* Кнопка закрытия */}
          {/* <CloseSquare
            variant="Bulk"
            size={30}
            className="absolute right-5 top-5 cursor-pointer text-supporting transition-colors duration-300 hover:text-red-500"
            onClick={closePopup}
          /> */}

          {/* Динамический контент */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
