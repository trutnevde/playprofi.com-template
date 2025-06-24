import BigVideoItem from "./BigVideoItem";
import SmallVideoItem from "./SmallVideoItem";

function VideoItem(props) {
  const {
    index,
    base_id = null,
    id,
    url,
    title,
    status,
    duration,
    characteristics,
    layoutType = "big",
    setSelectVideo,
    selectVideo,
    channel = null,
    channel_id = null,
    channel_id_base = null,
    channelThumbnail = null,
    channelUrl = null,
    channelSubs = null,
    trends,
    progress,
    button,
    loadingIndicator
  } = props;

  if (layoutType === "big") {
    return (
      <BigVideoItem
        index={index}
        base_id={base_id}
        id={id}
        url={url}
        title={title}
        status={status}
        characteristics={characteristics}
        setSelectVideo={setSelectVideo}
        selectVideo={selectVideo}
        channel={channel}
        channel_id={channel_id}
        channel_id_base={channel_id_base}
        channelUrl={channelUrl}
        channelSubs={channelSubs}
        channelThumbnail={channelThumbnail}
        trends={trends}
        progress={progress}
        button={button}
        loadingIndicator={loadingIndicator}
      />
    );
  }

  if (layoutType === "small") {
    return (
      <SmallVideoItem
        index={index}
        base_id={base_id}
        id={id}
        url={url}
        title={title}
        status={status}
        duration={duration}
        characteristics={characteristics}
        setSelectVideo={setSelectVideo}
        selectVideo={selectVideo}
        channel={channel}
        channel_id={channel_id}
        channel_id_base={channel_id_base}
        channelUrl={channelUrl}
        channelThumbnail={channelThumbnail}
        channelSubs={channelSubs}
        trends={trends}
        progress={progress}
        button={button}
        loadingIndicator={loadingIndicator}
      />
    );
  }

  return null;
}

export default VideoItem;
