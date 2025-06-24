export default function TabButton(props) {
  const {
    textColor = "text-supporting",
    bgColor = "bg-dark-coal",
    borderInfo = "active:border-main-white border-transparent active:border-opacity-70 border-inner",
    children,
    icon,
    iconBoxStyles = "bg-main-accent text-main-secondary",
    ...otherProps
  } = props;

  return (
    <button
      className={`group relative overflow-hidden border ${bgColor} ${textColor} ${borderInfo} flex items-center rounded-lg px-4 py-2 text-center`}
      {...otherProps}
    >
      <div className="relative z-10 flex w-full items-center justify-center gap-[15px]">
        <span className="text-[16px] font-normal">{children}</span>
        {icon && (
          <div className={`${iconBoxStyles} rounded-[18px] p-[9px]`}>
            {icon}
          </div>
        )}
      </div>
    </button>
  );
}
