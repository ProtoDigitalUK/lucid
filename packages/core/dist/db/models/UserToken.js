"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class UserToken {
}
_a = UserToken;
UserToken.createSingle = async (data) => {
    const client = await db_1.default;
    const userToken = await client.query({
        text: `
            INSERT INTO lucid_user_tokens (
                user_id,
                token_type,
                token,
                expiry_date
            ) VALUES (
                $1,
                $2,
                $3,
                $4
            ) RETURNING *
        `,
        values: [data.user_id, data.token_type, data.token, data.expiry_date],
    });
    return userToken.rows[0];
};
UserToken.getByToken = async (data) => {
    const client = await db_1.default;
    const userToken = await client.query({
        text: `
            SELECT * FROM lucid_user_tokens
            WHERE token = $1
            AND token_type = $2
            AND expiry_date > NOW()
        `,
        values: [data.token, data.token_type],
    });
    return userToken.rows[0];
};
UserToken.deleteSingle = async (data) => {
    const client = await db_1.default;
    const userToken = await client.query({
        text: `
            DELETE FROM lucid_user_tokens
            WHERE id = $1
        `,
        values: [data.id],
    });
    return userToken.rows[0];
};
UserToken.removeExpiredTokens = async () => {
    const client = await db_1.default;
    const userToken = await client.query({
        text: `
            DELETE FROM lucid_user_tokens
            WHERE expiry_date < NOW()
        `,
    });
    return userToken.rows[0];
};
exports.default = UserToken;
//# sourceMappingURL=UserToken.js.map