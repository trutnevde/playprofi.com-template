export function handleDeleteItem(setVideo, index) {
  setVideo((prevVideos) => prevVideos.filter((v) => v.id !== index));
}

export function handleHideChannel(setVideo, channelId) {
  setVideo((prevVideos) =>
    prevVideos.filter((video) => video.channel_id !== channelId),
  );
}
