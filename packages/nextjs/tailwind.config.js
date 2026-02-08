/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  // 1. Force Dark Mode
  darkMode: 'class', 
  
  // 2. Define the visual system
  theme: {
    extend: {
      colors: {
        helix: {
          navy: "#07142B",      // Main Background
          dark: "#0F1724",      // Card Background
          teal: "#1FAE9F",      // Primary / Success
          gold: "#D8B44A",      // Warning / Value
          red: "#E63946",       // Error
          text: {
            main: "#E2E8F0",    // Primary Text
            dim: "#94A3B8",     // Secondary Text
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-spectral)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        glow: "0 0 15px rgba(31, 174, 159, 0.3)",
      }
    },
  },

  // 3. Configure DaisyUI to use our colors by default
  daisyui: {
    themes: [
      {
        helixTheme: {
          "primary": "#1FAE9F",
          "secondary": "#D8B44A",
          "accent": "#07142B",
          "neutral": "#0F1724",
          "base-100": "#07142B",
          "info": "#3ABFF8",
          "success": "#1FAE9F",
          "warning": "#D8B44A",
          "error": "#E63946",
        },
      },
    ],
  },
};