import HeartIcon from "../../components/icons/Heart.jsx"; // или '@/shared/components/icons/Heart.jsx'

const ICONS = {
  heart: HeartIcon,
};

export default function SvgIcon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  ...props // <-- остальные пропсы
}) {
  const Icon = ICONS[name];
  if (!Icon) {
    console.warn(`Иконка "${name}" не найдена`);
    return null;
  }

  return (
    <Icon
      width={size}
      height={size}
      fill={color}
      className={className}
      {...props} // <-- прокидываем onClick и т.п.
    />
  );
}
