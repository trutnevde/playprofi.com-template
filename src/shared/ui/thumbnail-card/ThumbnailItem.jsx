import { useState } from "react";
import { useInView } from "react-intersection-observer";
import defImage from "../../assets/image/logo-pp.png?inline";

function SmallVideoItem({ index, id = "", url, setSelectVideo, selectVideo }) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "100px" });
  const isSelected = selectVideo?.includes(id);

  const handleClick = () => {
    setSelectVideo((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div
      key={index}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative cursor-pointer rounded-2xl border ${
        isSelected ? "border-main-accent" : "border-transparent"
      } bg-dark-coal p-2 transition-all duration-300 hover:border-main-accent`}
    >
      <div className="relative">
        <div
          ref={ref}
          className="aspect-h-9 aspect-w-16 w-full overflow-hidden rounded-2xl bg-dark-graphite"
        >
          <img
            src={url || defImage}
            alt="Video Thumbnail"
            width={320}
            height={180}
            loading={inView ? "eager" : "lazy"}
            className={`rounded-xl object-cover ${
              hovered ? "blur-sm brightness-20 transition-all duration-300" : ""
            }`}
          />
        </div>
        {isSelected && (
          <span className="absolute right-2 top-2 flex size-fit items-center rounded-lg bg-main-dark p-1 text-[14px] text-supporting">
            <span className="size-2 rounded-full bg-main-accent" />
          </span>
        )}
      </div>
    </div>
  );
}

export default SmallVideoItem;
