import { Listbox } from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "iconsax-react";
import { createPortal } from "react-dom";

export default function StyledSelect({
  options = [],
  defaultValue,
  value,
  onChange,
  isLoading = false,
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue || options[0]?.value,
  );
  const [playingPreview, setPlayingPreview] = useState(null);
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  const selected = isControlled ? value : internalValue;

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue || options[0]?.value);
    }
  }, [defaultValue, options]);

  const handleChange = (val) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handlePreviewClick = (e, previewUrl) => {
    e.stopPropagation();
    
    if (playingPreview === previewUrl) {
      audioRef.current?.pause();
      setPlayingPreview(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(previewUrl);
      audioRef.current.play();
      setPlayingPreview(previewUrl);
      
      audioRef.current.onended = () => {
        setPlayingPreview(null);
      };
    }
  };

  const selectedOption = options.find((opt) => opt.value === selected);

  return (
    <div className="relative w-full font-normal text-supporting">
      <Listbox value={selected} onChange={handleChange}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button 
                ref={buttonRef}
                className="relative w-full cursor-pointer rounded-xl bg-dark-graphite py-4 pl-4 pr-10 text-left shadow-md outline-none transition"
                disabled={isLoading}
              >
                <span className="block truncate text-[16px]">
                  {selectedOption?.text || "—"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-2">
                  {isLoading ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  )}
                </span>
              </Listbox.Button>
            </div>

            {open && buttonRef.current && createPortal(
              <div
                className="fixed z-[9999]"
                style={{
                  top: buttonRef.current.getBoundingClientRect().bottom + 8,
                  left: buttonRef.current.getBoundingClientRect().left,
                  width: buttonRef.current.getBoundingClientRect().width,
                }}
              >
                <Listbox.Options
                  static
                  className="max-h-[170px] w-full overflow-y-auto rounded-xl bg-dark-graphite text-[16px] shadow-xl outline-none ring-0 focus:border-0 focus:shadow-none focus:outline-none focus:ring-0 text-white"
                >
                  {options.map((option, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={option.value}
                      className={({ selected }) => {
                        const isFirst = idx === 0;
                        const isLast = idx === options.length - 1;
                        return `relative cursor-pointer select-none py-3 pl-4 pr-4 transition-colors hover:bg-[rgba(43,217,211,0.1)] hover:text-main-accent ${selected ? "text-main-accent" : "text-white"} ${isFirst ? "rounded-t-2xl" : ""} ${isLast ? "rounded-b-2xl" : ""} focus:outline-none`;
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.text}</span>
                        {option.preview_url && (
                          <button
                            onClick={(e) => handlePreviewClick(e, option.preview_url)}
                            className="ml-2 rounded-full p-1 hover:bg-[rgba(43,217,211,0.1)]"
                          >
                            {playingPreview === option.preview_url ? (
                              <Pause size={16} className="text-main-accent" />
                            ) : (
                              <Play size={16} className="text-main-accent" />
                            )}
                          </button>
                        )}
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>,
              document.body
            )}
          </>
        )}
      </Listbox>
    </div>
  );
}
