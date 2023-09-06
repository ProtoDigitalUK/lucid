import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import emailsSchema from "../../schemas/email.js";
import emailsService from "../../services/email/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const emailsRes = await service(emailsService.getMultiple, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: emailsRes.data,
            pagination: {
                count: emailsRes.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: emailsSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map