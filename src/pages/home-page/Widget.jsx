import { MdKeyboardArrowRight } from "react-icons/md";
import Button from "../../shared/ui/buttons/Button";
import DefaultBlock from "../../shared/ui/default-block/DefaultBlock";
//TODO: Если будет повторяться где-то кроме начальной страницы, то вынести в shared
function Widget({
  icon,
  title,
  onClick,
  subtitle,
  description,
  cols,
  children,
}) {
  return (
    <DefaultBlock className={`p-[10px] ${cols} w-full`}>
      <div className="flex items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-xl bg-dark-coal shadow-inner shadow-lights">
          {icon}
        </div>
        <div className="flex flex-1 flex-col text-main-white">
          <p className="text-xl">{title}</p>
          {subtitle && <p>{subtitle}</p>}
          {description && <p className="text-gray">{description}</p>}
        </div>
        {onClick && (
          <Button varian="secondary" onClick={onClick}>
            <MdKeyboardArrowRight size={20} className="text-main-accent" />
          </Button>
        )}
      </div>
      <div className="overflow-auto bg-red-700 pt-4">
        {children}
      </div>
    </DefaultBlock>
  );
}

export default Widget;
