import Fastify from "fastify";
import { log } from "console-log-colors";

import lucid, { sendEmail, submitForm } from "@lucid/core";
import { ContactForm } from "./forms/index.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(lucid);

fastify.post("/send-email", async (request, reply) => {
  try {
    const data = {
      name: "John Doe",
      email: "wyallop14@gmail.com",
      message: "Hello world!",
    };

    // validate data with form builder
    const { valid, errors } = await ContactForm.validate(data);

    if (!valid) {
      return reply.status(400).send({ errors });
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

    reply.send({ emailRes });
  } catch (error) {
    reply.status(500).send({ error });
  }
});

await fastify.listen({
  port: Number(process.env.PORT) || 8393,
  host: "0.0.0.0",
});

log.white("----------------------------------------------------");
log.yellow(`CMS started at: http://localhost:8393`);
log.yellow(`API started at: http://localhost:8393/api`);
log.white("----------------------------------------------------");
