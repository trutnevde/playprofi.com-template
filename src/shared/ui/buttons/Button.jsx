// import { Litecoin } from "iconsax-react";

export default function Button(props) {
  const {
    bgColor = "bg-main-accent",
    borderColor,
    children,
    hoverStyles = "hover:text-main-dark hover:bg-main-white",
    variant = "main-default",
    textColor = variant === "secondary"
      ? "text-main-white"
      : "text-dark-graphite",
    className,
    isLoading = false,
    ...otherProps
  } = props;
  const varianStyles = {
    "lg-default": `px-6 py-[9px] border border-${borderColor} text-${textColor} rounded-[20px] bg-transparent font-circe-regular ${hoverStyles}`,
    filled: `px-6 py-[9px] font-circe-regular ${textColor} ${bgColor}`,
    "main-filled": `px-6 py-[9px] rounded-[12px] w-full ${textColor} font-circe-regular ${bgColor} hover:bg-transparent border border-transparent hover:border hover:border-main-accent hover:text-main-accent`,
    secondary: `font-circe-regular ${textColor} hover:text-white`,
  };

  return (
    <button
      className={`${varianStyles[variant]} flex min-h-[56px] cursor-pointer flex-row items-center justify-center text-[16px] transition-all duration-300 ease-in-out ${className}`}
      {...otherProps}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        <p className="flex flex-col items-center leading-tight">
          {children}
          {/* <br />
          <span className="flex gap-1 text-[13px]">
            1 Токен
            
          </span> */}
        </p>
      )}
    </button>
  );
}
