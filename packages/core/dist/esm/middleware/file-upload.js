import expressFileUpload from "express-fileupload";
import Config from "../services/Config.js";
const fileUpload = async (req, res, next) => {
    const options = {
        debug: Config.mode === "development",
    };
    expressFileUpload(options)(req, res, next);
};
export default fileUpload;
//# sourceMappingURL=file-upload.js.map