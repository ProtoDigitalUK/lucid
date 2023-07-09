"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_single_1 = __importDefault(require("./delete-single"));
const get_multiple_1 = __importDefault(require("./get-multiple"));
const get_single_1 = __importDefault(require("./get-single"));
const resend_single_1 = __importDefault(require("./resend-single"));
exports.default = {
    deleteSingle: delete_single_1.default,
    getMultiple: get_multiple_1.default,
    getSingle: get_single_1.default,
    resendSingle: resend_single_1.default,
};
//# sourceMappingURL=index.js.map