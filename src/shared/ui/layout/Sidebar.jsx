import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronLeft, FaUser } from "react-icons/fa";
import {
  // TrendUp,
  // Add,
  // Setting2,
  // People,
  // Barcode,
  Star1,
  Message,
  Bag,
} from "iconsax-react";
import classNames from "classnames";
import MenuItem from "./MenuItem";
import { useNavigate } from "react-router-dom";

import logo_pp from "../../assets/svg/pp-text.svg";
import logo_pp_mini from "../../assets/svg/pp.svg";

const Sidebar = ({ t, menuSections, data }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("isCollapsed")) ?? false,
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 1. При первом рендере
  useEffect(() => {
    const saved = localStorage.getItem("isCollapsed");
    const userSavedValue = saved !== null ? JSON.parse(saved) : false;

    // Если ширина < 1200, по умолчанию свернуть
    if (window.innerWidth < 1200) {
      setIsCollapsed(true);
      localStorage.setItem("isCollapsed", "true");
    } else {
      // Если >=1200, берем то, что в localStorage
      setIsCollapsed(userSavedValue);
    }
  }, []);

  // 2. По желанию, если хотите «насильно» сворачивать при resize < 1200,
  // но только когда ширина стала совсем узкой:
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsCollapsed(true);
        localStorage.setItem("isCollapsed", "true");
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 3. При клике на кнопку менять и сохранять
  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem("isCollapsed", JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <div
      className={classNames(
        "sidebar flex h-screen flex-col justify-between text-gray transition-all duration-300",
        {
          "w-56": !isCollapsed,
          "w-20": isCollapsed,
        },
      )}
    >
      <div>
        <div className="relative flex items-center justify-between px-5 py-9">
          <div
            className="flex h-[32px] cursor-pointer items-center"
            onClick={() => {
              navigate("/app/home");
            }}
          >
            {isCollapsed ? (
              <img src={logo_pp} className="w-[28px]" alt="logo" />
            ) : (
              <img src={logo_pp_mini} className="w-[28px]" alt="logo" />
            )}
            <h1
              className={classNames(
                "ml-5 text-[20px] text-white transition-opacity duration-300",
                {
                  "opacity-0 delay-0": isCollapsed,
                  "opacity-100 delay-300": !isCollapsed,
                },
              )}
            >
              PlayProfi
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="absolute -right-4 rounded-md bg-[#272727] p-2 text-white focus:outline-none"
          >
            <FaChevronLeft
              className={classNames(
                "transform transition-transform duration-300",
                {
                  "rotate-180": isCollapsed,
                },
              )}
            />
          </button>
        </div>

        <div className="overflow-auto overflow-x-hidden">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-1">
              <h2
                className={classNames(
                  "text-gray-400 mb-2 px-4 text-[12px] transition-opacity duration-300",
                  {
                    "opacity-0 delay-0": isCollapsed,
                    "opacity-100 delay-300": !isCollapsed,
                  },
                )}
              >
                {section.title}
              </h2>
              <ul>
                {section.items.map((item, index) => {
                  const isActive =
                    location.pathname.startsWith(item.link ?? "") ||
                    (item.sub &&
                      location.pathname.startsWith(item.sub.link ?? ""));

                  return (
                    <MenuItem
                      key={index}
                      name={item.name}
                      icon={item.icon}
                      notification={item.notification}
                      subtext={item.subtext}
                      isCollapsed={isCollapsed}
                      link={item.link}
                      isActive={isActive}
                      available={item.available}
                    />
                  );
                })}
              </ul>
            </div>
          ))}

          {/* <hr className="mx-4 mt-2 h-[2px] bg-dark-coal text-transparent" /> */}

          {/* <div
            className={classNames(
              "hover:bg-gray-700 ml-1 mt-2 flex cursor-pointer items-center p-2 transition-colors",
            )}
          >
            <div className="group flex flex-none items-center justify-center rounded-lg bg-dark-coal p-3">
              <Add className="text-[#29E4DE]" size={24} variant="Bulk" />
            </div>
            <div
              className={classNames(
                "ml-4 overflow-hidden text-[#29E4DE] transition-opacity duration-300",
                {
                  "pointer-events-none max-w-0": isCollapsed,
                  "pointer-events-auto max-w-xs": !isCollapsed,
                },
              )}
            >
              <span
                className={classNames(
                  "text-[16px] transition-opacity duration-300",
                  isCollapsed ? "opacity-0 delay-0" : "opacity-100 delay-300",
                )}
              >
                Create
              </span>
              <span
                className={classNames(
                  "block text-[12px] transition-opacity duration-300",
                  isCollapsed ? "opacity-0 delay-0" : "opacity-100 delay-300",
                )}
              >
                Project
              </span>
            </div>
          </div> */}

          {/* <div
          className={classNames(
            "hover:bg-gray-700 m-4 ml-2 mt-0 cursor-pointer transition-colors",
          )}
        >
          <div className="group flex items-center p-4">
            <div className="mr-3 flex-none">
              <Setting2
                className="group-hover:text-[#29E4DE]"
                size={24}
                variant="Bulk"
              />
            </div>
            <span
              className={classNames(
                "transition-opacity duration-300 group-hover:text-[#29E4DE]",
                {
                  "pointer-events-none opacity-0 delay-0": isCollapsed,
                  "pointer-events-auto opacity-100 delay-300": !isCollapsed,
                },
              )}
            >
              Settings
            </span>
          </div>
          <div className="group flex items-center p-4">
            <div className="mr-3 flex-none">
              <People
                className="group-hover:text-[#29E4DE]"
                size={24}
                variant="Bulk"
              />
            </div>
            <span
              className={classNames(
                "transition-opacity duration-300 group-hover:text-[#29E4DE]",
                {
                  "pointer-events-none opacity-0 delay-0": isCollapsed,
                  "pointer-events-auto opacity-100 delay-300": !isCollapsed,
                },
              )}
            >
              Team
            </span>
          </div>
        </div> */}
        </div>
      </div>

      <div
        className={classNames(
          "mb-10 flex flex-col items-center justify-end overflow-visible transition-all duration-500",
        )}
        style={{ minHeight: isCollapsed ? "64px" : "120px" }}
      >
        <div
          className="relative flex w-full flex-col items-center"
          ref={menuRef}
        >
          {/* Развернутое состояние */}
          <div
            className={classNames(
              "flex w-full flex-col items-center transition-all duration-0",
              {
                "pointer-events-none opacity-0": isCollapsed,
                "pointer-events-auto opacity-100": !isCollapsed,
              },
              { "delay-300": !isCollapsed },
            )}
          >
            {/* Иконка */}
            <div
              className="relative flex items-center justify-center rounded-md bg-main-accent p-3"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <FaUser size={20} className="text-main-dark" />

              <span className="absolute -right-8 -top-3 w-14 rounded-2xl bg-dark-coal text-center text-[16px] text-[#29E4DE]">
                {data?.items?.subs_active ? data?.items?.subs_type : "Free"}
              </span>
            </div>

            {/* Блок с текстом и кнопкой */}
            <div className="mt-2 flex w-full flex-col items-center overflow-hidden text-center">
              <p className="w-2/3 truncate text-[16px] text-supporting">
                {user?.user}
              </p>
              {data?.items?.subs_active == false && (
                <button
                  className="mt-2 rounded-xl bg-dark-coal p-3 text-[16px] text-[#29E4DE]"
                  onClick={() => {
                    window.location.href = "/app/subscriptions";
                  }}
                >
                  {t("button")}
                </button>
              )}
            </div>
          </div>

          {/* Свернутое состояние */}
          <div
            className={classNames(
              "absolute bottom-0 flex flex-col items-center justify-center gap-5",
              {
                "pointer-events-none opacity-0": !isCollapsed,
                "pointer-events-auto opacity-100": isCollapsed,
              },
              { "delay-300": isCollapsed },
            )}
          >
            <span className="w-[45px] rounded-lg bg-dark-coal text-center text-[16px] text-[#29E4DE]">
              {data?.items?.subs_active ? data?.items?.subs_type : "Free"}
            </span>

            <div
              className="flex items-center justify-center rounded-md bg-main-accent p-3"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <FaUser size={20} className="text-main-dark" />
            </div>
            {data?.items?.subs_active == false && (
              <div className="flex items-center justify-center rounded-lg bg-dark-coal p-2">
                <Bag
                  size="20"
                  variant="Bulk"
                  className="cursor-pointer text-main-accent"
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (!user?.isAuthenticated || user?.isGuest) {
                      navigate("/signin");
                      return;
                    } else {
                      window.location.href = "/app/subscriptions";
                    }
                  }}
                />
              </div>
            )}
          </div>

          {isOpen && (
            <div
              className={`absolute z-50 ml-2 w-fit -translate-y-1/2 rounded-2xl bg-dark-coal shadow-xl shadow-black ${isCollapsed ? "-top-3 left-20" : "-top-10 left-36"}`}
            >
              <p
                className="flex cursor-pointer items-center gap-3 whitespace-nowrap px-5 py-3 transition-all duration-300 hover:text-main-accent"
                onClick={() => {
                  navigate("/app/subscriptions");
                }}
              >
                <Star1 size="20" variant="Bulk" />
                <span className="text-white">Подписка</span>
              </p>
              <hr className="h-1 bg-dark-graphite text-transparent" />
              <p
                className="flex cursor-pointer items-center gap-3 whitespace-nowrap px-5 py-3 transition-all duration-300 hover:text-main-accent"
                onClick={() => {
                  console.log("Меняем язык");
                }}
              >
                <Message size="20" variant="Bold" />
                <span className="text-white">
                  <a
                    href="https://t.me/vadya056"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("mainMenu.support")}
                  </a>
                </span>
              </p>
              <hr className="h-1 bg-dark-graphite text-transparent" />
              {!user?.isAuthenticated || user?.isGuest ? (
                <p
                  className="cursor-pointer px-5 py-3 text-main-accent"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  Войти
                </p>
              ) : (
                <p
                  className="cursor-pointer px-5 py-3 text-red-700"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  {t("mainMenu.exit")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
