import { useRef, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useUploadFileMutation } from "./api/api";

function SelectFile({ setVideoUrl, uploadData, setUploadData, t }) {
  const fileInputRef = useRef(null);
  const uploadTimerRef = useRef(null); // чтобы хранить ID setInterval (не в стейте)
  const [uploadFile] = useUploadFileMutation();

  // Общий объект состояния

  // Хелпер-функции для обновления полей объекта
  // eslint-disable-next-line no-unused-vars
  const setStatus = (status) => {
    setUploadData((prev) => ({ ...prev, status }));
  };
  const setProgress = (progress) => {
    setUploadData((prev) => ({ ...prev, progress }));
  };
  const setError = (msg) => {
    setUploadData((prev) => ({ ...prev, status: "error", errorMsg: msg }));
  };
  const setFileInfo = (fileName, totalFileSizeMB) => {
    setUploadData((prev) => ({
      ...prev,
      fileName,
      totalFileSizeMB,
    }));
  };

  // По нажатию на основной блок
  const handleClick = () => {
    // Если у нас уже "success" или "error", при новом клике сбрасываем
    if (uploadData.status === "error" || uploadData.status === "success") {
      resetAll();
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка формата
    if (!file.type.startsWith("video/")) {
      setError("Incorrect file format");
      return;
    }

    // Сохраняем имя и размер файла
    const sizeInMB = file.size / (1024 * 1024);
    setFileInfo(file.name, sizeInMB);

    // При старте сразу ставим статус "uploading" и сбрасываем прогресс
    setUploadData((prev) => ({
      ...prev,
      status: "uploading",
      errorMsg: "",
      progress: 0,
    }));

    try {
      const response = await uploadFile({
        file,
        onUploadProgress: (progressEvent) => {
          // Вычисляем % и записываем в стейт
          const progressValue = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(progressValue); // Обновляем uploadData.progress
          setUploadData((prev) => ({
            ...prev,
            progress: progressValue,
          }));
        },
      }).unwrap();

      // Если сервер вернул url, считаем загрузку успешной
      if (response.url) {
        setUploadData((prev) => ({
          ...prev,
          progress: 100,
          status: "success",
        }));
        setVideoUrl(`https://cdn.playprofi.com${response.url}`);
      }
    } catch (err) {
      console.error("Ошибка загрузки файла:", err);
      setError("Ошибка загрузки файла");
    }
  };

  // // Имитация загрузки
  // const startUploadSimulation = () => {
  //   setUploadData((prev) => ({
  //     ...prev,
  //     status: "uploading",
  //     errorMsg: "",
  //     progress: 0,
  //   }));

  //   let current = 0;
  //   // Каждые 100 мс → +5%
  //   uploadTimerRef.current = setInterval(() => {
  //     current += 5;
  //     if (current >= 100) {
  //       current = 100;
  //       clearInterval(uploadTimerRef.current);
  //       uploadTimerRef.current = null;
  //       // Успех
  //       setUploadData((prev) => ({
  //         ...prev,
  //         progress: 100,
  //         status: "success",
  //       }));
  //     } else {
  //       // Продолжаем «загружаться»
  //       setProgress(current);
  //     }
  //   }, 100);
  // };

  // Сброс в "idle"
  const resetAll = () => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }
    // Сбрасываем стейт
    setUploadData({
      status: "idle",
      progress: 0,
      errorMsg: "",
      fileName: "",
      totalFileSizeMB: 0,
    });
    // Сбрасываем поле value у input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Для удобства вычислим «сколько MB загружено»
  const loadedMB = uploadData.totalFileSizeMB * (uploadData.progress / 100);
  const loadedMBStr = loadedMB.toFixed(2);
  const totalMBStr = uploadData.totalFileSizeMB.toFixed(2);

  // Эффект для очистки таймера при размонтировании
  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      className="relative flex min-h-240 cursor-pointer flex-col items-center justify-center space-y-4 rounded-xl bg-dark-coal p-12 text-white transition-colors duration-300 hover:bg-dark-graphite"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1) Ошибка */}
      {uploadData.status === "error" && (
        <p className="absolute bottom-4 text-red-500">{uploadData.errorMsg}</p>
      )}

      {/* 2) Идл */}
      {(uploadData.status === "idle" || uploadData.status === "error") && (
        <div className="flex flex-col items-center">
          <span className="text-[80px] font-light text-white">+</span>
          <span className="mt-16 text-center text-[18px]">
            {t("fileInputText")}
          </span>
        </div>
      )}

      {/* Спиннер */}
      {uploadData.status == "uploading" && (
        <div className="size-8 animate-spin rounded-full border-2 border-solid border-main-accent border-x-[#007B75] border-t-[#007B75]" />
      )}

      {/* 4) Успех */}
      {uploadData.status === "success" && (
        <div className="flex flex-col items-center space-y-2 text-main-accent">
          <div className="flex size-8 items-center justify-center rounded-full border-2 border-solid border-main-accent bg-dark-coal">
            <FaCheck className="text-main-accent" size={12} />
          </div>
        </div>
      )}

      {/* Прогресс-бар внизу, если uploading или success */}
      {(uploadData.status === "uploading" ||
        uploadData.status === "success") && (
        <div className="w-full px-4">
          <div className="relative h-2 w-full overflow-hidden rounded bg-dark-graphite">
            <div
              className="absolute left-0 top-0 h-full bg-main-accent transition-all duration-200"
              style={{ width: `${uploadData.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3) Идёт загрузка */}
      {uploadData.status == "uploading" && (
        <div className="flex flex-col items-center space-y-2">
          <p>
            <span className="text-[14px] text-main-accent">
              {loadedMBStr} mb{" "}
            </span>
            <span className="text-[14px] text-supporting">
              of {totalMBStr} mb
            </span>
          </p>
        </div>
      )}

      {uploadData.status == "success" && (
        <p className="text-[14px]">
          <span className="text-main-accent">Successfully load </span>
          <span className="text-supporting">
            {uploadData.fileName.length > 10
              ? `${uploadData.fileName.substring(0, 10)}...`
              : uploadData.fileName}
          </span>
        </p>
      )}
    </div>
  );
}

export default SelectFile;
