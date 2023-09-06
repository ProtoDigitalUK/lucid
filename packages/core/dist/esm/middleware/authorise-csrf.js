import { LucidError } from "../utils/app/error-handler.js";
import authService from "../services/auth/index.js";
const authoriseCSRF = async (req, res, next) => {
    try {
        const verifyCSRF = authService.csrf.verifyCSRFToken(req);
        if (!verifyCSRF) {
            throw new LucidError({
                type: "forbidden",
                code: "csrf",
                message: "You are not authorised to perform this action",
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
export default authoriseCSRF;
//# sourceMappingURL=authorise-csrf.js.map