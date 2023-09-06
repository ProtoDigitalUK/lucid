import constants from "../constants.js";
const paginated = async (req, res, next) => {
    try {
        if (!req.query.page) {
            req.query.page = constants.pagination.page;
        }
        if (!req.query.per_page) {
            req.query.per_page = constants.pagination.perPage;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
export default paginated;
//# sourceMappingURL=paginated.js.map