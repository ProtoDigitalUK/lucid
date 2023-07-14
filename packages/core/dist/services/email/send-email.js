"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailInternal = exports.sendEmailExternal = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Config_1 = __importDefault(require("../Config"));
const email_1 = __importDefault(require("../email"));
const createEmailRow = async (data) => {
    await email_1.default.createSingle({
        from_address: data.options.from,
        from_name: data.options.fromName,
        to_address: data.options.to,
        subject: data.options.subject,
        cc: data.options.cc,
        bcc: data.options.bcc,
        template: data.template,
        data: data.data,
        delivery_status: data.delivery_status,
    });
};
const sendEmailAction = async (template, params) => {
    let fromName = params.options?.fromName || Config_1.default.email?.from?.name;
    let from = params.options?.from || Config_1.default.email?.from?.email;
    const mailOptions = {
        from: from,
        fromName: fromName,
        to: params.options?.to,
        subject: params.options?.subject,
        cc: params.options?.cc,
        bcc: params.options?.bcc,
        replyTo: params.options?.replyTo,
    };
    try {
        const html = await email_1.default.renderTemplate(template, params.data);
        const smptConfig = Config_1.default.email?.smtp;
        if (!smptConfig) {
            throw new Error("SMTP config not found. The email has been stored in the database and can be sent manually.");
        }
        const transporter = nodemailer_1.default.createTransport({
            host: smptConfig.host,
            port: smptConfig.port,
            secure: smptConfig.secure,
            auth: {
                user: smptConfig.user,
                pass: smptConfig.pass,
            },
        });
        await transporter.sendMail({
            from: `${fromName} <${from}>`,
            to: mailOptions.to,
            subject: mailOptions.subject,
            cc: mailOptions.cc,
            bcc: mailOptions.bcc,
            replyTo: mailOptions.replyTo,
            html: html,
        });
        return {
            success: true,
            message: "Email sent successfully.",
            options: mailOptions,
        };
    }
    catch (error) {
        const err = error;
        return {
            success: false,
            message: err.message || "Failed to send email.",
            options: mailOptions,
        };
    }
};
const sendEmailExternal = async (template, params) => {
    const result = await sendEmailAction(template, params);
    await createEmailRow({
        template: template,
        options: result.options,
        delivery_status: result.success ? "sent" : "failed",
        data: params.data,
    });
    return {
        success: result.success,
        message: result.message,
    };
};
exports.sendEmailExternal = sendEmailExternal;
const sendEmailInternal = async (template, params, id, track) => {
    const result = await sendEmailAction(template, params);
    if (track) {
        if (!id) {
            await createEmailRow({
                template: template,
                options: result.options,
                delivery_status: result.success ? "sent" : "failed",
                data: params.data,
            });
        }
        else {
            await email_1.default.updateSingle({
                id: id,
                data: {
                    from_address: result.options.from,
                    from_name: result.options.fromName,
                    delivery_status: result.success ? "sent" : "failed",
                },
            });
        }
    }
    return {
        success: result.success,
        message: result.message,
    };
};
exports.sendEmailInternal = sendEmailInternal;
//# sourceMappingURL=send-email.js.map