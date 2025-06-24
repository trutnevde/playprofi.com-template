import React, { useState } from "react";
import ReactPlayer from "react-player";

import {
  ArrowRight2,
  ArrowLeft2,
  Play,
  VolumeHigh,
  VolumeCross,
  ArrowRight,
  ArrowLeft,
  Setting2,
  Maximize2,
  Pause,
  LocationAdd,
  AddCircle,
} from "iconsax-react";
import Button from "../buttons/Button";

const CustomPlayer = ({
  videoSrc,
  timeCodes,
  setTimeCodes,
  updateAndSync,
  playerRef,
  progress,
  setProgress,
  isLoadingRegenerate,
}) => {
  const [playing, setPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShowSettings, setIsShowSettings] = useState(false);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(Number(newVolume));
  };

  const toggleMute = () => {
    setVolume((prevVolume) => (prevVolume === 0 ? 1 : 0)); // Переключаем между 0 и 100
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setProgress(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeek = (event) => {
    const seekTime =
      (event.nativeEvent.layerX / event.target.offsetParent.clientWidth) *
      duration;
    if (!isNaN(seekTime) && isFinite(seekTime)) {
      playerRef.current.seekTo(seekTime, "seconds");
      setProgress(seekTime);
    }
  };

  const handleSettings = () => {
    setIsShowSettings(!isShowSettings);
  };

  // const handleFullScreen = () => {
  //   if (playerRef.current) {
  //     if (document.fullscreenElement) {
  //       document.exitFullscreen();
  //     } else {
  //       playerRef.current.wrapper.requestFullscreen();
  //     }
  //   }
  // };

  const handleAddTimeCode = (e, index) => {
    e.stopPropagation();
    const newTime = {
      time:
        ((timeCodes[index]?.time || duration) +
          (timeCodes[index - 1]?.time || 0)) /
        2,
      title: "Новый таймкод",
      block: false,
    };

    const newTimeCodes = [...timeCodes];

    if (index < timeCodes.length) {
      newTimeCodes.splice(index, 0, newTime);
    } else {
      newTimeCodes.push(newTime);
    }

    updateAndSync(newTimeCodes);
    // setTimeCodes(newTimeCodes);
  };

  const handlePlusSecond = (e, index) => {
    e.stopPropagation();
    setTimeCodes((prevTimeCodes) => {
      const newTimeCodes = prevTimeCodes.map((tc, i) =>
        i === index ? { ...tc, time: Math.min(tc.time + 1, duration) } : tc,
      );
      playerRef.current.seekTo(newTimeCodes[index].time);
      updateAndSync(newTimeCodes);
      return newTimeCodes;
    });
  };

  const handleMinusSecond = (e, index) => {
    e.stopPropagation();
    setTimeCodes((prevTimeCodes) => {
      const newTimeCodes = prevTimeCodes.map((tc, i) =>
        i === index ? { ...tc, time: Math.max(tc.time - 1, 0) } : tc,
      );
      playerRef.current.seekTo(newTimeCodes[index].time);
      updateAndSync(newTimeCodes);
      return newTimeCodes;
    });
  };

  const handlePreviousTimeCode = () => {
    // Находим последний таймкод, который меньше текущего времени
    const currentIndex = timeCodes.findLastIndex(
      (timeCode) => timeCode.time+1 < progress
    );
    
    if (currentIndex !== -1) {
      const previousTimeCode = timeCodes[currentIndex];
      playerRef.current.seekTo(previousTimeCode.time+1);
      setProgress(previousTimeCode.time+1);
    }
  };

  const handleNextTimeCode = () => {
    // Находим первый таймкод, который больше текущего времени
    const currentIndex = timeCodes.findIndex(
      (timeCode) => timeCode.time > progress
    );
    
    if (currentIndex !== -1) {
      const nextTimeCode = timeCodes[currentIndex];
      playerRef.current.seekTo(nextTimeCode.time+1);
      setProgress(nextTimeCode.time+1);
    }
  };

  const handleAddTimeCodeAtProgress = (e) => {
    e.stopPropagation();
    const newTime = {
      time: progress,
      title: "Новый таймкод",
      block: false,
    };

    const newTimeCodes = [...timeCodes];
    newTimeCodes.push(newTime);
    newTimeCodes.sort((a, b) => a.time - b.time);

    updateAndSync(newTimeCodes);
  };

  const renderTimeCodes = (index, timeCode) => {
    const handleMouseDown = (e, index) => {
      e.stopPropagation();
      e.preventDefault();

      const mouseDownX = e.clientX;

      const initialTime = timeCodes[index].time;

      const playerRect = playerRef.current.wrapper.getBoundingClientRect();
      const initialMarkerX =
        playerRect.left + (initialTime / duration) * playerRect.width;

      const offset = mouseDownX - initialMarkerX;

      let latestTimeCodes = [...timeCodes];

      const handleMouseMove = (moveEvent) => {
        if (!playerRef.current) return;

        if (
          moveEvent.clientX < playerRect.left ||
          moveEvent.clientX > playerRect.right ||
          moveEvent.clientY < playerRect.top ||
          moveEvent.clientY > playerRect.bottom
        ) {
          return;
        }

        const actualX = moveEvent.clientX - offset;
        const seekTime =
          ((actualX - playerRect.left) / playerRect.width) * duration;

        const leftBound = timeCodes[index - 1]?.time ?? 0;
        const rightBound = timeCodes[index + 1]?.time ?? duration;

        if (seekTime < leftBound + 5 || seekTime > rightBound - 5) {
          return;
        }

        setTimeCodes((prev) => {
          const newTimeCodes = prev.map((tc, i) =>
            i === index
              ? { ...tc, time: Math.min(Math.max(seekTime, 0), duration) }
              : tc,
          );
          playerRef.current.seekTo(newTimeCodes[index].time);
          setProgress(newTimeCodes[index].time);
          latestTimeCodes = newTimeCodes;
          return newTimeCodes;
        });
      };

      const handleMouseUp = () => {
        updateAndSync(latestTimeCodes);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        key={index}
        className="h-6 cursor-pointer"
        onMouseDown={(e) => handleMouseDown(e, index)}
        onClick={() => playerRef.current.seekTo(timeCode.time)}
      >
        <div className="group relative h-full">
          <div className="absolute bottom-6 hidden -translate-x-1/2 rounded-md bg-gray/45 px-[6px] py-1 text-main-white group-hover:flex">
            <Button onClick={(e) => handleMinusSecond(e, index)}>
              <ArrowLeft2 size="15" variant="Bold" />
            </Button>
            <Button onClick={(e) => handlePlusSecond(e, index)}>
              <ArrowRight2 size="15" variant="Bold" />
            </Button>
          </div>
          <div className="absolute bottom-0 h-full w-1 -translate-x-1/2 rounded-xl bg-white" />
        </div>
      </div>
    );
  };

  const handleSectionClick = (event, index, startTime, endTime) => {
    event.stopPropagation();
    const sectionRect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - sectionRect.left;
    const ratio = clickX / sectionRect.width;
    const sectionDuration = endTime - startTime;
    const newProgress = startTime + ratio * sectionDuration;
    playerRef.current.seekTo(newProgress, "seconds");
    setProgress(newProgress);
  };

  /**
   * Рендер одной секции.
   * @param {number} widthPercent - на сколько % эта секция занимает прогресс-бара
   * @param {number} index        - индекс секции
   * @param {number} startTime    - начало секции (в секундах)
   * @param {number} endTime      - конец секции (в секундах)
   */
  const renderSection = (widthPercent, index, startTime, endTime) => {
    const sectionDuration = endTime - startTime;

    let bgColor;
    if (progress <= startTime) {
      // прогресс ещё не дошёл до начала секции
      bgColor = "rgb(135, 135, 135)";
    } else if (progress >= endTime) {
      // прогресс прошёл всю секцию
      bgColor = "rgb(41, 228, 222)";
    } else {
      // частично заполнена
      const playedInSection = progress - startTime;
      const fillPercentage = (playedInSection / sectionDuration) * 100;
      bgColor = `linear-gradient(to right,
        rgb(41, 228, 222) ${fillPercentage}%,
        rgb(135, 135, 135) ${fillPercentage}%)`;
    }

    return (
      <div
        key={`${startTime}-${endTime}`}
        className="group pt-14"
        style={{
          width: `calc(${widthPercent}%)`,
        }}
        onClick={(event) =>
          handleSectionClick(event, index, startTime, endTime)
        }
      >
        <div
          className="flex h-2 items-center justify-center rounded-xl"
          style={{ background: bgColor }}
        >
          {sectionDuration >= 5 && (
            <Button
              className="hidden -translate-y-full items-center justify-center group-hover:flex"
              onClick={(e) => handleAddTimeCode(e, index)}
            >
              <LocationAdd
                size="32"
                variant="Bold"
                className="z-10 text-gray"
              />
              <div className="absolute size-3 bg-white"></div>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const getPlayLine = () => {
    let lastTime = 0;

    return (
      <div
        className="relative flex w-full items-end gap-2"
        onClick={handleSeek}
      >
        {timeCodes.map((timeCode, index) => {
          const delta = timeCode.time - lastTime;
          lastTime = timeCode.time;

          return (
            <React.Fragment key={timeCode.time}>
              {renderSection(
                (delta / duration) * 100,
                index,
                index === 0 ? 0 : timeCodes[index - 1].time,
                timeCode.time,
              )}
              {renderTimeCodes(index, timeCode)}
              {index === timeCodes.length - 1 &&
                renderSection(
                  ((duration - timeCode.time) / duration) * 100,
                  index + 1,
                  timeCode.time,
                  duration,
                )}
              <div
                className="group absolute -top-10 flex h-20 -translate-x-1/2 flex-col gap-1 transition-all duration-300"
                style={{
                  left: `${Math.min(Math.max((progress / duration) * 100, 7), 95)}%`,
                }}
              >
                {!timeCodes.some((tc) => Math.abs(tc.time - progress) <= 5) && (
                  <div
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-main-accent/5 px-2 py-1 text-center text-[14px] text-black/20 transition-all duration-300 group-hover:bg-main-accent group-hover:text-black"
                    onClick={handleAddTimeCodeAtProgress}
                  >
                    Добавить таймкод{" "}
                    <AddCircle
                      size="16"
                      className="text-dark-graphite/20 transition-all duration-300 group-hover:text-dark-graphite"
                      variant="Bulk"
                    />
                  </div>
                )}
                <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center justify-center gap-5 text-[12px] text-white/5 group-hover:text-white">
                  <p className="tracking-widest">
                    {Math.floor(progress / 3600)}:
                    {("0" + Math.floor((progress % 3600) / 60)).slice(-2)}:
                    {("0" + Math.floor(progress % 60)).slice(-2)}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getCurrentTimeCodeTitle = () => {
    const current = timeCodes
      .slice()
      .reverse()
      .find((tc) => progress >= tc.time);
    return current?.title || "";
  };

  return (
    <div className="relative">
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        controls={false}
        playing={playing}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="100%"
        height="100%"
        volume={volume}
        style={{ borderRadius: "10px", overflow: "hidden", maxHeight: "620px" }}
      />
      <div className="absolute bottom-0 flex h-[225px] w-full flex-col bg-gradient-to-t from-main-dark to-transparent">
        <div className="absolute bottom-0 w-full">
          <div className="relative size-full rounded-full">
            {timeCodes.length ? (
              getPlayLine()
            ) : (
              <div
                className="flex size-full items-center rounded-full bg-gray"
                onClick={handleSeek}
              >
                <div
                  className="h-2 bg-main-accent"
                  style={{ width: `${(progress / duration) * 100}%` }}
                >
                  {!isLoadingRegenerate && (
                    <Button
                      className="absolute -translate-x-1/2 -translate-y-full"
                      style={{
                        left: `${(progress / duration) * 100}%`,
                      }}
                      onClick={(e) => handleAddTimeCode(e, 0)}
                    >
                      <LocationAdd
                        size="32"
                        variant="Bold"
                        className="z-10 text-gray"
                      />
                      <div className="absolute size-3 bg-white"></div>
                    </Button>
                  )}
                </div>
                {/* <Button
                  className="absolute -top-1 left-1/2 -translate-y-full"
                  onClick={(e) => handleAddTimeCodeCurrentProgress(e)}
                >
                  <LocationAdd
                    size="32"
                    variant="Bold"
                    className="z-10 text-gray"
                  />
                  <div className="absolute size-3 bg-white"></div>
                </Button> */}
              </div>
            )}
          </div>
          <div className="flex p-4 text-main-white">
            <div className="flex items-center justify-center">
              <Button
                varian="secondary"
                onClick={handlePlayPause}
                className="mr-[18px]"
              >
                {playing ? (
                  <Pause size="18" variant="Bold" />
                ) : (
                  <Play size="18" variant="Bold" />
                )}
              </Button>
              <div className="mr-4 flex items-center gap-2">
                <div>
                  {volume === 0 ? (
                    <VolumeCross
                      size="18"
                      variant="Bold"
                      onClick={toggleMute}
                    />
                  ) : (
                    <VolumeHigh size="18" variant="Bold" onClick={toggleMute} />
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray"
                  style={{
                    background: `linear-gradient(to right, #fff ${volume * 100}%, #C6C7C5 ${volume * 100}%)`,
                  }}
                />
              </div>
              <div className="mr-4 flex gap-1">
                <p>
                  {Math.floor(progress / 3600)}:
                  {("0" + Math.floor((progress % 3600) / 60)).slice(-2)}:
                  {("0" + Math.floor(progress % 60)).slice(-2)} /
                </p>
                <p>
                  {Math.floor(duration / 3600)}:
                  {("0" + Math.floor((duration % 3600) / 60)).slice(-2)}:
                  {("0" + Math.floor(duration % 60)).slice(-2)}
                </p>
              </div>
              <div className="mr-2 flex gap-2">
                <Button varian="secondary" onClick={handlePreviousTimeCode}>
                  <ArrowLeft size="18" />
                </Button>
                <Button varian="secondary" onClick={handleNextTimeCode}>
                  <ArrowRight size="18" />
                </Button>
              </div>
              {timeCodes.length > 0 && (
                <div className="z-10 rounded px-2 py-1 text-sm text-main-accent">
                  - {getCurrentTimeCodeTitle()}
                </div>
              )}
            </div>
            <div className="flex flex-1 items-center justify-end gap-5">
              <Button
                varian="secondary"
                onClick={handleSettings}
                className="mr-[18px]"
              >
                <Setting2 size="18" variant="Bold" />
              </Button>
              {isShowSettings && (
                <div className="absolute -top-20 right-24 flex h-24 w-64 flex-col rounded-3xl bg-dark-coal">
                  <div className="flex size-full items-center rounded-t-3xl px-4 hover:bg-main-accent/20 hover:text-main-accent">
                    Quality
                  </div>
                  <div className="flex size-full items-center rounded-b-3xl px-4 hover:bg-main-accent/20 hover:text-main-accent">
                    Speed
                  </div>
                </div>
              )}
              <Button
                varian="secondary"
                // onClick={handleFullScreen}
                className="mr-[18px] text-supporting"
              >
                <Maximize2 size="18" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
