import express from "express";
import { log } from "console-log-colors";
import lucid from "@lucid/core";
import path from "path";

const app = express();

lucid.init({
  express: app,
  public: path.join(__dirname, "../public"),
});

// create new route /test
app.get("/send-email-custom", async (req, res) => {
  // const send = await lucid.sendEmail("test", {
  //   data: {
  //     name: "William",
  //   },
  //   options: {
  //     to: "hello@williamyallop.com",
  //     subject: "Test email",
  //   },
  // });
  // res.send(send);
});

app.listen(process.env.PORT || 8393, () => {
  log.white("----------------------------------------------------");
  log.yellow(`CMS started at: http://localhost:8393`);
  log.yellow(`API started at: http://localhost:8393/api`);
  log.white("----------------------------------------------------");
});
