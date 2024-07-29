const { nextui } = require("@nextui-org/react")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
      fontFamily: {
        "sf-pro-display": ["SF Pro Display", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        12: [
          "0.75rem",
          {
            lineHeight: "130%",
          },
        ],
        14: [
          "0.875rem",
          {
            lineHeight: "130%",
          },
        ],
        16: [
          "1rem",
          {
            lineHeight: "130%",
          },
        ],
        18: [
          "1.125rem",
          {
            lineHeight: "130%",
          },
        ],
        20: [
          "1.25rem",
          {
            lineHeight: "130%",
          },
        ],
        24: [
          "1.5rem",
          {
            lineHeight: "130%",
          },
        ],
        28: [
          "1.75rem",
          {
            lineHeight: "130%",
          },
        ],
        32: [
          "2rem",
          {
            lineHeight: "130%",
          },
        ],
        44: [
          "2.75rem",
          {
            lineHeight: "130%",
          },
        ],
        48: [
          "3rem",
          {
            lineHeight: "130%",
          },
        ],
      },
      fontWeight: {
        600: 600,
      },
      opacity: {
        8: "0.08",
      },
      colors: {
        primary: {
          green: "#57803E",
        },
        gray: {
          neutral: "#7B7B7B",
          10: "#F8F9FD",
          20: "#F0F2FA",
          30: "#DEE1EB",
          40: "#CCD1E0",
          50: "#9DA3B5",
          60: "#777E90",
          70: "#616879",
          80: "#505665",
          90: "#2C3038",
          100: "#1B1E25",
          767: "#767676",
          "dark-charcoal": "#2C2D2F",
          "dark-slate": "#3A3A3A",
          "light-blue": "#F2F4F7",
          pale: "#F4F4F4",
          "pale-blue": "#E4E7EC",
        },
        green: {
          "448D14": "#448D14",
        },
        "light-blue": {
          10: "#DAFBF9",
          20: "#BEF5F2",
          40: "#5EC2D4",
          80: "#0285A3",
          90: "#25CCF5",
          "90-0": "#0A8DB7",
          "90-1": "#006A82",
        },
        neutral: {
          surface: "#F5F5F7",
          "body-dark": "#909298",
          "body-light": "#6A6B71",
          action: "#312E33",
          "border-dark": "#494949",
        },
        highlight: {
          title: "#43612F",
        },

        //new name color
        branding: {
          green: {
            50: "#F5FDF1",
            100: "#E1F8D3",
            200: "#D3F4BD",
            300: "#BFF09F",
            400: "#B2ED8D",
            500: "#9FE870",
            600: "#91D366",
            700: "#49732F",
            800: "#385B22",
            900: "#324C21",
          },
        },
        universal: {
          base: {
            0: "#FFFFFF",
            900: "#121511",
            950: "#000000",
          },
          charcoal: {
            50: "#FBFBFB",
            100: "#F7F7F7",
            200: "#EFEFEF",
            300: "#DFE0DE",
            400: "#C7C8C6",
            500: "#979995",
            600: "#686A66",
            700: "#49732F",
            750: "#31332E",
            800: "#232521",
            900: "#161715",
          },
          green: {
            50: "#ECFEEE",
            100: "#D3FDD7",
            200: "#A8FAAF",
            300: "#81F88B",
            400: "#63FA70",
            500: "#41F24F",
            600: "#39DD47",
            700: "#00AD26",
            800: "#00360C",
            900: "#10481C",
            950: "#001F07",
          },
          orange: {
            50: "#FFF8EB",
            100: "#FFF0D6",
            200: "#FFE1AD",
            300: "#FFD285",
            400: "#FFC35C",
            500: "#FFB536",
            600: "#F29900",
            700: "#B87500",
            800: "#7A4D00",
            900: "#3D2700",
            950: "#1F1400",
          },
          red: {
            50: "#FFEDEB",
            100: "#FFD6D1",
            200: "#FFACA3",
            300: "#FF8375",
            400: "#FF5947",
            500: "#F13621",
            600: "#E01600",
            700: "#A81100",
            800: "#700B00",
            900: "#380802",
            950: "#1F0300",
          },
          gray: {
            10: "#F8F9FD",
            20: "#F0F2FA",
            30: "#DEE1EB",
            40: "#CCD1E0",
            50: "#9DA3B5",
            60: "#777E90",
            70: "#616879",
            80: "#505665",
            90: "#2C3038",
            100: "#1B1E25",
            110: "#494949",
          },
        },
        graphic: {
          lime: {
            50: "#F2FAD7",
            100: "#E4F5B0",
            200: "#D7F088",
            300: "#D1ED74",
            400: "#CAEB60",
            500: "#C0E743",
            600: "#A3CE1A",
            700: "#90B51B",
            800: "#46580B",
            900: "#171D04",
          },
        },
      },
      boxShadow: {
        1: "0px 18px 60px 0px rgba(7, 12, 52, 0.15)",
        2: "0px 0px 0px 0px rgba(95, 104, 123, 0.10), 0px 5px 10px 0px rgba(95, 104, 123, 0.09), 0px 19px 19px 0px rgba(95, 104, 123, 0.08), 0px 42px 25px 0px rgba(95, 104, 123, 0.05), 0px 74px 30px 0px rgba(95, 104, 123, 0.01), 0px 116px 32px 0px rgba(95, 104, 123, 0.00)",
        3: "0px 5px 11px 0px rgba(95, 104, 123, 0.12)",
        4: "0px 2px 4px 0px rgba(24, 24, 25, 0.02), 0px 40px 80px -16px rgba(24, 24, 25, 0.12)",
        5: "0px 39px 50px 0px rgba(123, 108, 95, 0.15)",
        6: "0px 24px 40px -8px rgba(24, 24, 25, 0.08)",
        7: "0px 40px 80px -16px rgba(24, 24, 25, 0.12), 0px 2px 4px 0px rgba(24, 24, 25, 0.02)",
        8: "0px 8px 20px 0px rgba(95, 106, 109, 0.12)",
      },
      animation: {
        "fade-text": "fadeOut 5s linear infinite",
        "fade-border": "fadeOutBorder 5s infinite",
        "dark-fade-text": "darkFadeOut 5s infinite",
        "dark-fade-border": "darkFadeOutBorder 5s infinite",
        "arrow-bounce": "arrowBounce 1s infinite",
        "infinite-custom": "marquee 25s linear infinite",
        wiggle: "wiggle 200ms ease-in-out",
      },
      keyframes: {
        fadeOut: {
          "0%": { color: "#43612F" },
          "80%": { color: "#354F23" },
          "100%": { color: "#17290C" },
        },
        marquee: {
          "0%": {
            transform: "translateX(0px)",
          },
          "100%": {
            transform: "translateX(-30%)",
          },
        },
        fadeOutBorder: {
          "0%": { "border-color": "#91D366" },
          "80%": { "border-color": "#579033" },
          "100%": { "border-color": "#17290C" },
        },
        darkFadeOut: {
          "0%": { color: "#B2ED8D" },
          "80%": { color: "#d6f2c4" },
          "100%": { color: "#e4f2da" },
        },
        darkFadeOutBorder: {
          "0%": { "border-color": "#91D366" },
          "80%": { "border-color": "#b1d998" },
          "100%": { "border-color": "#e4f2da" },
        },
        arrowBounce: {
          "0%": {
            transform: "translateX(0px)",
          },
          "50%": {
            transform: "translateX(0px)",
          },
          "60%": {
            transform: "translateX(0px)",
            "animation-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "80%": {
            transform: "translateX(-5px)",
            "animation-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },

        wiggle: {
          "0%, 100%": "all 0.4s cubic-bezier(0.42, 0, 0.58, 1)",
        },
      },
      backgroundImage: {
        "gradient-green":
          "linear-gradient(165deg, #F4FFED -0.73%, #BBE0A5 84.6%)",
        "gradient-green-dark":
          "linear-gradient(165deg, #F4FFED -0.73%, #1B2614 -0.72%, #0E1D05 84.6%)",
        "gradient-gold":
          "linear-gradient(89deg, #FFF732 0.91%, rgba(255, 234, 46, 0.00) 97.69%)",
        "gradient-silver":
          "linear-gradient(90deg, #F3F3F3 -46.37%, rgba(168, 167, 161, 0.00) 91.5%)",
        "gradient-bronze":
          "linear-gradient(90deg, #E6DCC2 -19.77%, rgba(255, 234, 46, 0.00) 91.29%)",
        "gradient-blue":
          "linear-gradient(110deg, rgba(159, 232, 112, 0.40) 12.43%, rgba(0, 174, 239, 0.40) 80.11%)",
        "gradient-ai": "linear-gradient(92deg, #7EFF2B 6.64%, #46E5C9 97.35%)",
        "gradient-gray":
          "linear-gradient(171deg, #F9F9F9 24.3%, #D8D8D8 106.17%)",
        "gradient-green-forest-shadow":
          "linear-gradient(168deg, #2D332F 8.41%, #273628 102.97%)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            success: "#9FE870",
            secondary: "#90B51B",
          },
        },
        dark: {
          colors: {
            success: "#9FE870",
            secondary: "#90B51B",
          },
        },
      },
    }),
  ],
}
