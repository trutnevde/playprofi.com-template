import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";

import scenario from "/src/shared/assets/icons/scenario.svg";
import trends from "/src/shared/assets/icons/trends.svg";
import time from "/src/shared/assets/icons/time.svg";
import analyzer from "/src/shared/assets/icons/analyzer.svg";
// import createWidget from "../../shared/assets/video/home-preview-generate.mp4";
import TypingText from "./TypingText";
import { ArrowRight2 } from "iconsax-react";
import SmallVideoItem from "../../shared/ui/video-card/SmallVideoItem";
import AppButton from "../../shared/ui/buttons/AppButton";
import StyledSelect from "../../shared/ui/select/SelectCustom";
import { useNavigate } from "react-router-dom";
import useTokens from "../../shared/context/useTokens";
import { useNotification } from "../../shared/context/NotificationContext";
import CustomSlider from "./home-items/SliderItem";

import homeVideo from "/src/shared/assets/video/promo.mp4";
// import homeThumbnail from "/src/shared/assets/image/home-thumbnail.png";
import bg_card_2 from "/src/shared/assets/image/bg-card-2.png";
import timeAnimation from "/src/shared/assets/animations/timestamp.json";

function HomePage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.home",
  });

  const navigate = useNavigate();
  const { tokens } = useTokens();
  const { showNotification } = useNotification();
  const [requestInput, setRequestInput] = useState("");
  const [videos, setVideos] = useState([]);

  const handleStartGenerate = () => {
    console.log(1);
  };

  const scenarioText = {
    title: t("scenario.data.title"),
    subtitle: t("scenario.data.subtitle"),
    text: t("scenario.data.text"),
  };

  const slides = [
    {
      id: 1,
      url: bg_card_2,
      title: t("slider.slide1.title"),
      category: t("slider.slide1.category"),
    },
    {
      id: 3,
      url: bg_card_2,
      title: t("slider.slide2.title"),
      category: t("slider.slide2.category"),
    },
    {
      id: 4,
      url: bg_card_2,
      title: t("slider.slide3.title"),
      category: t("slider.slide3.category"),
    },
  ];

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!videos.length) return; // ⛔ если ещё нет видео — не скроллим

    const container = scrollContainerRef.current;
    if (!container) return;

    // ⏳ Ждём рендер карточек в DOM
    const timeout = setTimeout(() => {
      const firstCard = container.querySelector(".card-class");
      if (!firstCard) return;

      // Получаем точные размеры карточки через getBoundingClientRect
      const cardRect = firstCard.getBoundingClientRect();
      const height = cardRect.height + 15;

      const interval = setInterval(() => {
        container.scrollBy({
          top: height,
          left: 0,
          behavior: "smooth",
        });
      }, 2000);

      // Очистка
      return () => clearInterval(interval);
    }, 500); // подождём полсекунды на отрисовку

    return () => clearTimeout(timeout);
  }, [videos]);

  return (
    <div className="flex h-full flex-col space-y-6 py-10 text-main-white">
      <div className="flex h-2/5 gap-5">
        <div className="relative w-1/2 overflow-hidden rounded-xl">
          <video
            src={homeVideo}
            autoPlay
            muted
            playsInline
            loop
            className="absolute left-0 top-0 size-full object-cover"
          />
          {/* <img
            src={homeThumbnail}
            className="absolute left-0 top-0 size-full object-cover"
          /> */}
        </div>
        <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
          <CustomSlider slides={slides} />
        </div>
      </div>
      <div className="flex h-3/5 gap-5">
        <div className="flex w-7/12 gap-5">
          <div className="flex w-1/3 flex-col rounded-xl bg-dark-coal p-3">
            <div
              className="group mb-3 flex cursor-pointer items-center gap-5"
              onClick={() => {
                navigate("/app/analyzer");
              }}
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-dark-coal shadow-inner shadow-lights">
                <img src={analyzer} className="size-7 self-center" />
              </div>
              <div className="flex flex-1 flex-col text-main-white">
                <p className="text-xl transition-colors duration-300 group-hover:text-main-accent">
                  {t("analyzer.title")}
                </p>
              </div>
              <ArrowRight2 size="16" className="text-main-accent" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3 overflow-auto">
              <div className="space-y-3">
                <textarea
                  value={requestInput}
                  onChange={(e) => setRequestInput(e.target.value)}
                  placeholder={t("analyzer.data.input_placeholder")}
                  rows={5}
                  className="w-full rounded-2xl bg-dark-graphite p-3 text-[16px] text-white placeholder:text-supporting focus:outline-none focus:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleStartGenerate();
                    }
                  }}
                />
                <div className="space-y-2 text-supporting">
                  <p className="pl-3 text-[14px]">
                    {t("analyzer.data.select1.title")}
                  </p>
                  <StyledSelect
                    options={[
                      { text: "All", value: "any" },
                      { text: "4-20", value: "medium" },
                      { text: "20+", value: "long" },
                    ]}
                    defaultValue="any"
                    onChange={(val) => console.log("Выбрано:", val)}
                  />
                  <p className="pl-3 text-[14px]">
                    {t("analyzer.data.select2.title")}
                  </p>
                  <StyledSelect
                    options={[
                      { text: "All", value: "all" },
                      { text: "Русский", value: "ru" },
                      { text: "English", value: "eng" },
                    ]}
                    defaultValue="all"
                    onChange={(val) => console.log("Выбрано:", val)}
                  />
                </div>
              </div>
              <AppButton
                text={t("analyzer.button")}
                action={handleStartGenerate}
                bgColor="dark-graphite"
              />
            </div>
          </div>
          <div className="flex w-1/3 flex-col rounded-xl bg-dark-coal p-3">
            <div className="group mb-3 flex cursor-pointer items-center gap-5">
              <div className="flex size-14 items-center justify-center rounded-xl bg-dark-coal shadow-inner shadow-lights">
                <img src={scenario} className="size-7 self-center" />
              </div>
              <div className="flex flex-1 flex-col text-main-white">
                <p className="mb-0 text-xl leading-none transition-colors duration-300 group-hover:text-main-accent">
                  {t("scenario.title")}
                  <br />
                  <span className="text-[14px] text-supporting">
                    {t("scenario.subtext")}
                  </span>
                </p>
              </div>
              <ArrowRight2 size="16" className="text-main-accent" />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-dark-coal p-2">
              <div>
                <div className="mb-6">
                  <p className="text-2xl text-main-white">
                    {scenarioText.title}
                  </p>
                  <p className="text-gray">{scenarioText.subtitle}</p>
                </div>
                {/* Блок с прокруткой текста */}
                <div className="max-h-[350px] overflow-auto pr-2">
                  <TypingText text={scenarioText.text} speed={20} />
                </div>
              </div>

              {/* <div className="w-full space-y-2">
                {videos.length > 0
                  ? videos.map((item, index) => (
                      <SmallVideoItem
                        key={index}
                        title={item.title}
                        characteristics={item.characteristics}
                        duration={item.duration}
                        url={item.url}
                      />
                    ))
                  : Array.from({ length: 20 }).map((_, index) => (
                      <div
                        key={index}
                        className="animate-pulse rounded-2xl bg-dark-graphite p-3"
                      >
                        <div className="aspect-h-9 aspect-w-16"></div>
                        <div className="h-24"></div>
                        <div className="h-1"></div>
                      </div>
                    ))}
              </div> */}
            </div>
          </div>
          <div className="flex w-1/3 flex-col rounded-xl bg-dark-coal p-3">
            <div
              className="group mb-3 flex cursor-pointer items-center gap-5"
              onClick={() => {
                navigate("/app/timestamps");
              }}
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-dark-coal shadow-inner shadow-lights">
                <img src={time} className="size-7 self-center" />
              </div>
              <div className="flex flex-1 flex-col text-main-white">
                <p className="text-xl transition-colors duration-300 group-hover:text-main-accent">
                  {t("timestamps.title")}
                </p>
              </div>
              <ArrowRight2 size="16" className="text-main-accent" />
            </div>
            {/* Контейнер изображения */}
            <div className="flex grow items-center justify-center overflow-hidden">
              <Lottie
                animationData={timeAnimation}
                loop={true}
                autoplay={true}
                style={{
                  width: "100%",
                  height: "100%",
                  scale: "1.25",
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex w-5/12 flex-col rounded-xl bg-dark-coal p-3">
          <div className="group mb-3 flex cursor-pointer items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-xl bg-dark-coal shadow-inner shadow-lights">
              <img src={trends} className="size-7 self-center" />
            </div>
            <div className="flex flex-1 flex-col text-main-white">
              <p className="text-xl transition-colors duration-300 group-hover:text-main-accent">
                {t("trends.title")}
              </p>
            </div>
            <ArrowRight2 size="16" className="text-main-accent" />
          </div>
          <div
            ref={scrollContainerRef}
            className="overflow-scroll rounded-xl bg-dark-graphite p-2"
          >
            <div className="grid w-full gap-4 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
              {videos.length > 0
                ? videos.map((item, index) => (
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    <div key={index} className="card-class">
                      <SmallVideoItem
                        title={item.title}
                        characteristics={item.characteristics}
                        duration={item.duration}
                        channel={item.channel}
                        channelThumbnail={item.channel_thumbnail}
                        channelUrl={item.channel_url}
                        channelSubs={item.channel_subs}
                        status={item.status}
                        url={item.url}
                        base_id={item.base_id}
                        trends={true}
                      />
                    </div>
                  ))
                : Array.from({ length: 20 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-2xl bg-dark-coal p-3"
                    >
                      <div className="aspect-h-9 aspect-w-16"></div>
                      <div className="h-24"></div>
                      <div className="h-1"></div>
                    </div>
                  ))}
            </div>
          </div>
          {/* Контейнер видео */}
          {/* <div className="flex grow items-center justify-center overflow-hidden">
            <video
              src={createWidget}
              autoPlay
              muted
              playsInline
              loop
              className="size-full rounded-xl object-cover"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
