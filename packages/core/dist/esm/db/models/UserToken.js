export default class UserToken {
    static createSingle = async (client, data) => {
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
    static getByToken = async (client, data) => {
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
    static deleteSingle = async (client, data) => {
        const userToken = await client.query({
            text: `
            DELETE FROM lucid_user_tokens
            WHERE id = $1
        `,
            values: [data.id],
        });
        return userToken.rows[0];
    };
    static removeExpiredTokens = async (client) => {
        const userToken = await client.query({
            text: `
            DELETE FROM lucid_user_tokens
            WHERE expiry_date < NOW()
        `,
        });
        return userToken.rows;
    };
}
//# sourceMappingURL=UserToken.js.map