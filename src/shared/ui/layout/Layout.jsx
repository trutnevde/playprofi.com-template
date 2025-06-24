import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ErrorBoundary from "../../../pages/error-page/ErrorPage.jsx";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import {
  SearchStatus,
  Rank,
  Timer1,
  Grid5,
  // TrendUp,
  // Add,
  // Setting2,
  // People,
  // Barcode,
  SliderHorizontal,
} from "iconsax-react";
import useTokens from "../../context/useTokens";

const Layout = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.layout",
  });

  const { tokens } = useTokens();

  const menuSections = useMemo(
    () => [
      {
        title: t("instruments"),
        items: [
          {
            name: t("menu.trends"),
            // name: "Поиск Идеи",
            icon: Rank,
            // subtext: "more info",
            link: "#",
          },
          {
            name: t("menu.analyzer"),
            // name: "Анализ Идеи",
            icon: SearchStatus,
            // subtext: "Card",
            link: "#",
          },
          {
            name: t("menu.preview"),
            icon: Grid5,
            // subtext: "Card",
            link: "#",
          },
          {
            name: t("menu.preview-generator"),
            icon: Grid5,
            // subtext: "Card",
            link: "/app/preview-generator",
          },
          {
            name: t("menu.voiceover.title"),
            icon: Grid5,
            // subtext: t("menu.scenario.subtext"),
            link: "#",
          },
          {
            name: t("menu.timestamps"),
            icon: Timer1,
            link: "#",
          },
        ],
      },
      {
        title: t("menu.scenario.subtext"),
        items: [
          {
            name: t("menu.scenario.title"),
            icon: SliderHorizontal,
            subtext: t("menu.scenario.subtext"),
            link: "#",
          },
          {
            name: t("menu.editvideo.title"),
            icon: Grid5,
            subtext: t("menu.scenario.subtext"),
            link: "#",
          },
        ],
      },
      // {
      //   title: "Management",
      //   items: [
      //     { name: "Blog", icon: Barcode, subtext: "hot news", link: "/app/blog" },
      //     { name: "Analytics", icon: TrendUp, subtext: "more info", link: "/app/analytics" },
      //   ],
      // },
    ],
    [t],
  );

  return (
    <div className="flex h-screen bg-[#0F0F0F]">
      {/* Sidebar занимает фиксированную ширину */}
      <Sidebar t={t} menuSections={menuSections} data={[]} />
      <main className="flex flex-1 flex-col">
        {/* Шапка с фиксированной высотой */}
        <div className="h-[80px]">
          <Topbar t={t} menuSections={menuSections} tokens={tokens} />
        </div>
        {/* Контент занимает оставшуюся высоту */}
        <div className="h-full overflow-auto px-10">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default memo(Layout);
