export default function ActionButton(props) {
  const {
    textColor = "text-main-dark",
    bgColor = "bg-main-accent",
    borderInfo = "border-main-white",
    children,
    icon,
    iconBoxStyles = "bg-main-accent text-main-dark",
    ...otherProps
  } = props;

  return (
    <button
      className={`group relative overflow-hidden border ${bgColor} ${textColor} ${borderInfo} flex items-center rounded-lg px-2 py-4 text-center`}
      {...otherProps}
    >
      <div className="relative z-10 flex w-full items-center justify-center">
        <span className="px-[14px] text-[16px] font-light">{children}</span>
        {icon && (
          <div className={`${iconBoxStyles} rounded-[18px] p-[9px]`}>
            {icon}
          </div>
        )}
      </div>
      <div className="absolute inset-0 origin-left scale-x-0 bg-main-accent transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
    </button>
  );
}
