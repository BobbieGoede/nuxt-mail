import { promises as fsp } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "pathe";

async function main() {
  const commit = execSync("git rev-parse --short HEAD").toString("utf-8").trim();
  const date = Math.round(Date.now() / (1000 * 60));

  const pkgPath = resolve(process.cwd(), "package.json");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pkg = JSON.parse(await fsp.readFile(pkgPath, "utf-8").catch(() => "{}"));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  pkg.version = `${pkg.version}-${date}.${commit}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  pkg.name = pkg.name + "-nightly";
  await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
