module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    styled: true,
    themes: [
      {
        solana: {
          primary: "#6366f1",
          "primary-focus": "#4f46e5",
          "primary-content": "#ffffff",

          secondary: "#10b981",
          "secondary-focus": "#059669",
          "secondary-content": "#ffffff",

          accent: "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",

          neutral: "#1f2937",
          "neutral-focus": "#111827",
          "neutral-content": "#ffffff",

          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-400": "#d1d5db",
          "base-content": "#1f2937",

          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
