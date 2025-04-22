import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          25: "#F5FBFF",
          50: "#F0F7FF",
          75: "#E6F2FF",
          100: "#C7E3FF",
          200: "#6CBCE8",
          300: "#3FA6E0",
          350: "#0F8DD0", // Cor principal (-10% saturação vs original)
          400: "#0580B9",
          500: "#0474AF", // Sua cor correta
          600: "#036491",
          700: "#014364",
          800: "#034167",
          850: "#021D42",
          900: "#011225",
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
