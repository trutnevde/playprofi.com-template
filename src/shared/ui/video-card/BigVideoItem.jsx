import CardButton from "./buttons/CardButton";
import CharacteristicsList from "./card-items/CharacteristicsItem";
import ProgressItem from "./card-items/ProgressItem";
import { useNavigate } from "react-router-dom";
import defImage from "../../assets/image/logo-pp.png";

function BigVideoItem({
  index,
  base_id,
  id,
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
  channelThumbnail,
  trends,
  progress,
  button,
  channelSubs,
}) {
  const navigate = useNavigate();
  const videoData = {
    base_id,
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

  const handleCardClick = () => {
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
      className={`group relative flex cursor-pointer justify-between rounded-2xl border ${selectVideo?.includes(id) ? "border-main-accent" : "border-transparent"} bg-gradient-to-r from-dark-coal via-dark-coal to-dark-coal px-3 py-4 transition-all duration-300 ease-in-out ${selectVideo?.includes(id) ? "hover:border-main-accent" : "hover:border-transparent"} hover:from-dark-coal hover:via-dark-coal hover:to-[rgba(39,223,217,0.05)]`}
      key={index}
      onClick={handleCardClick}
    >
      {/* Изображение видео */}
      <div className="relative w-4/12">
        <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-2xl">
          {/* Кнопки по центру */}
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex gap-2">
              {button &&
                button.map((item, index) => (
                  <CardButton
                    key={index}
                    icon={item.icon}
                    action={item.action}
                    tooltipContent={item.tooltip}
                    hoverColor={item.hoverColor}
                    data={videoData}
                  />
                ))}
            </div>
          </div>
          {url ? (
            <div className="flex size-full items-center justify-center rounded-2xl bg-dark-graphite">
              <img
                src={url}
                alt="Video Thumbnail"
                className={`size-full rounded-2xl object-cover transition-all duration-300 ${
                  progress < 100
                    ? "blur-sm brightness-20"
                    : button && "group-hover:blur-sm group-hover:brightness-20"
                }`}
              />

              <ProgressItem progress={progress} status={status} />
            </div>
          ) : (
            <div className="flex size-full items-center justify-center rounded-2xl bg-dark-graphite p-10">
              <img
                src={defImage}
                alt="Video Thumbnail"
                className={`size-full rounded-2xl object-contain ${button && "group-hover:blur-sm group-hover:brightness-20"}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Контент карточки */}
      <div className="flex w-9/12 flex-col justify-between pl-8 text-white">
        {/* Заголовок и статус */}
        <div className="flex items-center justify-between truncate">
          <p
            className="w-10/12 truncate text-xl font-normal leading-normal"
            title={title}
          >
            {/^[a-zA-Z0-9_-]{11}$/.test(id) ? (
              <a
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-0 transition-all duration-300 hover:text-main-accent"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {title}
              </a>
            ) : (
              title
            )}
          </p>

          {status && status != "error" && (
            <span className="flex h-fit items-center rounded-lg bg-main-dark px-3 py-1 text-supporting">
              {(selectVideo?.includes(id) || status.icon) && (
                <div className="mr-2 size-2 rounded-full bg-main-accent"></div>
              )}
              {status.text}
            </span>
          )}
        </div>
        <hr className="m-1 text-dark-supporting" />
        {channelThumbnail && (
          <div className="mb-2 flex items-center justify-between text-white">
            <div className="flex gap-2">
              <img
                src={channelThumbnail}
                alt="Video Thumbnail"
                className="size-[40px] rounded-md object-contain"
              />
              <div className="flex flex-col">
                <a
                  href={channelUrl}
                  className="transition-all duration-300 hover:text-main-accent"
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {channel}
                </a>
                <span className="text-supporting">
                  {channelSubs} subscribers
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Информация о видео */}
        <div className="mb-5 grid w-2/3 grid-cols-3 gap-3 text-[16px] text-supporting">
          <CharacteristicsList
            characteristics={characteristics}
            variant="big"
          />
        </div>
      </div>
    </div>
  );
}

export default BigVideoItem;
