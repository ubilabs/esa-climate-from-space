import postcssCustomMedia from "postcss-custom-media";
import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    // postcssGlobalData is used to define postcss custom media variables once in variables.module.css
    // and use them in all other files without re-declaring or manually importing them
    postcssGlobalData({ files: ["./src/variables.css"] }),
    postcssCustomMedia,
    autoprefixer,
    cssnano({ preset: "default" }),
  ],
};
