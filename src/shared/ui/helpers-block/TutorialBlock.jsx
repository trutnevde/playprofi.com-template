/**
 * Универсальный компонент для вывода списка шагов (timeline).
 * @param {string} title    - Заголовок блока (например, "Tutorial for Timestamps")
 * @param {Array} steps     - Массив объектов: [{ title: '', description: '' }, ...]
 */

import { FaChartLine, FaClock } from "react-icons/fa";
import {
  LampCharge,
  MouseSquare,
  PenAdd,
  Like1,
  Health,
  DocumentDownload,
  Youtube,
  Category2,
  ReceiveSquare,
  Clock,
  Flag,
} from "iconsax-react";

const iconMap = {
  FaChartLine: FaChartLine,
  FaClock: FaClock,
  LampCharge: LampCharge,
  MouseSquare: MouseSquare,
  PenAdd: PenAdd,
  Health: Health,
  Like1: Like1,
  Category2: Category2,
  Youtube: Youtube,
  DocumentDownload: DocumentDownload,
  Flag: Flag,
  Clock: Clock,
  ReceiveSquare: ReceiveSquare,
};

function TutorialSteps({ title, steps = [] }) {
  return (
    <div className="relative w-full max-w-3xl space-y-16 rounded-2xl p-6 text-supporting">
      {/* Заголовок */}
      {title && <h2 className="ml-5 text-[36px]">{title}</h2>}

      {/* Контейнер для вертикальной линии */}
      <div className="relative space-y-0 border-dark-coal">
        {steps.map((step, idx) => {
          // Преобразуем строку `icon` в компонент из `iconMap`
          const IconComponent = iconMap[step.icon];

          return (
            <div key={idx} className="relative">
              {/* Карточка с контентом шага */}
              <div className="flex rounded-2xl bg-dark-coal p-7 shadow-sm">
                <div className="absolute left-5 top-[-35px]">
                  {/* Заголовок шага */}
                  <div className="mb-2 rounded-2xl bg-dark-graphite p-4 font-medium">
                    {IconComponent && (
                      <IconComponent
                        size={32}
                        variant="Bulk"
                        className="text-supporting"
                      />
                    )}
                  </div>
                  <p className="rounded-2xl bg-dark-graphite px-6 text-center">
                    {idx + 1}
                  </p>
                </div>
                <div className="ml-24">
                  {/* Описание шага */}
                  {step.description && (
                    <p className="text-[16px]">{step.description}</p>
                  )}
                </div>
              </div>
              {/* Линия, идущая вниз от кружка (кроме последнего шага) */}
              {idx < steps.length - 1 && (
                <span className="ml-12 block h-[80px] w-[8px] bg-dark-coal" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TutorialSteps;
