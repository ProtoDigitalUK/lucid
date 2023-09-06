import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import authSchema from "../../schemas/auth.js";
import authService from "../../services/auth/index.js";
const loginController = async (req, res, next) => {
    try {
        const user = await service(authService.login, false)({
            username: req.body.username,
            password: req.body.password,
        });
        authService.jwt.generateJWT(res, user);
        res.status(200).json(buildResponse(req, { data: user }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: authSchema.login,
    controller: loginController,
};
//# sourceMappingURL=login.js.map