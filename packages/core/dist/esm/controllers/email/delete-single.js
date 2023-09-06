import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import emailsSchema from "../../schemas/email.js";
import emailsService from "../../services/email/index.js";
const deleteSingleController = async (req, res, next) => {
    try {
        const email = await service(emailsService.deleteSingle, true)({
            id: parseInt(req.params.id),
        });
        res.status(200).json(buildResponse(req, {
            data: email,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: emailsSchema.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map