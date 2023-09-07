import express from "express";
import timeout from "connect-timeout";
import helmet from "helmet";
import compression from "compression";
import responseTime from "response-time";
import { fileURLToPath } from "url";
import { dirname } from "path";

import path from "path";
import { log } from "console-log-colors";

import lucid, { sendEmail, submitForm } from "@lucid/core";
import { ContactForm } from "./forms/index.js";

const app = express();

app.use(compression());
app.use(responseTime());
app.use(timeout("10s"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const publicPath = path.join(
  dirname(fileURLToPath(import.meta.url)),
  "../public"
);

lucid.init({
  express: app,
  public: publicPath,
});

// create new route /test
app.get("/test", async (req, res, next) => {
  try {
    const data = {
      name: "John Doe",
      email: "wyallop14@gmail.com",
      message: "Hello world!",
    };

    // validate data with form builder
    const { valid, errors } = await ContactForm.validate(data);

    if (!valid) {
      return res.json({ errors });
    }

    // save form data & send email
    const submission = await submitForm({
      environment_key: "site_prod",
      form: ContactForm,
      data,
    });
    sendEmail("contact-form", {
      data: data,
      options: {
        to: "",
        subject: "New contact form submission",
      },
    });

    res.json({ submission });
  } catch (error) {
    next(error as Error);
  }
});

app.listen(process.env.PORT || 8393, () => {
  log.white("----------------------------------------------------");
  log.yellow(`CMS started at: http://localhost:8393`);
  log.yellow(`API started at: http://localhost:8393/api`);
  log.white("----------------------------------------------------");
});
