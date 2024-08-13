const { nextui } = require("@nextui-org/react");

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
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        10: "0.625rem",
        12: "0.75rem",
        14: "0.875rem",
        16: "1rem",
        18: "1.125rem",
        20: "1.25rem",
        24: "1.5rem",
        28: "1.75rem",
        32: "2rem",
        36: "2.25rem",
        40: "2.5rem",
        44: "2.75rem",
        48: "3rem",
        60: "3.75rem",
      },
      opacity: {
        8: "0.08",
      },
      colors: {
        aqua: "#34DFE8",
        divider: "#191D26",
        gray: {
          0: "#FFFFFF",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#3E4A5C",
          800: "#273345",
          900: "#181B24",
          950: "#12131A",
          1000: "#000103",
        },
        primary: {
          50: "#EEFCFD",
          100: "#D5F5F8",
          200: "#AFEBF2",
          300: "#64D5E4",
          400: "#3AC1D6",
          500: "#1FA5BB",
          600: "#1C859E",
          700: "#1E6B80",
          800: "#20586A",
          900: "#1F4A5A",
          950: "#0F303D",
        },
        secondary: {
          50: "#FFF8ED",
          100: "#FFF0D4",
          200: "#FFDDA8",
          300: "#FFC47",
          400: "#FF9F37",
          500: "#FF8C21",
          600: "#F06706",
          700: "#C74D07",
          800: "#9E3C0E",
          900: "#7F340F",
          950: "#451805",
        },
        success: {
          50: "#D9FFDC",
          100: "#D9FFDC",
          200: "#B5FDBB",
          300: "#7BFA87",
          400: "#4FEF5F",
          500: "#11D626",
          600: "#08B119",
          700: "#0A8B18",
          800: "#0E6D19",
          900: "#0E5918",
          950: "#013208",
        },
        error: {
          50: "#FFF1F1",
          100: "#FFE0E0",
          200: "#FFC6C6",
          300: "#FF9E9E",
          400: "#FF6666",
          500: "#FD4040",
          600: "#EB1717",
          700: "#C60F0F",
          800: "#A3111",
          900: "#871515",
          950: "#4A0505",
        },
        // branding: {
        //   green: {
        //     50: "#F5FDF1",
        //     100: "#E1F8D3",
        //     200: "#D3F4BD",
        //     300: "#BFF09F",
        //     400: "#B2ED8D",
        //     500: "#9FE870",
        //     600: "#91D366",
        //     700: "#49732F",
        //     800: "#385B22",
        //     900: "#324C21",
        //   },
        // },
        // universal: {
        //   base: {
        //     0: "#FFFFFF",
        //     900: "#121511",
        //     950: "#000000",
        //   },
        //   charcoal: {
        //     50: "#FBFBFB",
        //     100: "#F7F7F7",
        //     200: "#EFEFEF",
        //     300: "#DFE0DE",
        //     400: "#C7C8C6",
        //     500: "#979995",
        //     600: "#686A66",
        //     700: "#49732F",
        //     750: "#31332E",
        //     800: "#232521",
        //     900: "#161715",
        //   },
        //   green: {
        //     50: "#ECFEEE",
        //     100: "#D3FDD7",
        //     200: "#A8FAAF",
        //     300: "#81F88B",
        //     400: "#63FA70",
        //     500: "#41F24F",
        //     600: "#39DD47",
        //     700: "#00AD26",
        //     800: "#00360C",
        //     900: "#10481C",
        //     950: "#001F07",
        //   },
        //   orange: {
        //     50: "#FFF8EB",
        //     100: "#FFF0D6",
        //     200: "#FFE1AD",
        //     300: "#FFD285",
        //     400: "#FFC35C",
        //     500: "#FFB536",
        //     600: "#F29900",
        //     700: "#B87500",
        //     800: "#7A4D00",
        //     900: "#3D2700",
        //     950: "#1F1400",
        //   },
        //   red: {
        //     50: "#FFEDEB",
        //     100: "#FFD6D1",
        //     200: "#FFACA3",
        //     300: "#FF8375",
        //     400: "#FF5947",
        //     500: "#F13621",
        //     600: "#E01600",
        //     700: "#A81100",
        //     800: "#700B00",
        //     900: "#380802",
        //     950: "#1F0300",
        //   },
        //   gray: {
        //     10: "#F8F9FD",
        //     20: "#F0F2FA",
        //     30: "#DEE1EB",
        //     40: "#CCD1E0",
        //     50: "#9DA3B5",
        //     60: "#777E90",
        //     70: "#616879",
        //     80: "#505665",
        //     90: "#2C3038",
        //     100: "#1B1E25",
        //     110: "#494949",
        //   },
        // },
        // graphic: {
        //   lime: {
        //     50: "#F2FAD7",
        //     100: "#E4F5B0",
        //     200: "#D7F088",
        //     300: "#D1ED74",
        //     400: "#CAEB60",
        //     500: "#C0E743",
        //     600: "#A3CE1A",
        //     700: "#90B51B",
        //     800: "#46580B",
        //     900: "#171D04",
        //   },
        // },
      },
      boxShadow: {
        1: "0px 0px 10.286px 0px rgba(255, 255, 255, 0.85) inset, 0px 2px 1px 0px rgba(255, 255, 255, 0.64) inset",
        2: "0px 0px 24px 0px rgba(52, 232, 158, 0.16)",
        3: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        4: "0px 0px 10.286px 0px rgba(255, 255, 255, 0.85) inset, 0px 2px 1px 0px rgba(255, 255, 255, 0.64) inset",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#64D5E4",
          },
        },
        dark: {
          colors: {
            primary: "#64D5E4",
          },
        },
      },
    }),
  ],
};
