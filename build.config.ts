import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: ["pathe", "pkg-types", "mlly", "ufo", "ofetch"],
});
