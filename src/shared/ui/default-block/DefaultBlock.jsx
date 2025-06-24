function DefaultBlock({ children, bgColor = "bg-dark-coal", className }) {
  return (
    <div className={`${bgColor} rounded-3xl ${className}`}>{children}</div>
  );
}

export default DefaultBlock;
