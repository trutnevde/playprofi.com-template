import { useState } from "react";
import { useInView } from "react-intersection-observer";
import CardButton from "./buttons/CardButton";
import CharacteristicsList from "./card-items/CharacteristicsItem";
import ProgressItem from "./card-items/ProgressItem";
import { useNavigate } from "react-router-dom";

function StatusBadge({ status, isSelected }) {
  if (!status || status === "error") return null;

  return (
    <span className="flex items-center rounded-lg bg-main-dark px-3 py-1 text-[14px] text-supporting">
      {(isSelected || status.icon) && (
        <span className="mr-2 size-2 rounded-full bg-main-accent" />
      )}
      {status.text}
    </span>
  );
}

function SmallVideoItem({
  index,
  base_id,
  id = "",
  duration,
  url,
  title,
  status,
  characteristics,
  setSelectVideo,
  selectVideo,
  channel,
  channel_id,
  channel_id_base,
  channelUrl,
  channelSubs,
  channelThumbnail,
  trends,
  progress,
  button,
  tags = null,
  loadingIndicator = false,
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "100px" });

  const isSelected = selectVideo?.includes(id);
  const isYouTube = id?.length === 11;

  const videoData = {
    base_id,
    id,
    index,
    url,
    title,
    channel,
    channel_id,
    channel_id_base,
    channel_thumbnail: channelThumbnail,
    characteristics: characteristics.map((char) => ({
      name: char.name,
      value: char.subtext,
      icon: char.icon,
    })),
  };

  const handleClick = () => {
    const isYouTubeId = /^[a-zA-Z0-9_-]{11}$/.test(id);
    if (!setSelectVideo) {
      if (trends) {
        navigate(
          `/app/analyzer?prompt=${encodeURIComponent(title)}&time_param=any&signal_id=${base_id}`,
        );
        return;
      }
      const videoUrl = isYouTubeId
        ? `https://www.youtube.com/watch?v=${id}`
        : progress == null
          ? `${id}`
          : progress == 100
            ? `${id}`
            : "#";

      navigate(videoUrl);
    } else {
      setSelectVideo((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    }
  };

  return (
    <div
      key={index}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative cursor-pointer rounded-2xl border ${
        isSelected ? "border-main-accent" : "border-transparent"
      } bg-dark-coal p-3 transition-all duration-300 hover:border-main-accent`}
    >
      <div className="relative">
        {hovered && button && (
          <div className="absolute right-2 top-2 z-10 flex gap-2">
            {button.map((item, idx) => (
              <CardButton
                key={idx}
                icon={item.icon}
                action={item.action}
                tooltipContent={item.tooltip}
                hoverColor={item.hoverColor}
                data={videoData}
              />
            ))}
          </div>
        )}
        <div
          ref={ref}
          className="aspect-h-9 aspect-w-16 grid w-full place-items-center overflow-hidden rounded-2xl bg-dark-graphite"
        >
          <picture className="col-span-full row-span-full size-full">
            <source type="image/webp" srcSet={`${url}`} />
            <img
              src={
                url
                  ? url
                  : "https://cdn.playprofi.com/image/f9dcd994-341f-4aa7-8930-49fd587e397e.webp"
              }
              alt="Video Thumbnail"
              loading="eager"
              className="size-full rounded-2xl object-cover"
            />
          </picture>

          {progress !== null && (
            <ProgressItem progress={progress} status={status} />
          )}
          {loadingIndicator && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 rounded-lg bg-dark-overlay px-2 py-1 text-[14px] text-main-accent backdrop-blur-md">
            {duration}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-base font-normal text-white">
        <p
          title={title}
          className="line-clamp max-w-[70%] overflow-hidden text-ellipsis break-words"
        >
          {isYouTube ? (
            <a
              href={`https://www.youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-main-accent"
              onClick={(e) => e.stopPropagation()}
            >
              {title}
            </a>
          ) : (
            title || "Название"
          )}
        </p>

        {tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="h-[24px] truncate rounded-lg px-1 text-sm text-main-accent"
            >
              | {tag}
            </span>
          ))}

        {!channel && <StatusBadge status={status} isSelected={isSelected} />}
      </div>

      {channel && (
        <div className="my-2 flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-2">
            <img
              src={channelThumbnail}
              alt="Channel Thumbnail"
              decoding="async"
              width={40}
              height={40}
              className="size-[40px] rounded-md object-contain"
            />
            <p className="truncate">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-main-accent"
                onClick={(e) => e.stopPropagation()}
              >
                {channel}
              </a>
              <br />
              <span className="text-supporting">{channelSubs} subscribers</span>
            </p>
          </div>
          <StatusBadge status={status} isSelected={isSelected} />
        </div>
      )}

      {characteristics.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-supporting">
          <CharacteristicsList
            characteristics={characteristics}
            variant="small"
          />
        </div>
      )}
    </div>
  );
}

export default SmallVideoItem;
