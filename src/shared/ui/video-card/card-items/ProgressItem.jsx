/**
 * Индикатор прогресса с поддержкой статуса ошибки
 * @param {Object} props
 * @param {number} props.progress - Прогресс в процентах (0–100)
 * @param {string} props.status - Статус загрузки ("loading", "error", "done")
 */
const ProgressItem = ({ progress = 100, status = "success" }) => {
  // Не показываем ничего, если прогресс завершён и нет ошибки
  if (progress >= 100 && status !== "error") return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:blur-sm group-hover:brightness-20">
      <div className="relative size-14">
        {/* Фоновый круг */}
        <svg className="absolute inset-0 size-full">
          <circle
            cx="28"
            cy="28"
            r="20"
            stroke={status === "error" ? "#371716" : "#007B75"} // тёмный красный или зелёный
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Заполняющийся круг */}
        <svg className="absolute inset-0 size-full">
          <circle
            cx="28"
            cy="28"
            r="20"
            stroke={status === "error" ? "#FF3B30" : "#29e4de"} // красный или голубой
            strokeWidth="2"
            fill="none"
            strokeDasharray="126"
            strokeDashoffset={126 - (126 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Иконка ошибки */}
        {status === "error" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="size-6 text-[#FF3B30]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6l-12 12"
                />
              </svg>
            </div>
            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[14px] font-normal text-[#FF3B30]">
              Processing Error
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressItem;
