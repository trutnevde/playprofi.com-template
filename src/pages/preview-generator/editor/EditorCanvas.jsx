import { FaWindowClose } from "react-icons/fa";

const EditorCanvas = ({ image, onClose }) => (
  <div className="relative">
    <button
      className="absolute left-0 -translate-y-[calc(100%+12px)] text-2xl"
      onClick={onClose}
    >
      <FaWindowClose />
    </button>
    <div className="overflow-hidden rounded-[20px]">
      <img
        src={image}
        alt="Редактируемое"
        className="h-auto w-full object-contain"
      />
    </div>
  </div>
);

export default EditorCanvas;
