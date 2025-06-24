import { useEffect, useState } from "react";

// Функция для динамического импорта иконок
const loadIcon = async (iconName) => {
  try {
    const iconModule = await import("iconsax-react");
    return iconModule[iconName];
  } catch (error) {
    console.error(`Не удалось загрузить иконку: ${iconName}`, error);
    return null;
  }
};

export const IconComponent = ({ icon, className = "", variant = "Bulk", size = "24",  onClick = undefined }) => {
  const [LoadedIcon, setLoadedIcon] = useState(null);

  useEffect(() => {
    const loadIconAsync = async () => {
      const Icon = await loadIcon(icon);
      setLoadedIcon(() => Icon);
    };

    loadIconAsync();
  }, [icon]);

  if (!LoadedIcon) return null;

  return (
    <div className={className} onClick={onClick}>
      <LoadedIcon variant={variant} size={size} />
    </div>
  );
};