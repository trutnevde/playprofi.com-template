import { FixedSizeGrid as Grid } from "react-window";
import VideoItem from "./VideoItem";
import { useWindowSize } from "@uidotdev/usehooks";

export default function VirtualizedVideoList({
  videos,
  layoutType,
  setSelectVideo,
  selectVideo,
  trends,
  button,
}) {
  const { width = 1200, height = 800 } = useWindowSize();

  const GAP = 16; // Tailwind gap-4
  const CARD_WIDTH = layoutType === "small" ? 290 : width - 100; // grid vs single column
  const CARD_HEIGHT = layoutType === "small" ? 360 : 500;

  const containerWidth = layoutType === "small" ? width * 0.72 : width - 100;
  const columnCount = layoutType === "small"
    ? Math.max(1, Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP)))
    : 1;
  const rowCount = Math.ceil(videos.length / columnCount);

  const processedVideos = videos.map((video, index) => ({
    ...video,
    index,
    layoutType,
    setSelectVideo,
    selectVideo,
    trends,
    button,
  }));

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= processedVideos.length) return null;
    const item = processedVideos[index];

    return (
      <div style={{ ...style, left: style.left + GAP, top: style.top + GAP }} className="p-1">
        <VideoItem {...item} />
      </div>
    );
  };

  return (
    <Grid
      columnCount={columnCount}
      rowCount={rowCount}
      columnWidth={CARD_WIDTH + GAP}
      rowHeight={CARD_HEIGHT + GAP}
      height={height - 250}
      width={containerWidth}
    >
      {Cell}
    </Grid>
  );
}