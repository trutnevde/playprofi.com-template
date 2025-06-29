import { FaPlus } from "react-icons/fa";
import MaClose from "../../../shared/assets/icons/material-symbols-close.svg?react";
import IconPlus from "../../../shared/assets/icons/plus-light.svg?react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import useImage from "use-image";
import { useRef, useState, useLayoutEffect } from "react";

const URLImage = ({ src, ...rest }) => {
  const [image] = useImage(src, "anonymous");
  return <Image image={image} {...rest} />;
};

function useContainerWidth(ref) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);

  return width;
}

const EditorCanvas = ({ onClose, ...img }) => {
  const [baseW, baseH] = img.aspect === "9:16" ? [720, 1280] : [1280, 720];
  const containerRef = useRef(<HTMLDivElement />);
  const containerWidth = useContainerWidth(containerRef);
  const scale = containerWidth > 0 ? containerWidth / baseW : 1;
  const displayW = baseW * scale;
  const displayH = baseH * scale;

  return (
    <div className="relative h-full max-w-full overflow-y-auto pr-3">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-[20px] bg-dark-supporting"
      >
        <Stage
          width={baseW}
          height={baseH}
          scaleX={scale}
          scaleY={scale}
          style={{
            width: `${displayW}px`,
            height: `${displayH}px`,
          }}
        >
          <Layer>
            <URLImage src={img.src} x={0} y={0} width={baseW} height={baseH} />
          </Layer>
          <Layer>
            {/* остальные слои */}
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

                case "image":
                  return (
                    <URLImage
                      key={id}
                      src={props.image}
                      x={props.x}
                      y={props.y}
                      width={props.width}
                      height={props.height}
                      draggable={!lock}
                    />
                  );

                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
      </div>

      <div className="mt-5 flex items-start justify-center gap-5">
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
