import { LucidError } from "../utils/app/error-handler.js";
import authService from "../services/auth/index.js";
const authenticate = async (req, res, next) => {
    try {
        const authenticateJWT = authService.jwt.verifyJWT(req);
        if (!authenticateJWT.sucess || !authenticateJWT.data) {
            throw new LucidError({
                type: "authorisation",
                message: "You are not authorised to perform this action",
            });
        }
        req.auth = authenticateJWT.data;
        return next();
    }
    catch (error) {
        return next(error);
    }
};
export default authenticate;
//# sourceMappingURL=authenticate.js.map