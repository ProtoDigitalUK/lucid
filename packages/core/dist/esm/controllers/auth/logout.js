import buildResponse from "../../utils/app/build-response.js";
import authSchema from "../../schemas/auth.js";
import authService from "../../services/auth/index.js";
const logout = async (req, res, next) => {
    try {
        authService.jwt.clearJWT(res);
        authService.csrf.clearCSRFToken(res);
        res.status(200).json(buildResponse(req, {
            data: {
                message: "Logged out successfully",
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: authSchema.logout,
    controller: logout,
};
//# sourceMappingURL=logout.js.map