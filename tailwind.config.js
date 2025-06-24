/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {},
    screens: {
      "2xl": "1441px",
      xl: "1280px",
      md: "1024px",
    },
    extend: {
      boxShadow: {
        "lg-trend-card":
          "0px 0px 100px 100px rgba(0,0,0,0.4) inset, 15px 15px 80px rgb(255, 255, 255)",
        "outer-rounded":
          "10px 10px 60px rgba(0, 0, 0, 0.5),0px 0px 20px 1px rgba(0,0,0,0.2) inset",
        "lg-volume-yotube-card": "20px 20px 0px 10px rgba(0, 123, 117,0.5)",
        "lg-volume-youtube-logo": "5px 5px 0px 3px rgba(0, 123, 117,0.5)",
        "lg-volume-user-card": "-10px 10px 0px 5px rgba(0, 123, 117,0.5)",
        "lg-volume-link-card": "8px 8px 0px 3px rgba(0, 123, 117,0.5)",
        "lg-volume-playProfi-logo": "-8px 5px 0px 0px rgba(0, 123, 117,0.5)",
        "lg-professional-prices":
          "0px 0px 15px 3px rgba(0, 123, 117,1), 0px 0px 15px 3px rgba(0, 123, 117,1) inset",
        "lg-achievment-section":
          "150px 0px 40px rgb(15, 15, 15) inset, -150px 0px 40px rgb(15, 15, 15) inset, 0px 1px 90px 90px rgb(15, 15, 15)",
        "lg-indicators":
          "inset 0 30px 15px rgba(15, 15, 15, 1), inset 0 -30px 15px rgba(15, 15, 15, 1)",
        "lg-hover-card": "0px 16px 12px 0 rgba(12, 12, 12, 1)",
      },
      fontFamily: {
        "circe-regular": "Circe Regular",
        "circe-light": "Circe Light",
        "roboto-regular": "Roboto Regular",
      },
      backgroundImage: {
        welcome: "url('/src/shared/assets/image/welcome-bg.png')",
        tools: "url('/src/shared/assets/image/tools-bg.png')",
        indicators: "url('/src/shared/assets/image/indicators-add-gif.png')",
        stars: "url('/src/shared/assets/image/stars.png')",
        train: "url('/src/shared/assets/image/train.jpg')",
        timestamps: "url('/src/shared/assets/image/timestamps-bg.png')",
        script: "url('/src/shared/assets/image/script-bg.png')",
        integration: "url('/src/shared/assets/image/integration-bg.png')",
        "try-free": "url('/src/shared/assets/image/try-free.png')",
        footer: "url('/src/shared/assets/image/footer-bg.png')",
        login: "url('/src/shared/assets/image/login-bg.png')",
        "home-card-1": "url('/src/shared/assets/image/home-card-bg-1.png')",
        "home-card-2": "url('/src/shared/assets/image/bg-card-2.png')",
        "mobile-plug-bg": "url('/src/shared/assets/image/mobile-plug-bg.png')",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
      colors: {
        "main-dark": "rgb(15, 15, 15)",
        "main-accent": "rgb(41, 228, 222)",
        "main-white": "rgb(255, 255, 255)",
        gradient:
          "linear-gradient(90deg, rgba(255,255,255,1) 50%, rgba(43,217,211,1) 100%)",
        supporting: "rgb(135, 135, 135)",
        lights: "rgb(0, 123, 117, 0.3)",
        bgLights: "rgb(190, 255, 252)",
        gray: "rgb(135, 135, 135)",
        "dark-graphite": "rgb(27, 27, 27)",
        "dark-coal": "rgb(20, 20, 20)",
        "dark-supporting": "rgb(33 33 33)",
        "dark-overlay": "rgba(15, 15, 15, 0.6 )",
        "interactive-hover": "rgba(43, 43, 43, 1)",
      },
      keyframes: {
        levitation: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "pan-gradient": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
      animation: {
        "levitation-normal": "levitation 3s ease-in-out infinite",
        "pan-gradient": "pan-gradient 1s ease infinite",
      },
      spacing: {
        240: "240px",
      },
      perspective: {
        none: "none",
        500: "500px",
        1000: "1000px",
        2000: "2000px",
      },
      transformStyle: {
        flat: "flat",
        preserve: "preserve-3d",
      },
      brightness: {
        20: "0.2",
        30: "0.3",
        40: "0.4",
      },
    },
  },
  plugins: [
    aspectRatio,
    plugin(function ({ theme, addComponents }) {
      addComponents({
        ".generationCard": {
          width: "482px",
          background: `linear-gradient(to bottom right, transparent  42%, ${theme("colors.lights")})`,
          "> div": {
            width: "480px",
          },
        },
        ".trendsCard": {
          width: "692px",
          background: `linear-gradient(to left, transparent  50%, ${theme("colors.lights")})`,
          "> div": {
            width: "690px",
          },
        },
        ".integrationCard": {
          width: "602px",
          background: `linear-gradient(to top right, transparent  40%, ${theme("colors.lights")})`,
          "> div": {
            width: "600px",
          },
        },
        ".professionalCard": {
          width: "572px",
          background: `linear-gradient(to top left, transparent  70%, ${theme("colors.lights")})`,
          "> div": {
            width: "570px",
          },
        },
        ".yotubeCard": {
          background: `linear-gradient(to top left, transparent  20%, ${theme("colors.main-accent")})`,
        },
        ".yotubeLogo": {
          background: `linear-gradient(to top right, transparent  50%, ${theme("colors.main-accent")})`,
        },
        ".userIntegrationCard": {
          background: `linear-gradient(to right, transparent  20%, ${theme("colors.main-accent")})`,
        },
        ".linkIcon": {
          background: `linear-gradient(to right bottom, transparent  50%, rgba(0, 123, 117, 0.2))`,
        },
        ".playProfiIcon": {
          background: `linear-gradient(to left bottom, transparent  50%, rgba(0, 123, 117, 0.2))`,
        },
        ".landingTitle": {
          fontSize: "80px",
          color: theme("colors.main-white"),
          textAlign: "center",
        },
        ".sidebar": {
          background: `linear-gradient(230deg , rgba(26, 25, 25, 1), rgba(15, 15, 15, 1), rgba(15, 15, 15, 1), rgba(15, 15, 15, 1))`,
        },
      });
    }),
    plugin(function ({ addUtilities, theme }) {
      const perspectiveValues = theme("perspective");
      const transformStyleValues = theme("transformStyle");

      const newUtilities = {};

      // Генерация классов .perspective-<key> { perspective: value; }
      for (const key in perspectiveValues) {
        newUtilities[`.perspective-${key}`] = {
          perspective: perspectiveValues[key],
        };
      }

      // Генерация классов .transform-style-<key> { transform-style: value; }
      for (const key in transformStyleValues) {
        newUtilities[`.transform-style-${key}`] = {
          transformStyle: transformStyleValues[key],
        };
      }

      addUtilities(newUtilities, ["responsive"]);
    }),
  ],
};
