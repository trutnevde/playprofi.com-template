import VideoItem from "./VideoItem";
import { Add } from "iconsax-react";
// import VirtualizedVideoList from "./VirtualizedVideoList";

function VideoCard({
  videos,
  layoutType = "big",
  selectVideo,
  setSelectVideo = false,
  analysis = false,
  addVideos = false,
  analysisScript = false,
  trends = false,
  button = false,
}) {
  const containerClasses =
    layoutType === "small"
      ? "grid gap-4 transition-all duration-300 overflow-auto rounded-md w-full h-fit [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]"
      : "flex flex-col space-y-3 transition-all duration-300 overflow-auto rounded-md";

  console.log(videos);
  return (
    <>
      <div className={containerClasses}>
        {videos.map((video, index) => (
          <>

            <VideoItem
              index={index}
              base_id={video.base_id}
              id={video.id}
              key={video.id}
              url={video.url}
              title={video.title}
              duration={video.duration}
              status={video.status}
              channel={video.channel}
              channel_id={video.channel_id}
              channel_id_base={video.channel_id_base}
              channelUrl={video.channel_url}
              channelThumbnail={video.channel_thumbnail}
              channelSubs={video.channel_subs}
              characteristics={video.characteristics}
              layoutType={layoutType}
              selectVideo={selectVideo}
              setSelectVideo={setSelectVideo}
              trends={trends}
              progress={video.progress}
              button={button}
              loadingIndicator={video.thumbnail_generated}
            />
          </>
        ))}
      </div>
      {analysis && (
        <div>
          <hr className="my-2 w-full border-0 border-t-2 border-dashed border-main-accent" />
          {addVideos.length === 0 ? (
            <div
              className="w-full cursor-pointer space-y-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-dark-coal via-dark-coal to-dark-coal p-3 transition-all duration-300 hover:border-[rgba(39,223,217,0.05)] hover:from-dark-coal hover:via-dark-coal hover:to-[rgba(39,223,217,0.05)]"
              onClick={analysisScript}
            >
              <div className="flex justify-center gap-3">
                <Add className="text-main-accent" />
                <p className="text-[24px] font-normal text-main-accent">
                  Показать больше результатов
                </p>
              </div>
              <p className="text-center text-supporting">
                Система расширит ваш исходный запрос для поиска дополнительных
                результатов
              </p>
            </div>
          ) : (
            <div className={containerClasses}>
              {addVideos.map((video, index) => (
                <VideoItem
                  index={index}
                  id={video.id}
                  key={video.id}
                  url={video.url}
                  title={video.title}
                  duration={video.duration}
                  status={video.status}
                  channel={video.channel}
                  channel_id={video.channel_id}
                  channelUrl={video.channel_url}
                  channelThumbnail={video.channel_thumbnail}
                  characteristics={video.characteristics}
                  layoutType={layoutType}
                  selectVideo={selectVideo}
                  setSelectVideo={setSelectVideo}
                  trends={trends}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default VideoCard;
