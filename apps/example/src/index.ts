import express, { Router } from "express";
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
    contentSecurityPolicy: false,
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

const router = Router();

router.post("/send-email", async (req, res, next) => {
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
    // const submission = await submitForm({
    //   environment_key: "production",
    //   form: ContactForm,
    //   data,
    // });

    const emailRes = await sendEmail("contact-form", {
      data: data,
      options: {
        to: data.email,
        subject: "New contact form submission from your website",
      },
    });

    res.json(emailRes);
  } catch (error) {
    next(error as Error);
  }
});
app.use(router);

app.listen(process.env.PORT || 8393, () => {
  log.white("----------------------------------------------------");
  log.yellow(`CMS started at: http://localhost:8393`);
  log.yellow(`API started at: http://localhost:8393/api`);
  log.white("----------------------------------------------------");
});
