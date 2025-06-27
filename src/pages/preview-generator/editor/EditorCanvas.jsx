import { FaPlus } from "react-icons/fa";
import MaClose from "../../../shared/assets/icons/material-symbols-close.svg?react";
import IconPlus from "../../../shared/assets/icons/plus-light.svg?react";

const EditorCanvas = ({ image, onClose }) => (
  <div className="relative pr-3">
    <button
      className="absolute left-0 z-30 -translate-y-[calc(100%+12px)] text-2xl"
      onClick={onClose}
    >
      <MaClose />
    </button>
    <div className="overflow-hidden rounded-[20px]">
      <img
        src={image}
        alt="Редактируемое"
        className="h-auto w-full object-contain"
      />
    </div>
    <div className="mt-5 flex h-full items-start justify-center gap-5">
      <div className="flex aspect-[16/9] w-full max-w-[320px] items-center justify-center gap-2 rounded-[20px] bg-dark-supporting text-center">
        <div className="flex flex-col items-center space-y-[18px]">
          <IconPlus />
          <span>Добавить вариант обложки</span>
        </div>
      </div>
      <div className="flex aspect-[16/9] w-full max-w-[320px] items-center justify-center gap-2 rounded-[20px] bg-dark-supporting text-center">
        <div className="flex flex-col items-center space-y-[18px]">
          <IconPlus />
          <span>Добавить вариант обложки</span>
        </div>
      </div>
      <div className="flex aspect-[16/9] w-full max-w-[320px] items-center justify-center gap-2 rounded-[20px] bg-dark-supporting text-center">
        <div className="flex flex-col items-center space-y-[18px]">
          <IconPlus />
          <span>Добавить вариант обложки</span>
        </div>
      </div>
    </div>
  </div>
);

export default EditorCanvas;
