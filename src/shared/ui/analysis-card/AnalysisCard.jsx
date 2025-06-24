import { LuFlame } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";

export default function AnalysisCard({ rotate, title, views,place, image }) {
  return (
    <div
      className={`flex h-[290px] w-[512px] flex-col rounded-2xl px-[25px] py-[16px] text-main-white shadow-lg-trend-card ${rotate}`}
      style={{backgroundImage: `url("${image}")`}}
    >
      <p className="flex-1 text-3xl">{title}</p>
      <div className="flex flex-col">
        <div className="flex items-center gap-[16px]">
          <LuFlame color="FF5E2D" size={32} />
          <p className="text-2xl">{place} place in trends</p>
        </div>
        <div className="flex items-center gap-[16px]">
          <IoIosArrowUp color="6AFF45" size={32} />
          <p className="text-2xl">{views} views</p>
        </div>
      </div>
    </div>
  );
}
