import fs from "fs-extra";
import { join } from "path";

const directoriesToCopy = [
  {
    dir: "src/assets",
    dest: "assets",
  },
  {
    dir: "src/db/migrations",
    dest: "db/migrations",
  },
];

const copyStatic = () => {
  directoriesToCopy.forEach((item) => {
    const source = join(process.cwd(), item.dir);
    const destinationEsm = join(process.cwd(), "dist", "esm", item.dest);
    const destinationCjs = join(process.cwd(), "dist", "cjs", item.dest);
    fs.copySync(source, destinationEsm);
    fs.copySync(source, destinationCjs);
  });
};

copyStatic();
