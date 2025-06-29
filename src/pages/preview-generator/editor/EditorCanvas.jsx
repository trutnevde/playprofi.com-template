import { FaPlus } from "react-icons/fa";
import MaClose from "../../../shared/assets/icons/material-symbols-close.svg?react";
import IconPlus from "../../../shared/assets/icons/plus-light.svg?react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import useImage from "use-image";

const URLImage = ({ src, ...rest }) => {
  const [image] = useImage(src, "anonymous");
  return <Image image={image} {...rest} />;
};

const EditorCanvas = ({ onClose, ...img }) => {
  const [width, height] = img.aspect === "9:16" ? [360, 640] : [640, 360];

  return (
    <div className="relative pr-3">
      <button
        className="absolute left-0 z-30 -translate-y-[calc(100%+12px)] text-2xl"
        onClick={onClose}
      >
        <MaClose />
      </button>
      <div className="overflow-hidden rounded-[20px] bg-dark-supporting">
        <Stage width={width} height={height} className="w-full">
          <Layer>
            <URLImage
              src={img.src}
              x={0}
              // y={0}
              // width={width}
              // height={height}
              // draggable={false}
              // listening={false}
            />
          </Layer>
          <Layer>
            {/* остальные слои (тип, props, visible, lock тоже учитываем) */}
            {img.layers.map((layer) => {
              if (layer.id === "bg") return null; // пропускаем фоновый
              if (!layer.visible) return null;

              switch (layer.type) {
                case "rect":
                  return (
                    <Rect
                      key={layer.id}
                      {...layer.props}
                      draggable={!layer.lock}
                    />
                  );
                case "text":
                  return (
                    <Text
                      key={layer.id}
                      {...layer.props}
                      draggable={!layer.lock}
                    />
                  );
                // ... здесь можно добавить другие типы: image, sticker и т.д.
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
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
};

export default EditorCanvas;
