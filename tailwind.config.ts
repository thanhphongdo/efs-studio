import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        merienda: ["Merienda", "sans-serif"],
      },
    },
  },
  plugins: [],
  prefix: "tw-",
  safelist: [
    "!tw-flex",
    "!tw-justify-center",
    "!tw-items-center",
    "!tw-text-left",
    "!tw-text-right",
    "!tw-text-center",
    "!tw-text-justify",
    "!tw-italic",
    { pattern: /^\-?!tw-m(\w?)-/ },
    { pattern: /^!tw-p(\w?)-/ },
    { pattern: /^!tw-text-/ },
    {
      pattern:
        /^!?tw-text-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern:
        /^!?tw-bg-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern:
        /^!?tw-bg-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)\/(10|20|30|40|50|60|70|80|90)$/,
    },
  ],
};
export default config;
