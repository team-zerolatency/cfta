import path from "path";
import process from "node:process";

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: path.resolve(process.cwd(), "../../"),
    },
  },
};

export default config;