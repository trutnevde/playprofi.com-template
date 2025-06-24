import cn from "classnames";

import s from "./style.module.scss";

export const Toggle = (props) => {
  const { label, description, checked, onChange } = props;

  const iconClass = cn(s.icon, {
    [s.checked]: checked,
  });

  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div className={s.toggle}>
      <div className={iconClass} onClick={handleClick} />

      <div className={s.label}>{label}</div>
      <div className={s.description}>{description}</div>
    </div>
  );
};
