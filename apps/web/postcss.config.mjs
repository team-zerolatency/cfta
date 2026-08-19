import path from "path";

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: path.resolve(process.cwd(), "../../"),
    },
  },
};

export default config;