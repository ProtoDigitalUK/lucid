import express from "express";
import { log } from "console-log-colors";
import lucid from "./index";

const app = express();

lucid.init({
  express: app,
});

app.listen(8393, () => {
  log.white("----------------------------------------------------");
  log.yellow(`CMS started at: http://localhost:8393`);
  log.yellow(`API started at: http://localhost:8393/api`);
  log.white("----------------------------------------------------");
});
