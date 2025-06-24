import React from "react";
import { IconComponent } from "../../icon/Icon";
import CustomTooltip from "../../title/CustomTitle";

const CharacteristicsList = ({ characteristics, variant = "small" }) => {
  const formatNumber = (number) => {
    if (typeof number === "number") {
      return new Intl.NumberFormat("ru-RU").format(number);
    }
    return number;
  };

  const tooltipMap = {
    Perfomance: "The ratio of views to average views",
    Perfomance1: "The ratio of views to subscribers",
  };

  if (variant === "big") {
    return characteristics.slice(0, 9).map((char, index) => {
      const tooltipCharacteristics = ["Perfomance"];
      const shouldShowTooltip = tooltipCharacteristics.includes(char.name);
      const tooltipText =
        char.name === "Perfomance" &&
        "The ratio of views to subscribers";

      const content = (
        <div key={index} className="flex items-center">
          <IconComponent
            icon={char.icon}
            className={`mr-2 ${
              index === 0 ? "text-main-accent" : "text-supporting"
            }`}
            size={24}
          />
          <span
            className={`${
              index === 0 ? "text-main-accent" : "text-supporting"
            }`}
          >
            {char.name}
          </span>
          {char.subtext && (
            <span
              className={`ml-2 w-fit ${
                index === 0 ? "text-main-accent" : "text-supporting"
              }`}
            >
              {formatNumber(char.subtext)}
            </span>
          )}
          {char.name === "Perfomance" && (
            <span className="ml-2 text-main-accent">%</span>
          )}
        </div>
      );

      return shouldShowTooltip ? (
        <CustomTooltip key={index} tooltipContent={tooltipText}>
          {content}
        </CustomTooltip>
      ) : (
        content
      );
    });
  }

  // === SMALL вариант ===
  return characteristics.slice(0, 9).map((char, index) => {
    const isRightAligned = index % 3 === 2;
    const isHighlighted =
      char.name === "Perfomance" || char.name === "Perfomance1";
    const tooltipText = tooltipMap[char.name];

    const content = (
      <div
        key={index}
        className={`flex items-center ${
          isRightAligned ? "justify-self-end" : "justify-self-start"
        }`}
      >
        <IconComponent
          icon={char.icon}
          variant="Bulk"
          size={24}
          className={`mr-1 ${
            isHighlighted ? "text-main-accent" : "text-supporting"
          }`}
        />
        {char.subtext && (
          <span
            className={`line-clamp w-fit truncate font-normal leading-normal ${
              isHighlighted ? "text-main-accent" : "text-supporting"
            }`}
          >
            {formatNumber(char.subtext)}
            {isHighlighted && <span className="text-main-accent"> %</span>}
          </span>
        )}
      </div>
    );

    return tooltipText ? (
      <CustomTooltip key={char.name} tooltipContent={tooltipText}>
        {content}
      </CustomTooltip>
    ) : (
      <React.Fragment key={index}>{content}</React.Fragment>
    );
  });
};

export default CharacteristicsList;
