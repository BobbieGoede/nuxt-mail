import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: ["pathe", "pkg-types", "mlly", "confbox", "acorn", "ufo", "webpack"],
});
