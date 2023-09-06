import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import emailsSchema from "../../schemas/email.js";
import emailsService from "../../services/email/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const email = await service(emailsService.getSingle, false)({
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
    schema: emailsSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map