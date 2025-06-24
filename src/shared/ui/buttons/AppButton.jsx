import { useNavigate } from "react-router-dom";

const colorClassMap = {
  "dark-supporting": {
    from: "from-dark-supporting",
    via: "via-dark-supporting",
    to: "to-dark-supporting",
    bg: "bg-dark-supporting",
  },
  "dark-coal": {
    from: "from-dark-coal",
    via: "via-dark-coal",
    to: "to-dark-coal",
    bg: "bg-dark-coal",
  },
  "dark-graphite": {
    from: "from-dark-graphite",
    via: "via-dark-graphite",
    to: "to-dark-graphite",
    bg: "bg-dark-graphite",
  },
  // Добавляй по мере необходимости
};

export default function AppButton({
  text,
  action = "#",
  disabled,
  bgColor = "dark-supporting",
  active = false,
  isLoading = false,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof action === "string") {
      navigate(action);
    } else if (typeof action === "function") {
      action();
    } else {
      console.log("No valid action provided");
    }
  };

  const colorClasses =
    colorClassMap[bgColor] || colorClassMap["dark-supporting"];
  return (
    <button
      className={`group relative min-h-[56px] w-full rounded-xl border-2 bg-gradient-to-r p-3 text-[18px] transition-all duration-300 ${
        active
          ? `border-[rgba(39,223,217,0.05)] from-[rgba(27,27,27,0.05)] via-[rgba(39,223,217,0.05)] to-[rgba(39,223,217,0.07)] text-main-accent`
          : !disabled
            ? `border-transparent text-supporting hover:border-[rgba(39,223,217,0.05)] hover:from-[rgba(27,27,27,0.05)] hover:via-[rgba(39,223,217,0.05)] hover:to-[rgba(39,223,217,0.05)] hover:text-main-accent ${colorClasses.from} ${colorClasses.via} ${colorClasses.to}`
            : `border-transparent text-supporting ${colorClasses.from} ${colorClasses.via} ${colorClasses.to}`
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        text
      )}
    </button>
  );
}
