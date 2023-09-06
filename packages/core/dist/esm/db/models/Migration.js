export default class Migration {
    static all = async (client) => {
        try {
            const migrations = await client.query(`SELECT * FROM lucid_migrations`);
            return migrations.rows;
        }
        catch (err) {
            return [];
        }
    };
    static create = async (client, data) => {
        const { file, rawSql } = data;
        await client.query({
            text: rawSql,
        });
        await client.query({
            text: `INSERT INTO lucid_migrations (file) VALUES ($1)`,
            values: [file],
        });
    };
}
//# sourceMappingURL=Migration.js.map