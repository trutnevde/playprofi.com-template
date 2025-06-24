import { IconComponent } from "../icon/Icon";
import { Trash, ArrowRotateLeft, Eye } from "iconsax-react";

import defImage from "../../assets/image/logo-pp.png";

function BaseItem({
  id,
  url,
  title,
  channelUrl,
  characteristics,
  onRemove,
  average_views,
  days,
  isFetchingAnalysisChannelCountVideo = false,
  startAnalysisChannel,
}) {
  return (
    <div className="flex cursor-pointer flex-col justify-between rounded-2xl border border-transparent bg-dark-coal p-3 transition-colors duration-300 hover:border-main-accent">
      <div>
        <div className="mb-2 flex items-center justify-between space-x-2">
          <span className="inline-flex w-1/2 justify-center rounded-2xl bg-dark-graphite px-3 py-1 text-[14px] text-supporting">
            {average_views} views
          </span>
          <span className="inline-flex w-1/2 justify-center rounded-2xl bg-dark-graphite px-3 py-1 text-[14px] text-supporting">
            {days} days
          </span>
        </div>
        <div className="flex">
          <div className="w-1/2 rounded-2xl bg-dark-graphite">
            <div className=" rounded-2xl bg-dark-graphite">
              <img
                src={url}
                className="size-full rounded-2xl object-cover transition-all"
                onError={(e) => {
                  e.currentTarget.src = defImage;
                }}
                alt=""
              />
            </div>
          </div>

          <div className="flex w-full flex-col justify-between">
            <div className="ml-3 flex flex-col space-y-1">
              {characteristics.slice(0, 3).map((characteristic) => (
                <div key={characteristic.id} className="flex items-center">
                  <IconComponent
                    icon={characteristic.icon}
                    className="mr-2 text-supporting"
                    variant="Bulk"
                    size={24}
                  />
                  {characteristic.name && (
                    <span className="mr-1 text-gray">
                      {characteristic.name}
                    </span>
                  )}
                  {characteristic.subtext ? (
                    <span className="text-gray">{characteristic.subtext}</span>
                  ) : (
                    <span className="text-gray">0</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-2 right-2 rounded-lg bg-dark-overlay px-2 py-1 text-[16px] text-main-accent backdrop-blur-md">
          {duration}
        </div> */}
      </div>

      <div className="flex items-center">
        <p className="w-5/6 truncate py-2 text-[16px] font-normal leading-normal text-white">
          <a
            href={channelUrl}
            className="transition-all duration-300 hover:text-main-accent"
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {title}
          </a>
        </p>
      </div>
      {/* Информация о видео */}
      <div className="flex items-center justify-between space-x-3 text-[16px] text-supporting">
        <Eye
          size="32"
          variant="Bulk"
          className="w-full rounded-lg bg-dark-graphite py-1 transition-all duration-300 hover:text-main-accent"
          onClick={() => {
            window.location.href = `${window.location.origin}/app/trends/channel/${id}`;
          }}
        />
        {!isFetchingAnalysisChannelCountVideo ? (
          <ArrowRotateLeft
            size="32"
            variant="Bulk"
            className="w-full rounded-lg bg-dark-graphite py-1 transition-all duration-300 hover:text-main-accent"
            onClick={() => {
              startAnalysisChannel(id);
            }}
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-lg bg-dark-graphite">
            <div className="size-3 animate-spin rounded-full border-2 border-supporting border-t-transparent" />
          </div>
        )}
        <Trash
          size="32"
          variant="Bulk"
          className="w-full rounded-lg bg-dark-graphite py-1 transition-all duration-300 hover:text-red-700"
          onClick={() => {
            onRemove(id);
          }}
        />
      </div>
    </div>
  );
}

export default BaseItem;
