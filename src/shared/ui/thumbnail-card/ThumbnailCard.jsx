import ThumbnailItem from "./ThumbnailItem";

function ThumbnailCard({ images, selectVideo, setSelectVideo = false }) {
  return (
    <>
      <div className="grid h-fit w-full gap-4 rounded-md transition-all duration-300 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
        {images.map((image, index) => (
          <>
            <ThumbnailItem
              index={index}
              id={image.id}
              url={image.url}
              selectVideo={selectVideo}
              setSelectVideo={setSelectVideo}
            />
          </>
        ))}
      </div>
    </>
  );
}

export default ThumbnailCard;
