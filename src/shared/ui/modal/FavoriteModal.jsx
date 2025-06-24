import { useEffect, useRef, useState, useCallback } from "react";
import { CloseSquare, SearchNormal1 } from "iconsax-react";
import { useLazyGetFavoritesQuery } from "./api";
import VideoCard from "../video-card/VideoCard";

export default function FavoriteModal({ isPopupOpen, closePopup }) {
  const popupRef = useRef(null);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQueryModal, setSearchQueryModal] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [fetchFavorites, { data, error, isLoading, isFetching }] =
    useLazyGetFavoritesQuery();

  // ✅ Загружаем избранные видео **только** при открытии окна
  useEffect(() => {
    if (isPopupOpen) {
      setVideos([]); // Очистка видео
      setOffset(0); // Сброс offset
      setHasMore(true); // Разрешаем подгрузку новых данных

      fetchFavorites({ limit: 8, offset: 0 }) // Загружаем первую партию
        .unwrap()
        .then((response) => {
          if (response.items.length === 0) setHasMore(false);
          setVideos(response.items);
        })
        .catch(() => setHasMore(false));
    }
  }, [isPopupOpen, fetchFavorites]);

  // ✅ Подгружаем новые данные при изменении offset
  useEffect(() => {
    if (offset > 0 && hasMore) {
      fetchFavorites({ limit: 8, offset })
        .unwrap()
        .then((response) => {
          if (response.items.length === 0) setHasMore(false);
          else setVideos((prev) => [...prev, ...response.items]);
        })
        .catch(() => setHasMore(false));
    }
  }, [offset, hasMore, fetchFavorites]);

  // ✅ Обрабатываем скролл контейнера
  const handleScroll = useCallback(() => {
    console.log(containerRef);
    if (!containerRef.current || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setOffset((prev) => prev + 8); // Увеличиваем `offset`
    }
  }, [hasMore, isFetching]);

  // ✅ Следим за скроллом контейнера
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ✅ Закрытие модального окна при клике вне него
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        closePopup();
      }
    }

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.classList.add("overflow-hidden");
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isPopupOpen, closePopup]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
        isPopupOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        ref={popupRef}
        className={`relative h-4/6 w-8/12 max-w-full text-white transition-all duration-300 ease-in-out ${
          isPopupOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <p className="absolute -top-20 left-1/2 -translate-x-1/2 text-5xl font-semibold">
          Избранное
        </p>

        <div className="flex size-full flex-col rounded-lg bg-dark-graphite p-6">
          <div className="mb-3 flex w-full space-x-5">
            <div className="flex w-full rounded-2xl bg-dark-coal p-4 transition-all duration-500">
              <input
                type="text"
                placeholder="Search"
                value={searchQueryModal}
                onChange={(e) => setSearchQueryModal(e.target.value)}
                className="flex-1 bg-transparent text-xl text-white placeholder:text-supporting focus:outline-none focus:ring-0 focus:ring-main-accent"
              />
              <SearchNormal1
                size={32}
                variant="Bulk"
                className="mr-3 cursor-pointer text-supporting hover:text-main-accent"
              />
            </div>
            <div className="flex flex-col items-center space-y-3">
              <CloseSquare
                variant="Bulk"
                size={30}
                className="cursor-pointer text-supporting transition-colors duration-300 hover:text-red-500"
                onClick={closePopup}
              />
              {isFetching && (
                <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
            </div>
          </div>

          {isLoading && videos.length === 0 ? (
            <div className="mt-4 grid grid-cols-4 gap-4 overflow-auto rounded-md pr-2 transition-all duration-300">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl bg-dark-supporting p-3"
                >
                  <div className="aspect-h-9 aspect-w-16"></div>
                  <div className="h-16"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="mt-2 text-center text-red-500">Ошибка загрузки</p>
          ) : videos.length === 0 ? (
            <div className="mt-3 flex h-full items-center justify-center text-lg text-supporting">
              У вас пока нет избранных элементов.
            </div>
          ) : (
            <div
              ref={containerRef}
              className="flex flex-1 overflow-y-auto pr-2"
            >
              <VideoCard videos={videos} layoutType="small" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
