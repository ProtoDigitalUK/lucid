import fs from "fs-extra";
import { join } from "path";

const directoriesToCopy = [
  {
    dir: "src/assets",
    dest: "assets",
  },
  {
    dir: "src/db/migrations",
    dest: "migrations",
  },
];

const copyStatic = () => {
  directoriesToCopy.forEach((item) => {
    const source = join(process.cwd(), item.dir);
    const dest = join(process.cwd(), "dist", item.dest);
    fs.copySync(source, dest);
  });
};

copyStatic();
