import Email from "../../db/models/Email.js";
import { LucidError } from "../../utils/app/error-handler.js";
import emailsService from "../email/index.js";
const getSingle = async (client, data) => {
    const email = await Email.getSingle(client, {
        id: data.id,
    });
    if (!email) {
        throw new LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
    const html = await emailsService.renderTemplate(email.template, email.data || {});
    email.html = html;
    return email;
};
export default getSingle;
//# sourceMappingURL=get-single.js.map