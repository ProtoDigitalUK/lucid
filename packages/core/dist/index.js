var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/init.ts
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path6 from "path";
import cookieParser from "cookie-parser";
import { log } from "console-log-colors";

// src/db/db.ts
import pg from "pg";

// src/services/Config.ts
import fs from "fs-extra";
import path from "path";
import z from "zod";

// src/utils/app/error-handler.ts
import { red, bgRed } from "console-log-colors";
var DEFAULT_ERROR = {
  name: "Error",
  message: "Something went wrong",
  status: 500,
  code: null,
  errors: null
};
var LucidError = class extends Error {
  code = null;
  status;
  errors = null;
  constructor(data) {
    super(data.message || DEFAULT_ERROR.message);
    switch (data.type) {
      case "validation": {
        this.name = "Validation Error";
        this.status = 400;
        this.#formatZodErrors(data.zod?.issues || []);
        break;
      }
      case "basic": {
        this.name = data.name || DEFAULT_ERROR.name;
        this.status = data.status || DEFAULT_ERROR.status;
        this.errors = data.errors || DEFAULT_ERROR.errors;
        break;
      }
      case "authorisation": {
        this.name = "Authorisation Error";
        this.status = 401;
        break;
      }
      case "forbidden": {
        this.name = "Forbidden";
        this.status = 403;
        this.code = data.code || DEFAULT_ERROR.code;
        this.errors = data.errors || DEFAULT_ERROR.errors;
        break;
      }
      default: {
        this.name = DEFAULT_ERROR.name;
        this.status = DEFAULT_ERROR.status;
        this.errors = data.errors || DEFAULT_ERROR.errors;
        break;
      }
    }
  }
  #formatZodErrors(error) {
    const result = {};
    for (const item of error) {
      let current = result;
      for (const key of item.path) {
        if (typeof key === "number") {
          current = current.children || (current.children = []);
          current = current[key] || (current[key] = {});
        } else {
          current = current[key] || (current[key] = {});
        }
      }
      current.code = item.code;
      current.message = item.message;
    }
    this.errors = result || null;
  }
};
var RuntimeError = class extends Error {
  constructor(message) {
    super(message);
    console.error(bgRed(`[RUNTIME ERROR] ${message}`));
  }
};
var decodeError = (error) => {
  if (error instanceof LucidError) {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      errors: error.errors,
      code: error.code
    };
  }
  return {
    name: DEFAULT_ERROR.name,
    message: error.message,
    status: DEFAULT_ERROR.status,
    errors: DEFAULT_ERROR.errors,
    code: DEFAULT_ERROR.code
  };
};
var modelErrors = (error) => {
  return {
    body: error
  };
};
var errorLogger = (error, req, res, next) => {
  const { message, status } = decodeError(error);
  console.error(red(`${status} - ${message}`));
  next(error);
};
var errorResponder = (error, req, res, next) => {
  const { name, message, status, errors, code } = decodeError(error);
  const response = Object.fromEntries(
    Object.entries({
      code,
      status,
      name,
      message,
      errors
    }).filter(([_, value]) => value !== null)
  );
  res.status(status).send(response);
};
var invalidPathHandler = (error, req, res, next) => {
  res.status(404);
  res.send("invalid path");
};

// src/services/Config.ts
import { bgRed as bgRed2 } from "console-log-colors";

// src/constants.ts
var constants_default = {
  pagination: {
    page: "1",
    perPage: "10"
  },
  media: {
    storageLimit: 5368709120,
    // unit: byte (5GB)
    maxFileSize: 16777216,
    // unit: byte (16MB)
    processedImageLimit: 10
  },
  locations: {
    resetPassword: "/reset-password"
  }
};

// src/services/Config.ts
import { fromZodError } from "zod-validation-error";
import { pathToFileURL } from "url";
var configSchema = z.object({
  host: z.string(),
  origin: z.string(),
  mode: z.enum(["development", "production"]),
  postgresURL: z.string(),
  secret: z.string(),
  forms: z.array(z.any()).optional(),
  collections: z.array(z.any()).optional(),
  bricks: z.array(z.any()).optional(),
  media: z.object({
    storageLimit: z.number().optional(),
    maxFileSize: z.number().optional(),
    fallbackImage: z.union([z.string(), z.boolean()]).optional(),
    processedImageLimit: z.number().optional(),
    store: z.object({
      service: z.enum(["aws", "cloudflare"]),
      cloudflareAccountId: z.string().optional(),
      region: z.string(),
      bucket: z.string(),
      accessKeyId: z.string(),
      secretAccessKey: z.string()
    })
  }),
  email: z.object({
    from: z.object({
      name: z.string(),
      email: z.string().email()
    }),
    templateDir: z.string().optional(),
    smtp: z.object({
      host: z.string(),
      port: z.number(),
      user: z.string(),
      pass: z.string(),
      secure: z.boolean().optional()
    }).optional()
  }).optional()
});
var Config = class _Config {
  // Cache for configuration
  static _configCache = null;
  // -------------------------------------------
  // Public
  static validate = (config) => {
    try {
      configSchema.parse(config);
      _Config.#validateBricks(config);
      _Config.#validateCollections(config);
      _Config.#validateForms(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        const message = validationError.message.split("Validation error: ")[1];
        console.log(bgRed2(message));
        process.exit(1);
      } else {
        throw error;
      }
    }
  };
  static findPath = (cwd) => {
    if (process.env.LUCID_CONFIG_PATH) {
      if (path.isAbsolute(process.env.LUCID_CONFIG_PATH)) {
        return process.env.LUCID_CONFIG_PATH;
      }
      return path.resolve(process.cwd(), process.env.LUCID_CONFIG_PATH);
    }
    let configPath = void 0;
    const root = path.parse(cwd).root;
    const configFileName = "lucid.config";
    const configExtensions = [".ts", ".js"];
    const search = (cwd2) => {
      const files = fs.readdirSync(cwd2);
      const configFiles = files.filter((file) => {
        const { name, ext } = path.parse(file);
        return name === configFileName && configExtensions.includes(ext);
      });
      if (configFiles.length > 0) {
        configPath = path.resolve(cwd2, configFiles[0]);
        return;
      }
      const parent = path.resolve(cwd2, "..");
      if (parent === cwd2 || parent === root) {
        return;
      }
      search(parent);
    };
    search(cwd);
    if (!configPath) {
      throw new RuntimeError(
        "Cannot find the lucid.config.ts or lucid.config.js file at the root of your project."
      );
    }
    return configPath;
  };
  // -------------------------------------------
  // Functions
  static getConfig = async () => {
    return await _Config.cachedConfig();
  };
  static getConfigESM = async (path7) => {
    const configUrl = pathToFileURL(path7).href;
    const configModule = await import(configUrl);
    const config = configModule.default;
    return config;
  };
  static getConfigCJS = async (path7) => {
    const configModule = await __require(path7);
    const config = configModule.default;
    return config;
  };
  static cachedConfig = async () => {
    if (_Config.configCache) {
      return _Config.configCache;
    }
    const configPath = _Config.findPath(process.cwd());
    let config;
    try {
      config = await _Config.getConfigESM(configPath);
    } catch (error) {
      config = await _Config.getConfigCJS(configPath);
    }
    _Config._configCache = config;
    return config;
  };
  // getters
  static get defaultConfig() {
    return {
      forms: [],
      collections: [],
      bricks: [],
      media: {
        storageLimit: constants_default.media.storageLimit,
        maxFileSize: constants_default.media.maxFileSize,
        processedImageLimit: constants_default.media.processedImageLimit
      }
    };
  }
  static get configCache() {
    return _Config._configCache;
  }
  static get mode() {
    return _Config.configCache.mode;
  }
  static get media() {
    const media = _Config.configCache?.media;
    return {
      storageLimit: media?.storageLimit || constants_default.media.storageLimit,
      maxFileSize: media?.maxFileSize || constants_default.media.maxFileSize,
      fallbackImage: media?.fallbackImage,
      processedImageLimit: media?.processedImageLimit || constants_default.media.processedImageLimit,
      store: {
        service: media?.store.service,
        cloudflareAccountId: media?.store.cloudflareAccountId,
        region: media?.store.region,
        bucket: media?.store.bucket,
        accessKeyId: media?.store.accessKeyId,
        secretAccessKey: media?.store.secretAccessKey
      }
    };
  }
  static get email() {
    return _Config.configCache.email;
  }
  static get secret() {
    return _Config.configCache.secret;
  }
  static get bricks() {
    return _Config.configCache.bricks;
  }
  static get collections() {
    return _Config.configCache.collections;
  }
  static get postgresURL() {
    return _Config.configCache.postgresURL;
  }
  static get origin() {
    return _Config.configCache.origin;
  }
  static get forms() {
    return _Config.configCache.forms;
  }
  static get host() {
    return _Config.configCache.host;
  }
  // -------------------------------------------
  // Private
  static #validateBricks(config) {
    if (!config.bricks)
      return;
    const brickKeys = config.bricks.map((brick) => brick.key);
    const uniqueBrickKeys = [...new Set(brickKeys)];
    if (brickKeys.length !== uniqueBrickKeys.length) {
      throw new RuntimeError(
        "Each brick key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  }
  static #validateCollections(config) {
    if (!config.collections)
      return;
    const collectionKeys = config.collections.map(
      (collection) => collection.key
    );
    const uniqueCollectionKeys = [...new Set(collectionKeys)];
    if (collectionKeys.length !== uniqueCollectionKeys.length) {
      throw new RuntimeError(
        "Each collection key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  }
  static #validateForms(config) {
    if (!config.forms)
      return;
    const formKeys = config.forms.map((form) => form.key);
    const uniqueFormKeys = [...new Set(formKeys)];
    if (formKeys.length !== uniqueFormKeys.length) {
      throw new RuntimeError(
        "Each form key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  }
};
var buildConfig = (config) => {
  Config.validate(config);
  return config;
};

// src/db/db.ts
var { Pool } = pg;
var poolVal;
var initializePool = async () => {
  const config = await Config.getConfig();
  poolVal = new Pool({
    connectionString: config.postgresURL,
    max: 20,
    ssl: {
      rejectUnauthorized: false
    }
  });
};
var getDBClient = () => {
  if (!poolVal) {
    throw new Error(
      "Database connection pool is not initialized. Call initializePool() before getDBClient()."
    );
  }
  return poolVal.connect();
};

// src/db/migration.ts
import fs2 from "fs-extra";
import path2 from "path";
import { green } from "console-log-colors";

// src/utils/app/get-dirname.ts
import { fileURLToPath } from "url";
import { dirname } from "path";
var getDirName = (metaUrl) => {
  return dirname(fileURLToPath(metaUrl));
};
var get_dirname_default = getDirName;

// src/db/models/Migration.ts
var Migration = class {
  static all = async (client) => {
    try {
      const migrations = await client.query(
        `SELECT * FROM lucid_migrations`
      );
      return migrations.rows;
    } catch (err) {
      return [];
    }
  };
  static create = async (client, data) => {
    const { file, rawSql } = data;
    await client.query({
      text: rawSql
    });
    await client.query({
      text: `INSERT INTO lucid_migrations (file) VALUES ($1)`,
      values: [file]
    });
  };
};

// src/db/migration.ts
var currentDir = get_dirname_default(import.meta.url);
var getOutstandingMigrations = async (client) => {
  const migrationFiles = await fs2.readdir(
    path2.join(currentDir, "./migrations")
  );
  const migrations = await Migration.all(client);
  const outstandingMigrations = migrationFiles.filter((migrationFile) => {
    if (!migrationFile.endsWith(".sql"))
      return false;
    return !migrations.find((migration) => migration.file === migrationFile);
  }).map((migrationFile) => ({
    file: migrationFile,
    sql: fs2.readFileSync(
      path2.join(currentDir, "./migrations", migrationFile),
      "utf-8"
    )
  })).sort((a, b) => {
    const aNum = parseInt(a.file.substring(0, 8));
    const bNum = parseInt(b.file.substring(0, 8));
    return aNum - bNum;
  });
  return outstandingMigrations;
};
var migrate = async () => {
  const client = await getDBClient();
  try {
    const outstandingMigrations = await getOutstandingMigrations(client);
    if (outstandingMigrations.length === 0) {
      console.log(green("No outstanding migrations, database is up to date"));
      return;
    }
    console.log(
      green(
        `Found ${outstandingMigrations.length} outstanding migrations, running...`
      )
    );
    for (const migration of outstandingMigrations) {
      console.log(green(`- running migration ${migration.file}`));
      await Migration.create(client, {
        file: migration.file,
        rawSql: migration.sql
      });
    }
  } catch (err) {
    new RuntimeError(err.message);
    process.exit(1);
  }
};
var migration_default = migrate;

// src/routes/v1/auth.routes.ts
import { Router } from "express";

// src/utils/app/route.ts
import z3 from "zod";

// src/middleware/validate.ts
import z2 from "zod";
var querySchema = z2.object({
  include: z2.string().optional(),
  exclude: z2.string().optional(),
  filter: z2.object({}).optional(),
  sort: z2.string().optional(),
  page: z2.string().optional(),
  per_page: z2.string().optional()
});
var buildFilter = (query) => {
  let filter = void 0;
  Array.from(Object.entries(query.filter || {})).forEach(([key, value]) => {
    const v = value;
    if (!filter)
      filter = {};
    if (v.includes(",")) {
      filter[key] = v.split(",");
    } else {
      filter[key] = v;
    }
  });
  return filter;
};
var buildInclude = (query) => {
  let include = void 0;
  include = query.include?.split(",");
  return include;
};
var buildExclude = (query) => {
  let exclude = void 0;
  exclude = query.exclude?.split(",");
  return exclude;
};
var buildSort = (query) => {
  let sort = void 0;
  sort = query.sort?.split(",").map((sort2) => {
    if (sort2.startsWith("-")) {
      return {
        key: sort2.slice(1),
        value: "desc"
      };
    } else {
      return {
        key: sort2,
        value: "asc"
      };
    }
  });
  return sort;
};
var buildPage = (query) => {
  let page = void 0;
  if (query.page) {
    const pageInt = parseInt(query.page);
    if (!isNaN(pageInt)) {
      page = pageInt.toString();
    } else {
      page = "1";
    }
  }
  return page;
};
var buildPerPage = (query) => {
  let per_page = void 0;
  if (query.per_page) {
    const per_pageInt = parseInt(query.per_page);
    if (!isNaN(per_pageInt)) {
      per_page = per_pageInt.toString();
    } else {
      per_page = constants_default.pagination.perPage;
    }
  }
  return per_page;
};
var addRemainingQuery = (req) => {
  const remainingQuery = Object.fromEntries(
    Object.entries(req.query).filter(
      ([key]) => !["include", "exclude", "filter", "sort", "page", "per_page"].includes(
        key
      )
    )
  );
  return remainingQuery;
};
var validate = (schema) => async (req, res, next) => {
  try {
    const parseData = {};
    parseData["body"] = req.body;
    parseData["params"] = req.params;
    parseData["query"] = {
      include: buildInclude(req.query),
      exclude: buildExclude(req.query),
      filter: buildFilter(req.query),
      sort: buildSort(req.query),
      page: buildPage(req.query),
      per_page: buildPerPage(req.query),
      ...addRemainingQuery(req)
    };
    if (Object.keys(parseData).length === 0)
      return next();
    const validate2 = await schema.safeParseAsync(parseData);
    if (!validate2.success) {
      throw new LucidError({
        type: "validation",
        zod: validate2.error
      });
    } else {
      req.body = validate2.data.body;
      req.query = validate2.data.query;
      req.params = validate2.data.params;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
var validate_default = validate;

// src/services/auth/csrf.ts
import crypto from "crypto";
var generateCSRFToken = (res) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie("_csrf", token, {
    maxAge: 864e5 * 7,
    httpOnly: true,
    secure: Config.mode === "production",
    sameSite: "strict"
  });
  return token;
};
var verifyCSRFToken = (req) => {
  const { _csrf } = req.cookies;
  const { _csrf: CSRFHeader } = req.headers;
  if (!_csrf || !CSRFHeader)
    return false;
  if (_csrf !== CSRFHeader)
    return false;
  return true;
};
var clearCSRFToken = (res) => {
  res.clearCookie("_csrf");
};
var csrf_default = {
  generateCSRFToken,
  verifyCSRFToken,
  clearCSRFToken
};

// src/services/auth/jwt.ts
import jwt from "jsonwebtoken";
var generateJWT = (res, user) => {
  const { id, email, username } = user;
  const payload = {
    id,
    email,
    username
  };
  const token = jwt.sign(payload, Config.secret, {
    expiresIn: "7d"
  });
  res.cookie("_jwt", token, {
    maxAge: 864e5 * 7,
    httpOnly: true,
    secure: Config.mode === "production",
    sameSite: "strict"
  });
  res.cookie("auth", true, {
    maxAge: 864e5 * 7
  });
};
var verifyJWT = (req) => {
  try {
    const { _jwt } = req.cookies;
    if (!_jwt) {
      return {
        sucess: false,
        data: null
      };
    }
    const decoded = jwt.verify(_jwt, Config.secret);
    return {
      sucess: true,
      data: decoded
    };
  } catch (err) {
    return {
      sucess: false,
      data: null
    };
  }
};
var clearJWT = (res) => {
  res.clearCookie("_jwt");
  res.clearCookie("auth");
};
var jwt_default = {
  generateJWT,
  verifyJWT,
  clearJWT
};

// src/utils/app/service.ts
var service = (fn, transaction, outerClient) => async (...args) => {
  let client;
  let shouldReleaseClient = false;
  if (outerClient) {
    client = outerClient;
  } else {
    client = await getDBClient();
    shouldReleaseClient = true;
  }
  try {
    if (transaction)
      await client.query("BEGIN");
    const result = await fn(client, ...args);
    if (transaction)
      await client.query("COMMIT");
    return result;
  } catch (error) {
    if (transaction)
      await client.query("ROLLBACK");
    throw error;
  } finally {
    if (shouldReleaseClient) {
      client.release();
    }
  }
};
var service_default = service;

// src/db/models/UserRole.ts
var UserRole = class {
  static getAll = async (client, data) => {
    const userRoles = await client.query({
      text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
      values: [data.user_id]
    });
    return userRoles.rows;
  };
  static updateRoles = async (client, data) => {
    const roles = await client.query({
      text: `
        INSERT INTO lucid_user_roles(user_id, role_id)
        SELECT $1, unnest($2::integer[]);`,
      values: [data.user_id, data.role_ids]
    });
    return roles.rows;
  };
  static deleteMultiple = async (client, data) => {
    const roles = await client.query({
      text: `
        DELETE FROM 
          lucid_user_roles
        WHERE 
          id = ANY($1::integer[])
        AND 
          user_id = $2
        RETURNING *;
      `,
      values: [data.role_ids, data.user_id]
    });
    return roles.rows;
  };
  static getPermissions = async (client, data) => {
    const userPermissions = await client.query({
      text: `SELECT 
          rp.permission,
          rp.environment_key,
          r.id AS role_id,
          r.name AS role_name
        FROM 
          lucid_role_permissions rp
        INNER JOIN 
          lucid_user_roles ur ON ur.role_id = rp.role_id
        INNER JOIN 
          lucid_roles r ON r.id = rp.role_id
        WHERE 
          ur.user_id = $1;`,
      values: [data.user_id]
    });
    return userPermissions.rows;
  };
};

// src/utils/app/query-helpers.ts
var queryDataFormat = (data) => {
  if (!data.flatValues) {
    if (data.columns.length !== data.values.length) {
      throw new Error("Columns and values arrays must have the same length");
    }
  }
  const filteredData = data.columns.map((col, i) => ({ col, val: data.values[i] })).filter((data2) => data2.val !== void 0);
  const c = filteredData.map((data2) => data2.col);
  const v = filteredData.map((data2) => data2.val);
  let a;
  if (data.flatValues) {
    const groupedValues = [];
    const valueCopy = [...data.values];
    for (let i = 0; i < data.columns.length; i++) {
      const newGroup = valueCopy.splice(0, data.columns.length);
      if (newGroup.length === 0)
        break;
      groupedValues.push(newGroup);
    }
    a = groupedValues.map((_, i) => {
      const g = data.columns.map(
        (_2, j) => `$${i * data.columns.length + j + 1}`
      );
      return `(${g.join(", ")})`;
    });
  } else {
    a = v.map((_, i) => `$${i + 1}`);
  }
  if (data.conditional?.hasValues) {
    const hasValues = Object.entries(data.conditional.hasValues);
    for (let i = 0; i < hasValues.length; i++) {
      const [key, value] = hasValues[i];
      if (value === void 0)
        continue;
      c.push(key);
      v.push(value);
      a.push(`$${a.length + 1}`);
    }
  }
  return {
    columns: {
      value: c,
      formatted: {
        insert: c.join(", "),
        update: c.map((col, i) => `${col} = ${a[i]}`).join(", "),
        doUpdate: c.map((col, i) => `${col} = EXCLUDED.${col}`).join(", "),
        insertMultiple: data.columns.join(", ")
      }
    },
    aliases: {
      value: a,
      formatted: {
        insert: a.join(", "),
        update: a.join(", "),
        insertMultiple: a.join(", ")
      }
    },
    values: {
      value: v,
      formatted: {
        insertMultiple: data.values
      }
    }
  };
};
var SelectQueryBuilder = class {
  config = {
    columns: []
  };
  query = {
    select: "",
    where: "",
    order: "",
    pagination: ""
  };
  values = [];
  constructor(config) {
    this.config = config;
    this.#buildSelect();
    this.#buildFilter();
    this.#buildOrder();
    this.#buildPagination();
  }
  // -------------------------------------------
  // Methods
  #buildSelect() {
    if (!this.config.exclude) {
      this.config.columns.forEach((column, index) => {
        this.query.select += `${column}${index < this.config.columns.length - 1 ? ", " : ""}`;
      });
    } else {
      this.config.columns.forEach((column, index) => {
        if (this.config.exclude?.includes(column))
          return;
        this.query.select += `${column}${index < this.config.columns.length - 1 ? ", " : ""}`;
      });
    }
  }
  #buildFilter() {
    const filterClauses = [];
    if (!this.config.filter?.data) {
      this.query.where = "";
      this.values = [];
      return;
    }
    const filters = Object.entries(this.config.filter.data);
    if (!filters) {
      this.query.where = "";
      this.values = [];
      return;
    }
    for (let i = 0; i < filters.length; i++) {
      const [key, value] = filters[i];
      if (value === void 0)
        continue;
      const meta = this.config.filter.meta ? this.config.filter.meta[key] : void 0;
      if (meta?.exclude)
        continue;
      const columnType = meta?.columnType || "standard";
      const baseKey = meta?.key || key;
      const keyV = meta?.table ? `${meta?.table}.${baseKey}` : baseKey;
      switch (columnType) {
        case "array": {
          filterClauses.push(
            `${keyV} ${meta?.operator || "@>"} $${this.values.length + 1}::${meta?.type || "int"}[]`
          );
          this.values.push(
            this.#parseArrayValues(Array.isArray(value) ? value : [value])
          );
          break;
        }
        default: {
          if (Array.isArray(value)) {
            filterClauses.push(
              `${keyV} = ANY($${this.values.length + 1}::${meta?.type || "int"}[])`
            );
            this.values.push(this.#parseArrayValues(value));
            break;
          }
          filterClauses.push(
            `${keyV} ${meta?.operator || "="} $${this.values.length + 1}`
          );
          this.values.push(this.#parseSingleValue(value));
          break;
        }
      }
    }
    this.query.where = filterClauses.length > 0 ? "WHERE " + filterClauses.join(" AND ") : "";
  }
  #buildOrder() {
    if (!this.config.sort)
      return;
    let query = "";
    this.config.sort.forEach((sort, index) => {
      query += `${sort.key} ${sort.value.toUpperCase()}${index < (this.config.sort?.length || 0) - 1 ? ", " : ""}`;
    });
    this.query.order = `ORDER BY ${query}`;
  }
  #buildPagination() {
    if (!this.config.page || !this.config.per_page)
      return;
    if (this.config.per_page === "-1")
      return;
    const offset = (Number(this.config.page) - 1) * Number(this.config.per_page);
    this.query.pagination = `LIMIT $${this.values.length + 1}`;
    this.values.push(Number(this.config.per_page));
    this.query.pagination += ` OFFSET $${this.values.length + 1}`;
    this.values.push(offset);
  }
  // -------------------------------------------
  // Helpers
  #parseArrayValues(arr) {
    return arr.map((v) => {
      return this.#parseSingleValue(v);
    });
  }
  #parseSingleValue(v) {
    if (typeof v != "string")
      return v;
    if (v === "true")
      return true;
    if (v === "false")
      return false;
    if (!isNaN(Number(v))) {
      return Number(v);
    } else {
      return v;
    }
  }
  // -------------------------------------------
  // Getters
  get countValues() {
    if (this.query.pagination) {
      return this.values.slice(0, this.values.length - 2);
    }
    return this.values;
  }
};

// src/db/models/Role.ts
var Role = class {
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["name"],
      values: [data.name]
    });
    const roleRes = await client.query({
      text: `INSERT INTO lucid_roles (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return roleRes.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const roleRes = await client.query({
      text: `DELETE FROM lucid_roles WHERE id = $1 RETURNING *`,
      values: [data.id]
    });
    return roleRes.rows[0];
  };
  static getMultiple = async (client, query_instance) => {
    const roles = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_roles as roles ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT COUNT(DISTINCT lucid_roles.id) FROM lucid_roles ${query_instance.query.where}`,
      values: query_instance.countValues
    });
    const data = await Promise.all([roles, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static updateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["name", "updated_at"],
      values: [data.data.name, data.data.updated_at]
    });
    const roleRes = await client.query({
      text: `UPDATE lucid_roles SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
      values: [...values.value, data.id]
    });
    return roleRes.rows[0];
  };
  static getSingle = async (client, data) => {
    const roleRes = await client.query({
      text: `SELECT 
          roles.*,
          json_agg(json_build_object(
            'id', rp.id, 
            'permission', rp.permission,
            'environment_key', rp.environment_key
          )) AS permissions
        FROM
          lucid_roles as roles
        LEFT JOIN 
          lucid_role_permissions as rp ON roles.id = rp.role_id
        WHERE 
          roles.id = $1
        GROUP BY
          roles.id`,
      values: [data.id]
    });
    return roleRes.rows[0];
  };
  static getSingleByName = async (client, data) => {
    const roleRes = await client.query({
      text: `SELECT * FROM lucid_roles WHERE name = $1`,
      values: [data.name]
    });
    return roleRes.rows[0];
  };
};

// src/db/models/RolePermission.ts
var RolePermission = class {
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["role_id", "permission", "environment_key"],
      values: [data.role_id, data.permission, data.environment_key]
    });
    const permissionRes = await client.query({
      text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return permissionRes.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const rolePermission = await client.query({
      text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
      values: [data.id]
    });
    return rolePermission.rows[0];
  };
  static deleteAll = async (client, data) => {
    const res = await client.query({
      text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
      values: [data.role_id]
    });
    return res.rows;
  };
  static getAll = async (client, data) => {
    const res = await client.query({
      text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
      values: [data.role_id]
    });
    return res.rows;
  };
};

// src/services/role-permissions/create-multiple.ts
var createMultiple = async (client, data) => {
  const permissionsPromise = data.permissions.map((permission) => {
    return RolePermission.createSingle(client, {
      role_id: data.role_id,
      permission: permission.permission,
      environment_key: permission.environment_key
    });
  });
  return await Promise.all(permissionsPromise);
};
var create_multiple_default = createMultiple;

// src/services/role-permissions/delete-multiple.ts
var deleteMultiple = async (client, data) => {
  const permissionsPromise = data.ids.map((id) => {
    return RolePermission.deleteSingle(client, {
      id
    });
  });
  const permissions2 = await Promise.all(permissionsPromise);
  return permissions2;
};
var delete_multiple_default = deleteMultiple;

// src/services/role-permissions/delete-all.ts
var deleteAll = async (client, data) => {
  const permissions2 = await RolePermission.deleteAll(client, {
    role_id: data.role_id
  });
  return permissions2;
};
var delete_all_default = deleteAll;

// src/services/role-permissions/get-all.ts
var getAll = async (client, data) => {
  const rolePermissions = await RolePermission.getAll(client, {
    role_id: data.role_id
  });
  return rolePermissions;
};
var get_all_default = getAll;

// src/services/role-permissions/index.ts
var role_permissions_default = {
  createMultiple: create_multiple_default,
  deleteMultiple: delete_multiple_default,
  deleteAll: delete_all_default,
  getAll: get_all_default
};

// src/utils/format/format-roles.ts
var formatRole = (role) => {
  let roleF = {
    id: role.id,
    name: role.name,
    created_at: role.created_at,
    updated_at: role.updated_at
  };
  if (role.permissions) {
    roleF.permissions = role.permissions?.filter(
      (permission) => permission.id !== null
    );
  }
  return roleF;
};
var format_roles_default = formatRole;

// src/services/roles/create-single.ts
var createSingle = async (client, data) => {
  const parsePermissions = await service_default(
    roles_default.validatePermissions,
    false,
    client
  )(data.permission_groups);
  await service_default(
    roles_default.checkNameIsUnique,
    false,
    client
  )({
    name: data.name
  });
  const role = await Role.createSingle(client, {
    name: data.name,
    permission_groups: data.permission_groups
  });
  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error creating the role.",
      status: 500
    });
  }
  if (data.permission_groups.length > 0) {
    await service_default(
      role_permissions_default.createMultiple,
      false,
      client
    )({
      role_id: role.id,
      permissions: parsePermissions
    });
  }
  return format_roles_default(role);
};
var create_single_default = createSingle;

// src/services/roles/delete-single.ts
var deleteSingle = async (client, data) => {
  const role = await Role.deleteSingle(client, {
    id: data.id
  });
  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error deleting the role.",
      status: 500
    });
  }
  return format_roles_default(role);
};
var delete_single_default = deleteSingle;

// src/services/roles/get-multiple.ts
var getMultiple = async (client, data) => {
  const { filter, sort, page, per_page, include } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: ["roles.id", "roles.name", "roles.created_at", "roles.updated_at"],
    exclude: void 0,
    filter: {
      data: filter,
      meta: {
        name: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        role_ids: {
          key: "id",
          operator: "=",
          type: "int",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const roles = await Role.getMultiple(client, SelectQuery);
  if (include && include.includes("permissions")) {
    const permissionsPromise = roles.data.map(
      (role) => service_default(
        role_permissions_default.getAll,
        false,
        client
      )({
        role_id: role.id
      })
    );
    const permissions2 = await Promise.all(permissionsPromise);
    roles.data = roles.data.map((role, index) => {
      return {
        ...role,
        permissions: permissions2[index].map((permission) => {
          return {
            id: permission.id,
            permission: permission.permission,
            environment_key: permission.environment_key
          };
        })
      };
    });
  }
  return {
    data: roles.data.map((role) => format_roles_default(role)),
    count: roles.count
  };
};
var get_multiple_default = getMultiple;

// src/services/roles/get-single.ts
var getSingle = async (client, data) => {
  const role = await Role.getSingle(client, {
    id: data.id
  });
  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error getting the role.",
      status: 500
    });
  }
  return format_roles_default(role);
};
var get_single_default = getSingle;

// src/services/roles/update-single.ts
var updateSingle = async (client, data) => {
  if (data.name) {
    await service_default(
      roles_default.checkNameIsUnique,
      false,
      client
    )({
      name: data.name
    });
  }
  const role = await Role.updateSingle(client, {
    id: data.id,
    data: {
      name: data.name,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error updating the role.",
      status: 500
    });
  }
  if (data.permission_groups !== void 0) {
    const parsePermissions = await service_default(
      roles_default.validatePermissions,
      false,
      client
    )(data.permission_groups);
    await service_default(
      role_permissions_default.deleteAll,
      false,
      client
    )({
      role_id: data.id
    });
    if (data.permission_groups.length > 0) {
      await service_default(
        role_permissions_default.createMultiple,
        false,
        client
      )({
        role_id: data.id,
        permissions: parsePermissions
      });
    }
  }
  return format_roles_default(role);
};
var update_single_default = updateSingle;

// src/services/roles/check-name-unique.ts
var checkNameIsUnique = async (client, data) => {
  const role = await Role.getSingleByName(client, {
    name: data.name
  });
  if (role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "The role name must be unique.",
      status: 500,
      errors: modelErrors({
        name: {
          code: "Not unique",
          message: "The role name must be unique."
        }
      })
    });
  }
  return role;
};
var check_name_unique_default = checkNameIsUnique;

// src/db/models/Environment.ts
var Environment = class {
  static getAll = async (client) => {
    const environments = await client.query({
      text: `SELECT *
        FROM 
          lucid_environments
        ORDER BY
          key ASC`,
      values: []
    });
    return environments.rows;
  };
  static getSingle = async (client, data) => {
    const environment = await client.query({
      text: `SELECT * FROM lucid_environments WHERE key = $1`,
      values: [data.key]
    });
    return environment.rows[0];
  };
  static upsertSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "key",
        "title",
        "assigned_bricks",
        "assigned_collections",
        "assigned_forms"
      ],
      values: [
        data.key,
        data.title,
        data.assigned_bricks,
        data.assigned_collections,
        data.assigned_forms
      ]
    });
    const environments = await client.query({
      text: `INSERT INTO lucid_environments (${columns.formatted.insert}) 
        VALUES (${aliases.formatted.insert}) 
        ON CONFLICT (key) 
        DO UPDATE SET ${columns.formatted.doUpdate}
        RETURNING *`,
      values: [...values.value]
    });
    return environments.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const environments = await client.query({
      text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
      values: [data.key]
    });
    return environments.rows[0];
  };
};

// src/utils/format/format-environment.ts
var formatEnvironment = (environment) => {
  return {
    key: environment.key,
    title: environment.title || "",
    assigned_bricks: environment.assigned_bricks || [],
    assigned_collections: environment.assigned_collections || [],
    assigned_forms: environment.assigned_forms || []
  };
};
var format_environment_default = formatEnvironment;

// src/services/environments/delete-single.ts
var deleteSingle2 = async (client, data) => {
  await service_default(
    environments_default.getSingle,
    false,
    client
  )({
    key: data.key
  });
  const environment = await Environment.deleteSingle(client, {
    key: data.key
  });
  if (!environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment not deleted",
      message: `Environment with key "${data.key}" could not be deleted`,
      status: 400
    });
  }
  return format_environment_default(environment);
};
var delete_single_default2 = deleteSingle2;

// src/services/environments/get-single.ts
var getSingle2 = async (client, data) => {
  const environment = await Environment.getSingle(client, {
    key: data.key
  });
  if (!environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment not found",
      message: `Environment with key "${data.key}" not found`,
      status: 404
    });
  }
  return format_environment_default(environment);
};
var get_single_default2 = getSingle2;

// src/services/environments/get-all.ts
var getAll2 = async (client) => {
  const environmentsRes = await Environment.getAll(client);
  return environmentsRes.map((environment) => format_environment_default(environment));
};
var get_all_default2 = getAll2;

// src/services/environments/migrate-environment.ts
var migrateEnvironment = async (data) => {
  return;
};
var migrate_environment_default = migrateEnvironment;

// src/services/environments/upsert-single.ts
import slug from "slug";
var checkAssignedBricks = async (assigned_bricks) => {
  const brickInstances = Config.bricks || [];
  const brickKeys = brickInstances.map((b) => b.key);
  const invalidBricks = assigned_bricks.filter((b) => !brickKeys.includes(b));
  if (invalidBricks.length > 0) {
    throw new LucidError({
      type: "basic",
      name: "Invalid brick keys",
      message: `Make sure all assigned_bricks are valid.`,
      status: 400,
      errors: modelErrors({
        assigned_bricks: {
          code: "invalid",
          message: `Make sure all assigned_bricks are valid.`,
          children: invalidBricks.map((b) => ({
            code: "invalid",
            message: `Brick with key "${b}" not found.`
          }))
        }
      })
    });
  }
};
var checkAssignedCollections = async (assigned_collections) => {
  const collectionInstances = Config.collections || [];
  const collectionKeys = collectionInstances.map((c) => c.key);
  const invalidCollections = assigned_collections.filter(
    (c) => !collectionKeys.includes(c)
  );
  if (invalidCollections.length > 0) {
    throw new LucidError({
      type: "basic",
      name: "Invalid collection keys",
      message: `Make sure all assigned_collections are valid.`,
      status: 400,
      errors: modelErrors({
        assigned_collections: {
          code: "invalid",
          message: `Make sure all assigned_collections are valid.`,
          children: invalidCollections.map((c) => ({
            code: "invalid",
            message: `Collection with key "${c}" not found.`
          }))
        }
      })
    });
  }
};
var checkAssignedForms = async (assigned_forms) => {
  const formInstances = Config.forms || [];
  const formKeys = formInstances.map((f) => f.key);
  const invalidForms = assigned_forms.filter((f) => !formKeys.includes(f));
  if (invalidForms.length > 0) {
    throw new LucidError({
      type: "basic",
      name: "Invalid form keys",
      message: `Make sure all assigned_forms are valid.`,
      status: 400,
      errors: modelErrors({
        assigned_forms: {
          code: "invalid",
          message: `Make sure all assigned_forms are valid.`,
          children: invalidForms.map((f) => ({
            code: "invalid",
            message: `Form with key "${f}" not found.`
          }))
        }
      })
    });
  }
};
var upsertSingle = async (client, data) => {
  const key = data.create ? slug(data.data.key, { lower: true }) : data.data.key;
  if (!data.create) {
    await service_default(
      environments_default.getSingle,
      false,
      client
    )({
      key: data.data.key
    });
  } else {
    await service_default(
      environments_default.checkKeyExists,
      false,
      client
    )({
      key: data.data.key
    });
  }
  if (data.data.assigned_bricks) {
    await checkAssignedBricks(data.data.assigned_bricks);
  }
  if (data.data.assigned_collections) {
    await checkAssignedCollections(data.data.assigned_collections);
  }
  if (data.data.assigned_forms) {
    await checkAssignedForms(data.data.assigned_forms);
  }
  const environment = await Environment.upsertSingle(client, {
    key,
    title: data.data.title,
    assigned_bricks: data.data.assigned_bricks,
    assigned_collections: data.data.assigned_collections,
    assigned_forms: data.data.assigned_forms
  });
  if (!environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment not created",
      message: `Environment with key "${key}" could not be created`,
      status: 400
    });
  }
  return format_environment_default(environment);
};
var upsert_single_default = upsertSingle;

// src/services/environments/check-key-exists.ts
var checkKeyExists = async (client, data) => {
  const environment = await Environment.getSingle(client, {
    key: data.key
  });
  if (environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment already exists",
      message: `Environment with key "${data.key}" already exists`,
      status: 400
    });
  }
  return;
};
var check_key_exists_default = checkKeyExists;

// src/services/environments/index.ts
var environments_default = {
  deleteSingle: delete_single_default2,
  getSingle: get_single_default2,
  getAll: get_all_default2,
  migrateEnvironment: migrate_environment_default,
  upsertSingle: upsert_single_default,
  checkKeyExists: check_key_exists_default
};

// src/utils/format/format-permissions.ts
var formatPermissions = (permissions2) => {
  return {
    global: [
      permissions2.users,
      permissions2.roles,
      permissions2.media,
      permissions2.settings,
      permissions2.environment,
      permissions2.emails
    ],
    environment: [
      permissions2.content,
      permissions2.category,
      permissions2.menu,
      permissions2.form_submissions
    ]
  };
};
var format_permissions_default = formatPermissions;

// src/services/Permissions.ts
var Permissions = class _Permissions {
  static get raw() {
    return {
      users: {
        key: "users_permissions",
        permissions: ["create_user", "update_user", "delete_user"]
      },
      roles: {
        key: "roles_permissions",
        permissions: ["create_role", "update_role", "delete_role"]
      },
      media: {
        key: "media_permissions",
        permissions: ["create_media", "update_media", "delete_media"]
      },
      settings: {
        key: "settings_permissions",
        permissions: ["update_settings"]
      },
      environment: {
        key: "environment_permissions",
        permissions: [
          "update_environment",
          "migrate_environment",
          "delete_environment",
          "create_environment"
        ]
      },
      emails: {
        key: "emails_permissions",
        permissions: ["read_email", "delete_email", "send_email"]
      },
      content: {
        key: "content_permissions",
        permissions: [
          "create_content",
          "update_content",
          "delete_content",
          "publish_content",
          "unpublish_content"
        ]
      },
      category: {
        key: "category_permissions",
        permissions: ["create_category", "update_category", "delete_category"]
      },
      menu: {
        key: "menu_permissions",
        permissions: ["create_menu", "update_menu", "delete_menu"]
      },
      form_submissions: {
        key: "form_submissions_permissions",
        permissions: [
          "read_form_submissions",
          "delete_form_submissions",
          "update_form_submissions"
        ]
      }
    };
  }
  static get permissions() {
    const formattedPermissions = format_permissions_default(_Permissions.raw);
    const globalPermissions = formattedPermissions.global.flatMap(
      (group) => group.permissions
    );
    const environmentPermissions = formattedPermissions.environment.flatMap(
      (group) => group.permissions
    );
    return {
      global: globalPermissions,
      environment: environmentPermissions
    };
  }
};

// src/services/roles/validate-permissions.ts
var validatePermissions = async (client, permGroup) => {
  if (permGroup.length === 0)
    return [];
  const permissionSet = Permissions.permissions;
  const environmentsRes = await service_default(
    environments_default.getAll,
    false,
    client
  )();
  const validPermissions = [];
  const permissionErrors = {};
  const environmentErrors = {};
  permGroup.forEach((obj) => {
    const envKey = obj.environment_key;
    for (let i = 0; i < obj.permissions.length; i++) {
      const permission = obj.permissions[i];
      if (!envKey) {
        if (permissionSet.global.includes(permission)) {
          validPermissions.push({
            permission
          });
          continue;
        } else {
          if (!permissionErrors[permission]) {
            permissionErrors[permission] = {
              key: permission,
              code: "Invalid Permission",
              message: `The permission "${permission}" is invalid against global permissions.`
            };
          }
        }
      } else {
        if (permissionSet.environment.includes(
          permission
        )) {
          const env = environmentsRes.find((e) => e.key === envKey);
          if (!env) {
            if (!environmentErrors[envKey]) {
              environmentErrors[envKey] = {
                key: envKey,
                code: "Invalid Environment",
                message: `The environment key "${envKey}" is invalid.`
              };
            }
            continue;
          }
          validPermissions.push({
            permission,
            environment_key: envKey
          });
          continue;
        } else {
          if (!permissionErrors[permission]) {
            permissionErrors[permission] = {
              key: permission,
              code: "Invalid Permission",
              message: `The permission "${permission}" is invalid against environment permissions.`
            };
          }
        }
      }
    }
  });
  if (Object.keys(permissionErrors).length > 0 || Object.keys(environmentErrors).length > 0) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error creating the role.",
      status: 500,
      errors: modelErrors({
        permissions: permissionErrors,
        environments: environmentErrors
      })
    });
  }
  return validPermissions;
};
var validate_permissions_default = validatePermissions;

// src/services/roles/index.ts
var roles_default = {
  createSingle: create_single_default,
  deleteSingle: delete_single_default,
  getMultiple: get_multiple_default,
  getSingle: get_single_default,
  updateSingle: update_single_default,
  checkNameIsUnique: check_name_unique_default,
  validatePermissions: validate_permissions_default
};

// src/services/users/update-roles.ts
var updateRoles = async (client, data) => {
  const userRoles = await UserRole.getAll(client, {
    user_id: data.user_id
  });
  const newRoles = data.role_ids.filter((role) => {
    return !userRoles.find((userRole) => userRole.role_id === role);
  });
  if (newRoles.length > 0) {
    const rolesRes = await service_default(
      roles_default.getMultiple,
      false,
      client
    )({
      query: {
        filter: {
          role_ids: newRoles.map((role) => role.toString())
        }
      }
    });
    if (rolesRes.count !== newRoles.length) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "One or more of the roles do not exist.",
        status: 500
      });
    }
    await UserRole.updateRoles(client, {
      user_id: data.user_id,
      role_ids: newRoles
    });
  }
  const rolesToRemove = userRoles.filter((userRole) => {
    return !data.role_ids.find((role) => role === userRole.role_id);
  });
  if (rolesToRemove.length > 0) {
    const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
    await UserRole.deleteMultiple(client, {
      user_id: data.user_id,
      role_ids: rolesToRemoveIds
    });
  }
  const updatedUserRoles = await UserRole.getAll(client, {
    user_id: data.user_id
  });
  return updatedUserRoles;
};
var update_roles_default = updateRoles;

// src/utils/format/format-user-permissions.ts
var formatUserPermissions = (permissionRes) => {
  const roles = permissionRes.map((permission) => {
    return {
      id: permission.role_id,
      name: permission.role_name
    };
  }).filter((role, index, self) => {
    return index === self.findIndex((r) => r.id === role.id);
  });
  const environments = [];
  const permissions2 = [];
  permissionRes.forEach((permission) => {
    if (permission.environment_key) {
      const env = environments.find(
        (env2) => env2.key === permission.environment_key
      );
      if (!env) {
        environments.push({
          key: permission.environment_key,
          permissions: []
        });
      }
      const permExists = env?.permissions.find(
        (perm) => perm === permission.permission
      );
      if (!permExists)
        env?.permissions.push(permission.permission);
    } else {
      const permExists = permissions2.find(
        (perm) => perm === permission.permission
      );
      if (!permExists)
        permissions2.push(permission.permission);
    }
  });
  return {
    roles,
    permissions: {
      global: permissions2,
      environments
    }
  };
};
var format_user_permissions_default = formatUserPermissions;

// src/services/users/get-permissions.ts
var getPermissions = async (client, data) => {
  const userPermissions = await UserRole.getPermissions(client, {
    user_id: data.user_id
  });
  if (!userPermissions) {
    return {
      roles: [],
      permissions: {
        global: [],
        environments: []
      }
    };
  }
  return format_user_permissions_default(userPermissions);
};
var get_permissions_default = getPermissions;

// src/utils/format/format-user.ts
var formatUser = (user, permissions2) => {
  return {
    id: user.id,
    super_admin: user.super_admin,
    email: user.email,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    roles: permissions2?.roles,
    permissions: permissions2?.permissions,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};
var format_user_default = formatUser;

// src/services/users/get-single.ts
var getSingle3 = async (client, data) => {
  const user = await service_default(
    users_default.getSingleQuery,
    false,
    client
  )({
    user_id: data.user_id,
    email: data.email,
    username: data.username
  });
  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "There was an error finding the user.",
      status: 500
    });
  }
  const userPermissions = await service_default(
    users_default.getPermissions,
    false,
    client
  )({
    user_id: user.id
  });
  return format_user_default(user, userPermissions);
};
var get_single_default3 = getSingle3;

// src/services/users/register-single.ts
import argon2 from "argon2";

// src/db/models/User.ts
var User = class {
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "email",
        "username",
        "password",
        "super_admin",
        "first_name",
        "last_name"
      ],
      values: [
        data.email,
        data.username,
        data.password,
        data.super_admin,
        data.first_name,
        data.last_name
      ]
    });
    const user = await client.query({
      text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return user.rows[0];
  };
  static getMultiple = async (client, query_instance) => {
    const users = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_users ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT COUNT(DISTINCT lucid_users.id) FROM lucid_users ${query_instance.query.where}`,
      values: query_instance.countValues
    });
    const data = await Promise.all([users, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static updateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "first_name",
        "last_name",
        "username",
        "email",
        "password",
        "super_admin"
      ],
      values: [
        data.first_name,
        data.last_name,
        data.username,
        data.email,
        data.password,
        data.super_admin
      ],
      conditional: {
        hasValues: {
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    const page = await client.query({
      text: `UPDATE lucid_users SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING id`,
      values: [...values.value, data.user_id]
    });
    return page.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const user = await client.query({
      text: `DELETE FROM lucid_users WHERE id = $1 RETURNING *`,
      values: [data.id]
    });
    return user.rows[0];
  };
  static getSingle = async (client, query_instance) => {
    const user = await client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_users ${query_instance.query.where}`,
      values: query_instance.values
    });
    return user.rows[0];
  };
};

// src/services/users/register-single.ts
var registerSingle = async (client, data, current_user_id) => {
  let superAdmin = data.super_admin;
  const checkUserProm = Promise.all([
    service_default(
      users_default.getSingleQuery,
      false,
      client
    )({
      email: data.email
    }),
    service_default(
      users_default.getSingleQuery,
      false,
      client
    )({
      username: data.username
    })
  ]);
  const [userByEmail, userByUsername] = await checkUserProm;
  if (userByEmail || userByUsername) {
    const errors = {};
    if (userByEmail) {
      errors.email = {
        code: "email_already_exists",
        message: "A user with that email already exists."
      };
    }
    if (userByUsername) {
      errors.username = {
        code: "username_already_exists",
        message: "A user with that username already exists."
      };
    }
    throw new LucidError({
      type: "basic",
      name: "User Already Exists",
      message: "A user with that email or username already exists.",
      status: 400,
      errors: modelErrors(errors)
    });
  }
  await service_default(
    users_default.checkIfUserExists,
    false,
    client
  )({
    email: data.email,
    username: data.username
  });
  if (current_user_id !== void 0 && data.super_admin === true) {
    const currentUser = await service_default(
      users_default.getSingle,
      false,
      client
    )({
      user_id: current_user_id
    });
    if (!currentUser.super_admin) {
      superAdmin = false;
    }
  }
  const hashedPassword = await argon2.hash(data.password);
  const user = await User.createSingle(client, {
    email: data.email,
    username: data.username,
    password: hashedPassword,
    super_admin: superAdmin,
    first_name: data.first_name,
    last_name: data.last_name
  });
  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Created",
      message: "There was an error creating the user.",
      status: 500
    });
  }
  if (data.role_ids && data.role_ids.length > 0) {
    await service_default(
      users_default.updateRoles,
      false,
      client
    )({
      user_id: user.id,
      role_ids: data.role_ids
    });
  }
  const userPermissions = await service_default(
    users_default.getPermissions,
    false,
    client
  )({
    user_id: user.id
  });
  return format_user_default(user, userPermissions);
};
var register_single_default = registerSingle;

// src/services/users/check-if-user-exists.ts
var checkIfUserExists = async (client, data) => {
  const user = await service_default(
    users_default.getSingleQuery,
    false,
    client
  )({
    email: data.email,
    username: data.username
  });
  if (user) {
    throw new LucidError({
      type: "basic",
      name: "User Already Exists",
      message: "A user with that email or username already exists.",
      status: 400,
      errors: modelErrors({
        email: {
          code: "email_already_exists",
          message: "A user with that email already exists."
        },
        username: {
          code: "username_already_exists",
          message: "A user with that username already exists."
        }
      })
    });
  }
  return user;
};
var check_if_user_exists_default = checkIfUserExists;

// src/services/users/delete-single.ts
var deleteSingle3 = async (client, data) => {
  await service_default(
    users_default.getSingle,
    false,
    client
  )({
    user_id: data.user_id
  });
  const user = await User.deleteSingle(client, {
    id: data.user_id
  });
  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Deleted",
      message: "The user was not deleted",
      status: 500
    });
  }
  return format_user_default(user);
};
var delete_single_default3 = deleteSingle3;

// src/services/users/get-multiple.ts
var getMultiple2 = async (client, data) => {
  const { filter, sort, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "email",
      "username",
      "first_name",
      "last_name",
      "created_at",
      "super_admin"
    ],
    exclude: void 0,
    filter: {
      data: filter,
      meta: {
        email: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        username: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        first_name: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        last_name: {
          operator: "%",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const users = await User.getMultiple(client, SelectQuery);
  return {
    data: users.data.map((user) => format_user_default(user)),
    count: users.count
  };
};
var get_multiple_default2 = getMultiple2;

// src/services/users/update-single.ts
import argon22 from "argon2";
var updateSingle2 = async (client, data, current_user_id) => {
  const user = await service_default(
    users_default.getSingle,
    false,
    client
  )({
    user_id: data.user_id
  });
  if (data.first_name !== void 0 && data.first_name === user.first_name)
    delete data.first_name;
  if (data.last_name !== void 0 && data.last_name === user.last_name)
    delete data.last_name;
  if (data.username !== void 0 && data.username === user.username)
    delete data.username;
  if (data.email !== void 0 && data.email === user.email)
    delete data.email;
  const [usernameCheck, emailCheck] = await Promise.all([
    // Check username
    data.username !== void 0 ? service_default(
      users_default.getSingleQuery,
      false,
      client
    )({
      username: data.username
    }) : Promise.resolve(void 0),
    // Check email
    data.email !== void 0 ? service_default(
      users_default.getSingleQuery,
      false,
      client
    )({
      email: data.email
    }) : Promise.resolve(void 0)
  ]);
  if (usernameCheck !== void 0 || emailCheck !== void 0) {
    const errors = {};
    if (emailCheck) {
      errors.email = {
        code: "email_already_exists",
        message: "A user with that email already exists."
      };
    }
    if (usernameCheck) {
      errors.username = {
        code: "username_already_exists",
        message: "A user with that username already exists."
      };
    }
    throw new LucidError({
      type: "basic",
      name: "User Already Exists",
      message: "A user with that email or username already exists.",
      status: 400,
      errors: modelErrors(errors)
    });
  }
  let hashedPassword = void 0;
  if (data.password) {
    hashedPassword = await argon22.hash(data.password);
  }
  let superAdmin = data.super_admin;
  if (current_user_id !== void 0 && superAdmin !== void 0) {
    const currentUser = await service_default(
      users_default.getSingle,
      false,
      client
    )({
      user_id: current_user_id
    });
    if (!currentUser.super_admin) {
      superAdmin = void 0;
    }
  }
  const userUpdate = await User.updateSingle(client, {
    user_id: data.user_id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    email: data.email,
    password: hashedPassword,
    super_admin: superAdmin
  });
  if (!userUpdate) {
    throw new LucidError({
      type: "basic",
      name: "User Not Updated",
      message: "The user was not updated.",
      status: 500
    });
  }
  if (data.role_ids) {
    await service_default(
      users_default.updateRoles,
      false,
      client
    )({
      user_id: data.user_id,
      role_ids: data.role_ids
    });
  }
  return await service_default(
    users_default.getSingle,
    false,
    client
  )({
    user_id: data.user_id
  });
};
var update_single_default2 = updateSingle2;

// src/services/users/get-single-query.ts
var getSingleQuery = async (client, data) => {
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "super_admin",
      "email",
      "username",
      "first_name",
      "last_name",
      "created_at",
      "updated_at",
      "password"
    ],
    exclude: void 0,
    filter: {
      data: {
        id: data.user_id?.toString() || void 0,
        email: data.email || void 0,
        username: data.username || void 0
      },
      meta: {
        id: {
          operator: "=",
          type: "int",
          columnType: "standard"
        },
        email: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        username: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort: void 0,
    page: void 0,
    per_page: void 0
  });
  const user = await User.getSingle(client, SelectQuery);
  return user;
};
var get_single_query_default = getSingleQuery;

// src/services/users/index.ts
var users_default = {
  updateRoles: update_roles_default,
  getPermissions: get_permissions_default,
  getSingle: get_single_default3,
  registerSingle: register_single_default,
  checkIfUserExists: check_if_user_exists_default,
  deleteSingle: delete_single_default3,
  getMultiple: get_multiple_default2,
  updateSingle: update_single_default2,
  getSingleQuery: get_single_query_default
};

// src/services/auth/login.ts
var login = async (client, data) => {
  const user = await service_default(
    users_default.getSingleQuery,
    false,
    client
  )({
    username: data.username
  });
  if (!user || !user.password) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The username or password you entered is incorrect.",
      status: 500
    });
  }
  const passwordValid = await auth_default.validatePassword({
    hashedPassword: user.password,
    password: data.password
  });
  if (!passwordValid) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The username or password you entered is incorrect.",
      status: 500
    });
  }
  return await service_default(
    users_default.getSingle,
    false,
    client
  )({
    user_id: user.id
  });
};
var login_default = login;

// src/services/auth/validate-password.ts
import argon23 from "argon2";
var validatePassword = async (data) => {
  return await argon23.verify(data.hashedPassword, data.password);
};
var validate_password_default = validatePassword;

// src/services/auth/send-reset-password.ts
import { add } from "date-fns";

// src/services/user-tokens/create-single.ts
import crypto2 from "crypto";

// src/db/models/UserToken.ts
var UserToken = class {
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
      values: [data.user_id, data.token_type, data.token, data.expiry_date]
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
      values: [data.token, data.token_type]
    });
    return userToken.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const userToken = await client.query({
      text: `
            DELETE FROM lucid_user_tokens
            WHERE id = $1
        `,
      values: [data.id]
    });
    return userToken.rows[0];
  };
  static removeExpiredTokens = async (client) => {
    const userToken = await client.query({
      text: `
            DELETE FROM lucid_user_tokens
            WHERE expiry_date < NOW()
        `
    });
    return userToken.rows;
  };
};

// src/services/user-tokens/create-single.ts
var createSingle2 = async (client, data) => {
  const token = crypto2.randomBytes(32).toString("hex");
  const userToken = await UserToken.createSingle(client, {
    user_id: data.user_id,
    token_type: data.token_type,
    token,
    expiry_date: data.expiry_date
  });
  if (!userToken) {
    throw new LucidError({
      type: "basic",
      name: "Error creating user token",
      message: "There was an error creating the user token.",
      status: 500
    });
  }
  return userToken;
};
var create_single_default2 = createSingle2;

// src/services/user-tokens/get-single.ts
var getSingle4 = async (client, data) => {
  const userToken = await UserToken.getByToken(client, {
    token_type: data.token_type,
    token: data.token
  });
  if (!userToken) {
    throw new LucidError({
      type: "basic",
      name: "Invalid token",
      message: "The provided token is either invalid or expired. Please try again.",
      status: 400
    });
  }
  return userToken;
};
var get_single_default4 = getSingle4;

// src/services/user-tokens/delete-single.ts
var deleteSingle4 = async (client, data) => {
  const userToken = await UserToken.deleteSingle(client, {
    id: data.id
  });
  return userToken;
};
var delete_single_default4 = deleteSingle4;

// src/services/user-tokens/index.ts
var user_tokens_default = {
  createSingle: create_single_default2,
  getSingle: get_single_default4,
  deleteSingle: delete_single_default4
};

// src/db/models/Email.ts
var Email = class {
  static createSingle = async (client, data) => {
    const {
      from_address,
      from_name,
      to_address,
      subject,
      cc,
      bcc,
      template,
      delivery_status,
      data: templateData
    } = data;
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "from_address",
        "from_name",
        "to_address",
        "subject",
        "cc",
        "bcc",
        "template",
        "data",
        "delivery_status"
      ],
      values: [
        from_address,
        from_name,
        to_address,
        subject,
        cc,
        bcc,
        template,
        templateData,
        delivery_status
      ]
    });
    const email = await client.query({
      text: `INSERT INTO lucid_emails (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return email.rows[0];
  };
  static getMultiple = async (client, query_instance) => {
    const emails = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_emails ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT  COUNT(DISTINCT lucid_emails.id) FROM lucid_emails ${query_instance.query.where}`,
      values: query_instance.countValues
    });
    const data = await Promise.all([emails, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static getSingle = async (client, data) => {
    const email = await client.query({
      text: `SELECT
          *
        FROM
          lucid_emails
        WHERE
          id = $1`,
      values: [data.id]
    });
    return email.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const email = await client.query({
      text: `DELETE FROM
          lucid_emails
        WHERE
          id = $1
        RETURNING *`,
      values: [data.id]
    });
    return email.rows[0];
  };
  static updateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["from_address", "from_name", "delivery_status"],
      values: [data.from_address, data.from_name, data.delivery_status],
      conditional: {
        hasValues: {
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    const email = await client.query({
      text: `UPDATE 
        lucid_emails 
        SET 
          ${columns.formatted.update} 
        WHERE 
          id = $${aliases.value.length + 1}
        RETURNING *`,
      values: [...values.value, data.id]
    });
    return email.rows[0];
  };
};

// src/services/email/delete-single.ts
var deleteSingle5 = async (client, data) => {
  const email = await Email.deleteSingle(client, {
    id: data.id
  });
  if (email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404
    });
  }
  return email;
};
var delete_single_default5 = deleteSingle5;

// src/services/email/get-multiple.ts
var getMultiple3 = async (client, data) => {
  const { filter, sort, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "from_address",
      "from_name",
      "to_address",
      "subject",
      "cc",
      "bcc",
      "template",
      "data",
      "delivery_status",
      "created_at",
      "updated_at"
    ],
    filter: {
      data: filter,
      meta: {
        to_address: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        subject: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        delivery_status: {
          operator: "ILIKE",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const emails = await Email.getMultiple(client, SelectQuery);
  return emails;
};
var get_multiple_default3 = getMultiple3;

// src/services/email/get-single.ts
var getSingle5 = async (client, data) => {
  const email = await Email.getSingle(client, {
    id: data.id
  });
  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404
    });
  }
  const html = await email_default.renderTemplate(
    email.template,
    email.data || {}
  );
  email.html = html;
  return email;
};
var get_single_default5 = getSingle5;

// src/services/email/resend-single.ts
var resendSingle = async (client, data) => {
  const email = await service_default(
    email_default.getSingle,
    false,
    client
  )({
    id: data.id
  });
  const status = await email_default.sendEmailInternal(client, {
    template: email.template,
    params: {
      data: email.data || {},
      options: {
        to: email.to_address || "",
        subject: email.subject || "",
        from: email.from_address || void 0,
        fromName: email.from_name || void 0,
        cc: email.cc || void 0,
        bcc: email.bcc || void 0,
        replyTo: email.from_address || void 0
      }
    },
    id: data.id
  });
  const updatedEmail = await service_default(
    email_default.getSingle,
    false,
    client
  )({
    id: data.id
  });
  return {
    status,
    email: updatedEmail
  };
};
var resend_single_default = resendSingle;

// src/services/email/create-single.ts
var createSingle3 = async (client, data) => {
  const email = await Email.createSingle(client, data);
  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Error saving email",
      status: 500
    });
  }
  return email;
};
var create_single_default3 = createSingle3;

// src/services/email/update-single.ts
var updatteSingle = async (client, data) => {
  const email = await Email.updateSingle(client, {
    id: data.id,
    from_address: data.data.from_address,
    from_name: data.data.from_name,
    delivery_status: data.data.delivery_status
  });
  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Error updating email",
      message: "There was an error updating the email",
      status: 500
    });
  }
  return email;
};
var update_single_default3 = updatteSingle;

// src/services/email/render-template.ts
import fs3 from "fs-extra";
import Handlebars from "handlebars";
import mjml2html from "mjml";
import path3 from "path";
var currentDir2 = get_dirname_default(import.meta.url);
var getTemplateData = async (template) => {
  const templatePath = path3.join(
    currentDir2,
    `../../../templates/${template}.mjml`
  );
  if (await fs3.pathExists(templatePath)) {
    return fs3.readFile(templatePath, "utf-8");
  }
  if (Config.email?.templateDir) {
    const templatePath2 = `${Config.email.templateDir}/${template}.mjml`;
    if (await fs3.pathExists(templatePath2)) {
      return fs3.readFile(templatePath2, "utf-8");
    }
  }
  throw new Error(`Template ${template} not found`);
};
var renderTemplate = async (template, data) => {
  const mjmlFile = await getTemplateData(template);
  const mjmlTemplate = Handlebars.compile(mjmlFile);
  const mjml = mjmlTemplate(data);
  const htmlOutput = mjml2html(mjml);
  return htmlOutput.html;
};
var render_template_default = renderTemplate;

// src/services/email/send-email.ts
import nodemailer from "nodemailer";
var createEmailRow = async (client, data) => {
  await service_default(
    email_default.createSingle,
    false,
    client
  )({
    from_address: data.options.from,
    from_name: data.options.fromName,
    to_address: data.options.to,
    subject: data.options.subject,
    cc: data.options.cc,
    bcc: data.options.bcc,
    template: data.template,
    data: data.data,
    delivery_status: data.delivery_status
  });
};
var sendEmailAction = async (template, params) => {
  let fromName = params.options?.fromName || Config.email?.from?.name;
  let from = params.options?.from || Config.email?.from?.email;
  const mailOptions = {
    from,
    fromName,
    to: params.options?.to,
    subject: params.options?.subject,
    cc: params.options?.cc,
    bcc: params.options?.bcc,
    replyTo: params.options?.replyTo
  };
  try {
    const html = await email_default.renderTemplate(template, params.data);
    const smptConfig = Config.email?.smtp;
    if (!smptConfig) {
      throw new Error(
        "SMTP config not found. The email has been stored in the database and can be sent manually."
      );
    }
    const transporter = nodemailer.createTransport({
      host: smptConfig.host,
      port: smptConfig.port,
      secure: smptConfig.secure,
      auth: {
        user: smptConfig.user,
        pass: smptConfig.pass
      }
    });
    await transporter.sendMail({
      from: `${fromName} <${from}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      cc: mailOptions.cc,
      bcc: mailOptions.bcc,
      replyTo: mailOptions.replyTo,
      html
    });
    return {
      success: true,
      message: "Email sent successfully.",
      options: mailOptions
    };
  } catch (error) {
    const err = error;
    return {
      success: false,
      message: err.message || "Failed to send email.",
      options: mailOptions
    };
  }
};
var sendEmailExternal = async (template, params, track) => {
  const client = await getDBClient();
  const result = await sendEmailAction(template, params);
  if (track) {
    try {
      await client.query("BEGIN");
      await createEmailRow(client, {
        template,
        options: result.options,
        delivery_status: result.success ? "sent" : "failed",
        data: params.data
      });
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  return {
    success: result.success,
    message: result.message
  };
};
var sendEmailInternal = async (client, data) => {
  const result = await sendEmailAction(data.template, data.params);
  if (data.track) {
    if (!data.id) {
      await createEmailRow(client, {
        template: data.template,
        options: result.options,
        delivery_status: result.success ? "sent" : "failed",
        data: data.params.data
      });
    } else {
      await service_default(
        email_default.updateSingle,
        false,
        client
      )({
        id: data.id,
        data: {
          from_address: result.options.from,
          from_name: result.options.fromName,
          delivery_status: result.success ? "sent" : "failed"
        }
      });
    }
  }
  return {
    success: result.success,
    message: result.message
  };
};

// src/services/email/index.ts
var email_default = {
  deleteSingle: delete_single_default5,
  getMultiple: get_multiple_default3,
  getSingle: get_single_default5,
  resendSingle: resend_single_default,
  createSingle: create_single_default3,
  updateSingle: update_single_default3,
  renderTemplate: render_template_default,
  sendEmailExternal,
  sendEmailInternal
};

// src/services/auth/send-reset-password.ts
var sendResetPassword = async (client, data) => {
  const successMessage = `If an account with that email exists, we've sent you an email with instructions to reset your password.`;
  const user = await service_default(
    users_default.getSingleQuery,
    false,
    client
  )({
    email: data.email
  });
  if (!user) {
    return {
      message: successMessage
    };
  }
  const expiryDate = add(/* @__PURE__ */ new Date(), { hours: 1 }).toISOString();
  const userToken = await service_default(
    user_tokens_default.createSingle,
    false,
    client
  )({
    user_id: user.id,
    token_type: "password_reset",
    expiry_date: expiryDate
  });
  await service_default(
    email_default.sendEmailInternal,
    false,
    client
  )({
    template: "reset-password",
    params: {
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        url: `${Config.host}${constants_default.locations.resetPassword}?token=${userToken.token}`
      },
      options: {
        to: user.email,
        subject: "Reset your password"
      }
    }
  });
  return {
    message: successMessage
  };
};
var send_reset_password_default = sendResetPassword;

// src/services/auth/verify-reset-password.ts
var verifyResetPassword = async (client, data) => {
  await user_tokens_default.getSingle(client, {
    token_type: "password_reset",
    token: data.token
  });
  return {};
};
var verify_reset_password_default = verifyResetPassword;

// src/services/auth/reset-password.ts
var resetPassword = async (client, data) => {
  const successMessage = `You have successfully reset your password. Please login with your new password.`;
  const userToken = await service_default(
    user_tokens_default.getSingle,
    false,
    client
  )({
    token_type: "password_reset",
    token: data.token
  });
  const user = await service_default(
    users_default.updateSingle,
    false,
    client
  )({
    user_id: userToken.user_id,
    password: data.password
  });
  await service_default(
    user_tokens_default.deleteSingle,
    false,
    client
  )({
    id: userToken.id
  });
  await service_default(
    email_default.sendEmailInternal,
    false,
    client
  )({
    template: "password-reset",
    params: {
      data: {
        first_name: user.first_name,
        last_name: user.last_name
      },
      options: {
        to: user.email,
        subject: "Your password has been reset"
      }
    }
  });
  return {
    message: successMessage
  };
};
var reset_password_default = resetPassword;

// src/services/auth/index.ts
var auth_default = {
  csrf: csrf_default,
  jwt: jwt_default,
  login: login_default,
  validatePassword: validate_password_default,
  sendResetPassword: send_reset_password_default,
  verifyResetPassword: verify_reset_password_default,
  resetPassword: reset_password_default
};

// src/middleware/authenticate.ts
var authenticate = async (req, res, next) => {
  try {
    const authenticateJWT = auth_default.jwt.verifyJWT(req);
    if (!authenticateJWT.sucess || !authenticateJWT.data) {
      throw new LucidError({
        type: "authorisation",
        message: "You are not authorised to perform this action"
      });
    }
    req.auth = authenticateJWT.data;
    return next();
  } catch (error) {
    return next(error);
  }
};
var authenticate_default = authenticate;

// src/middleware/authorise-csrf.ts
var authoriseCSRF = async (req, res, next) => {
  try {
    const verifyCSRF = auth_default.csrf.verifyCSRFToken(req);
    if (!verifyCSRF) {
      throw new LucidError({
        type: "forbidden",
        code: "csrf",
        message: "You are not authorised to perform this action"
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
var authorise_csrf_default = authoriseCSRF;

// src/middleware/paginated.ts
var paginated = async (req, res, next) => {
  try {
    if (!req.query.page) {
      req.query.page = constants_default.pagination.page;
    }
    if (!req.query.per_page) {
      req.query.per_page = constants_default.pagination.perPage;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
var paginated_default = paginated;

// src/middleware/validate-environment.ts
var validateEnvironment = async (req, res, next) => {
  try {
    const environment = req.headers["lucid-environment"];
    if (!environment) {
      throw new LucidError({
        type: "basic",
        name: "Validation Error",
        message: "You must set the Lucid Environment header.",
        status: 400,
        errors: modelErrors({
          "lucid-environment": {
            code: "required",
            message: "You must set the Lucid Environment header."
          }
        })
      });
    }
    const environmentConfig = await service_default(
      environments_default.getAll,
      false
    )();
    const findEnv = environmentConfig.find((env) => env.key === environment);
    if (!findEnv) {
      throw new LucidError({
        type: "basic",
        name: "Validation Error",
        message: "You must set a valid Lucid Environment header.",
        status: 400,
        errors: modelErrors({
          "lucid-environment": {
            code: "required",
            message: "You must set a valid Lucid Environment header."
          }
        })
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
var validate_environment_default = validateEnvironment;

// src/middleware/permissions.ts
var throwPermissionError = () => {
  throw new LucidError({
    type: "basic",
    name: "Permission Error",
    message: "You do not have permission to access this resource",
    status: 403
  });
};
var permissions = (permissions2) => async (req, res, next) => {
  try {
    const environment = req.headers["lucid-environment"];
    const user = await service_default(
      users_default.getSingle,
      false
    )({
      user_id: req.auth.id
    });
    if (user.super_admin)
      return next();
    if (user.permissions === void 0)
      throwPermissionError();
    if (permissions2.global) {
      permissions2.global.forEach((permission) => {
        if (!user.permissions?.global.includes(permission))
          throwPermissionError();
      });
    }
    if (permissions2.environments) {
      if (!environment)
        throwPermissionError();
      const environmentPermissions = user.permissions?.environments?.find(
        (env) => env.key === environment
      );
      if (!environmentPermissions)
        throwPermissionError();
      permissions2.environments.forEach((permission) => {
        if (!environmentPermissions?.permissions.includes(permission))
          throwPermissionError();
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
var permissions_default = permissions;

// src/middleware/file-upload.ts
import expressFileUpload from "express-fileupload";
var fileUpload = async (req, res, next) => {
  const options = {
    debug: Config.mode === "development"
  };
  expressFileUpload(options)(req, res, next);
};
var file_upload_default = fileUpload;

// src/utils/app/route.ts
var route = (router20, props) => {
  const { method, path: path7, controller } = props;
  const middleware = [];
  if (props.middleware?.authenticate) {
    middleware.push(authenticate_default);
  }
  if (props.middleware?.authoriseCSRF) {
    middleware.push(authorise_csrf_default);
  }
  if (props.middleware?.fileUpload) {
    middleware.push(file_upload_default);
  }
  if (props.schema?.params || props.schema?.body || props.schema?.query) {
    middleware.push(
      validate_default(
        z3.object({
          params: props.schema?.params ?? z3.object({}),
          query: props.schema?.query ?? z3.object({}),
          body: props.schema?.body ?? z3.object({})
        })
      )
    );
  }
  if (props.middleware?.paginated) {
    middleware.push(paginated_default);
  }
  if (props.middleware?.validateEnvironment) {
    middleware.push(validate_environment_default);
  }
  if (props.permissions) {
    middleware.push(permissions_default(props.permissions));
  }
  switch (method) {
    case "get":
      router20.get(path7, middleware, controller);
      break;
    case "post":
      router20.post(path7, middleware, controller);
      break;
    case "put":
      router20.put(path7, middleware, controller);
      break;
    case "delete":
      router20.delete(path7, middleware, controller);
      break;
    case "patch":
      router20.patch(path7, middleware, controller);
      break;
    default:
      break;
  }
  return router20;
};
var route_default = route;

// src/utils/app/build-response.ts
var getPath = (req) => {
  const originalUrl = req.originalUrl;
  return `${Config.host}${originalUrl}`.split("?")[0];
};
var buildMetaLinks = (req, params) => {
  const links = [];
  if (!params.pagination)
    return links;
  const { page, per_page, count } = params.pagination;
  const totalPages = Math.ceil(count / Number(per_page));
  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  for (let i = 0; i < totalPages; i++) {
    if (i !== 0)
      url.searchParams.set("page", String(i + 1));
    else
      url.searchParams.delete("page");
    links.push({
      active: page === String(i + 1),
      label: String(i + 1),
      url: url.toString(),
      page: i + 1
    });
  }
  return links;
};
var buildLinks = (req, params) => {
  if (!params.pagination)
    return void 0;
  const { page, per_page, count } = params.pagination;
  const totalPages = Math.ceil(count / Number(per_page));
  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  const links = {
    first: null,
    last: null,
    next: null,
    prev: null
  };
  url.searchParams.delete("page");
  links.first = url.toString();
  if (page !== String(totalPages))
    url.searchParams.set("page", String(totalPages));
  links.last = url.toString();
  if (page !== String(totalPages)) {
    url.searchParams.set("page", String(Number(page) + 1));
    links.next = url.toString();
  } else {
    links.next = null;
  }
  if (page !== "1") {
    url.searchParams.set("page", String(Number(page) - 1));
    links.prev = url.toString();
  } else {
    links.prev = null;
  }
  return links;
};
var buildResponse = (req, params) => {
  let meta = {
    path: getPath(req),
    links: buildMetaLinks(req, params),
    current_page: Number(params.pagination?.page) || null,
    per_page: Number(params.pagination?.per_page) || null,
    total: Number(params.pagination?.count) || null,
    last_page: params.pagination ? Math.ceil(
      params.pagination?.count / Number(params.pagination.per_page)
    ) || Number(params.pagination?.page) || null : null
  };
  let links = buildLinks(req, params);
  return {
    data: params.data || null,
    meta,
    links
  };
};
var build_response_default = buildResponse;

// src/schemas/auth.ts
import z4 from "zod";
var getAuthenticatedUserBody = z4.object({});
var getAuthenticatedUserQuery = z4.object({});
var getAuthenticatedUserParams = z4.object({});
var getCSRFBody = z4.object({});
var getCSRFQuery = z4.object({});
var getCSRFParams = z4.object({});
var loginBody = z4.object({
  username: z4.string().min(3),
  password: z4.string().min(8)
});
var loginQuery = z4.object({});
var loginParams = z4.object({});
var logoutBody = z4.object({});
var logoutQuery = z4.object({});
var logoutParams = z4.object({});
var sendResetPasswordBody = z4.object({
  email: z4.string().email()
});
var sendResetPasswordQuery = z4.object({});
var sendResetPasswordParams = z4.object({});
var verifyResetPasswordBody = z4.object({});
var verifyResetPasswordQuery = z4.object({});
var verifyResetPasswordParams = z4.object({
  token: z4.string()
});
var resetPasswordBody = z4.object({
  password: z4.string().min(8),
  password_confirmation: z4.string().min(8)
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords must match",
  path: ["password_confirmation"]
});
var resetPasswordQuery = z4.object({});
var resetPasswordParams = z4.object({
  token: z4.string()
});
var auth_default2 = {
  getAuthenticatedUser: {
    body: getAuthenticatedUserBody,
    query: getAuthenticatedUserQuery,
    params: getAuthenticatedUserParams
  },
  getCSRF: {
    body: getCSRFBody,
    query: getCSRFQuery,
    params: getCSRFParams
  },
  login: {
    body: loginBody,
    query: loginQuery,
    params: loginParams
  },
  logout: {
    body: logoutBody,
    query: logoutQuery,
    params: logoutParams
  },
  sendResetPassword: {
    body: sendResetPasswordBody,
    query: sendResetPasswordQuery,
    params: sendResetPasswordParams
  },
  verifyResetPassword: {
    body: verifyResetPasswordBody,
    query: verifyResetPasswordQuery,
    params: verifyResetPasswordParams
  },
  resetPassword: {
    body: resetPasswordBody,
    query: resetPasswordQuery,
    params: resetPasswordParams
  }
};

// src/controllers/auth/login.ts
var loginController = async (req, res, next) => {
  try {
    const user = await service_default(
      auth_default.login,
      false
    )({
      username: req.body.username,
      password: req.body.password
    });
    auth_default.jwt.generateJWT(res, user);
    res.status(200).json(build_response_default(req, { data: user }));
  } catch (error) {
    next(error);
  }
};
var login_default2 = {
  schema: auth_default2.login,
  controller: loginController
};

// src/controllers/auth/logout.ts
var logout = async (req, res, next) => {
  try {
    auth_default.jwt.clearJWT(res);
    auth_default.csrf.clearCSRFToken(res);
    res.status(200).json(
      build_response_default(req, {
        data: {
          message: "Logged out successfully"
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var logout_default = {
  schema: auth_default2.logout,
  controller: logout
};

// src/controllers/auth/get-authenticated-user.ts
var getAuthenticatedUserController = async (req, res, next) => {
  try {
    const user = await service_default(
      users_default.getSingle,
      false
    )({
      user_id: req.auth.id
    });
    res.status(200).json(
      build_response_default(req, {
        data: user
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_authenticated_user_default = {
  schema: auth_default2.getAuthenticatedUser,
  controller: getAuthenticatedUserController
};

// src/controllers/auth/get-csrf.ts
var getCSRFController = async (req, res, next) => {
  try {
    const token = auth_default.csrf.generateCSRFToken(res);
    res.status(200).json(
      build_response_default(req, {
        data: {
          _csrf: token
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_csrf_default = {
  schema: auth_default2.getCSRF,
  controller: getCSRFController
};

// src/controllers/auth/send-reset-password.ts
var sendResetPasswordController = async (req, res, next) => {
  try {
    const resetPassword2 = await service_default(
      auth_default.sendResetPassword,
      false
    )({
      email: req.body.email
    });
    res.status(200).json(
      build_response_default(req, {
        data: resetPassword2
      })
    );
  } catch (error) {
    next(error);
  }
};
var send_reset_password_default2 = {
  schema: auth_default2.sendResetPassword,
  controller: sendResetPasswordController
};

// src/controllers/auth/verify-reset-password.ts
var verifyResetPasswordController = async (req, res, next) => {
  try {
    const verifyResetPassword2 = await service_default(
      auth_default.verifyResetPassword,
      false
    )({
      token: req.params.token
    });
    res.status(200).json(
      build_response_default(req, {
        data: verifyResetPassword2
      })
    );
  } catch (error) {
    next(error);
  }
};
var verify_reset_password_default2 = {
  schema: auth_default2.verifyResetPassword,
  controller: verifyResetPasswordController
};

// src/controllers/auth/reset-password.ts
var resetPasswordController = async (req, res, next) => {
  try {
    const resetPassword2 = await service_default(
      auth_default.resetPassword,
      true
    )({
      token: req.params.token,
      password: req.body.password
    });
    res.status(200).json(
      build_response_default(req, {
        data: resetPassword2
      })
    );
  } catch (error) {
    next(error);
  }
};
var reset_password_default2 = {
  schema: auth_default2.resetPassword,
  controller: resetPasswordController
};

// src/routes/v1/auth.routes.ts
var router = Router();
route_default(router, {
  method: "post",
  path: "/login",
  middleware: {
    authoriseCSRF: true
  },
  schema: login_default2.schema,
  controller: login_default2.controller
});
route_default(router, {
  method: "post",
  path: "/logout",
  schema: logout_default.schema,
  controller: logout_default.controller
});
route_default(router, {
  method: "get",
  path: "/me",
  middleware: {
    authenticate: true
  },
  schema: get_authenticated_user_default.schema,
  controller: get_authenticated_user_default.controller
});
route_default(router, {
  method: "get",
  path: "/csrf",
  schema: get_csrf_default.schema,
  controller: get_csrf_default.controller
});
route_default(router, {
  method: "post",
  path: "/reset-password",
  middleware: {
    authoriseCSRF: true
  },
  schema: send_reset_password_default2.schema,
  controller: send_reset_password_default2.controller
});
route_default(router, {
  method: "get",
  path: "/reset-password/:token",
  schema: verify_reset_password_default2.schema,
  controller: verify_reset_password_default2.controller
});
route_default(router, {
  method: "patch",
  path: "/reset-password/:token",
  middleware: {
    authoriseCSRF: true
  },
  schema: reset_password_default2.schema,
  controller: reset_password_default2.controller
});
var auth_routes_default = router;

// src/routes/v1/health.routes.ts
import { Router as Router2 } from "express";

// src/schemas/health.ts
import z5 from "zod";
var getHealthBody = z5.object({});
var getHealthQuery = z5.object({});
var getHealthParams = z5.object({});
var health_default = {
  getHealth: {
    body: getHealthBody,
    query: getHealthQuery,
    params: getHealthParams
  }
};

// src/services/health/get-health.ts
var getHealth = async (data) => {
  return {
    api: "ok",
    db: "ok"
  };
};
var get_health_default = getHealth;

// src/services/health/index.ts
var health_default2 = {
  getHealth: get_health_default
};

// src/controllers/health/get-health.ts
var getHealthController = async (req, res, next) => {
  try {
    const healthRes = await health_default2.getHealth({});
    res.status(200).json(
      build_response_default(req, {
        data: healthRes
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_health_default2 = {
  schema: health_default.getHealth,
  controller: getHealthController
};

// src/routes/v1/health.routes.ts
var router2 = Router2();
route_default(router2, {
  method: "get",
  path: "/",
  schema: get_health_default2.schema,
  controller: get_health_default2.controller
});
var health_routes_default = router2;

// src/routes/v1/categories.routes.ts
import { Router as Router3 } from "express";

// src/schemas/categories.ts
import z6 from "zod";
var createSingleBody = z6.object({
  collection_key: z6.string(),
  title: z6.string(),
  slug: z6.string().min(2).toLowerCase(),
  description: z6.string().optional()
});
var createSingleQuery = z6.object({});
var createSingleParams = z6.object({});
var deleteSingleBody = z6.object({});
var deleteSingleQuery = z6.object({});
var deleteSingleParams = z6.object({
  id: z6.string()
});
var getMultipleBody = z6.object({});
var getMultipleQuery = z6.object({
  filter: z6.object({
    collection_key: z6.union([z6.string(), z6.array(z6.string())]).optional(),
    title: z6.string().optional()
  }).optional(),
  sort: z6.array(
    z6.object({
      key: z6.enum(["title", "created_at"]),
      value: z6.enum(["asc", "desc"])
    })
  ).optional(),
  page: z6.string().optional(),
  per_page: z6.string().optional()
});
var getMultipleParams = z6.object({});
var getSingleBody = z6.object({});
var getSingleQuery2 = z6.object({});
var getSingleParams = z6.object({
  id: z6.string()
});
var updateSingleBody = z6.object({
  title: z6.string().optional(),
  slug: z6.string().min(2).toLowerCase().optional(),
  description: z6.string().optional()
});
var updateSingleQuery = z6.object({});
var updateSingleParams = z6.object({
  id: z6.string()
});
var categories_default = {
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams
  },
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams
  },
  getMultiple: {
    body: getMultipleBody,
    query: getMultipleQuery,
    params: getMultipleParams
  },
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery2,
    params: getSingleParams
  },
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams
  }
};

// src/db/models/Category.ts
var Category = class {
  static getMultiple = async (client, query_instance) => {
    const categories = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_categories ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT COUNT(*) FROM lucid_categories ${query_instance.query.where}`,
      values: query_instance.countValues
    });
    const data = await Promise.all([categories, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static getSingle = async (client, data) => {
    const category = await client.query({
      text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
      values: [data.id, data.environment_key]
    });
    return category.rows[0];
  };
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "environment_key",
        "collection_key",
        "title",
        "slug",
        "description"
      ],
      values: [
        data.environment_key,
        data.collection_key,
        data.title,
        data.slug,
        data.description
      ]
    });
    const res = await client.query({
      text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return res.rows[0];
  };
  static updateSingle = async (client, data) => {
    const category = await client.query({
      name: "update-category",
      text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
      values: [
        data.title,
        data.slug,
        data.description,
        data.id,
        data.environment_key
      ]
    });
    return category.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const category = await client.query({
      name: "delete-category",
      text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [data.id, data.environment_key]
    });
    return category.rows[0];
  };
  static isSlugUniqueInCollection = async (client, data) => {
    const values = [
      data.collection_key,
      data.slug,
      data.environment_key
    ];
    if (data.ignore_id) {
      values.push(data.ignore_id);
    }
    const res = await client.query({
      text: `SELECT * FROM lucid_categories WHERE collection_key = $1 AND slug = $2 AND environment_key = $3 ${data.ignore_id ? "AND id != $4" : ""}`,
      values
    });
    const category = res.rows[0];
    if (category) {
      return false;
    }
    return true;
  };
};

// src/utils/format/format-collections.ts
var formatCollection = (instance) => {
  return {
    key: instance.key,
    title: instance.config.title,
    singular: instance.config.singular,
    description: instance.config.description || null,
    type: instance.config.type,
    bricks: instance.config.bricks
  };
};
var format_collections_default = formatCollection;

// src/services/brick-config/get-all.ts
var getAll3 = async (client, data) => {
  const environment_key = data.query.filter?.environment_key;
  const collection_key = data.query.filter?.collection_key;
  let bricks = [];
  if (collection_key && environment_key) {
    const environment = await service_default(
      environments_default.getSingle,
      false,
      client
    )({
      key: environment_key
    });
    const collection = await service_default(
      collections_default.getSingle,
      false,
      client
    )({
      collection_key,
      environment_key,
      environment
    });
    const allowedBricks = brick_config_default.getAllAllowedBricks({
      collection,
      environment
    });
    bricks = allowedBricks.bricks;
  } else {
    const builderInstances = brick_config_default.getBrickConfig();
    for (const instance of builderInstances) {
      const brick = brick_config_default.getBrickData(instance, {
        include: ["fields"]
      });
      bricks.push(brick);
    }
  }
  if (!data.query.include?.includes("fields")) {
    bricks.forEach((brick) => {
      delete brick.fields;
    });
  }
  return bricks;
};
var get_all_default3 = getAll3;

// src/services/brick-config/get-single.ts
var getSingle6 = async (client, data) => {
  const builderInstances = brick_config_default.getBrickConfig();
  const instance = builderInstances.find((b) => b.key === data.brick_key);
  if (!instance) {
    throw new LucidError({
      type: "basic",
      name: "Brick not found",
      message: "We could not find the brick you are looking for.",
      status: 404
    });
  }
  const brick = brick_config_default.getBrickData(instance, {
    include: ["fields"]
  });
  if (!brick) {
    throw new LucidError({
      type: "basic",
      name: "Brick not found",
      message: "We could not find the brick you are looking for.",
      status: 404
    });
  }
  return brick;
};
var get_single_default6 = getSingle6;

// src/services/brick-config/get-brick-config.ts
var getBrickConfig = () => {
  const brickInstances = Config.bricks;
  if (!brickInstances) {
    return [];
  } else {
    return brickInstances;
  }
};
var get_brick_config_default = getBrickConfig;

// src/services/brick-config/is-brick-allowed.ts
var isBrickAllowed = (data) => {
  let allowed = false;
  const builderInstances = brick_config_default.getBrickConfig();
  const instance = builderInstances.find((b) => b.key === data.key);
  const envAssigned = (data.environment.assigned_bricks || [])?.includes(
    data.key
  );
  let builderBrick;
  let fixedBrick;
  if (!data.type) {
    builderBrick = data.collection.bricks?.find(
      (b) => b.key === data.key && b.type === "builder"
    );
    fixedBrick = data.collection.bricks?.find(
      (b) => b.key === data.key && b.type === "fixed"
    );
  } else {
    const brickF = data.collection.bricks?.find(
      (b) => b.key === data.key && b.type === data.type
    );
    if (data.type === "builder")
      builderBrick = brickF;
    if (data.type === "fixed")
      fixedBrick = brickF;
  }
  if (instance && envAssigned && (builderBrick || fixedBrick))
    allowed = true;
  let brick;
  if (instance) {
    brick = brick_config_default.getBrickData(instance, {
      include: ["fields"]
    });
  }
  return {
    allowed,
    brick,
    collectionBrick: {
      builder: builderBrick,
      fixed: fixedBrick
    }
  };
};
var is_brick_allowed_default = isBrickAllowed;

// src/services/brick-config/get-brick-data.ts
var getBrickData = (instance, query) => {
  const data = {
    key: instance.key,
    title: instance.title,
    preview: instance.config?.preview
  };
  if (!query)
    return data;
  if (query.include?.includes("fields"))
    data.fields = instance.fieldTree;
  return data;
};
var get_brick_data_default = getBrickData;

// src/services/brick-config/get-all-allowed-bricks.ts
var getAllAllowedBricks = (data) => {
  const allowedBricks = [];
  const allowedCollectionBricks = [];
  const brickConfigData = brick_config_default.getBrickConfig();
  for (const brick of brickConfigData) {
    const brickAllowed = brick_config_default.isBrickAllowed({
      key: brick.key,
      collection: data.collection,
      environment: data.environment
    });
    if (brickAllowed.allowed && brickAllowed.brick) {
      allowedBricks.push(brickAllowed.brick);
    }
    if (brickAllowed.allowed && brickAllowed.collectionBrick) {
      if (brickAllowed.collectionBrick.builder)
        allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
      if (brickAllowed.collectionBrick.fixed)
        allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
    }
  }
  return {
    bricks: allowedBricks,
    collectionBricks: allowedCollectionBricks
  };
};
var get_all_allowed_bricks_default = getAllAllowedBricks;

// src/services/brick-config/index.ts
var brick_config_default = {
  getAll: get_all_default3,
  getSingle: get_single_default6,
  getBrickConfig: get_brick_config_default,
  isBrickAllowed: is_brick_allowed_default,
  getBrickData: get_brick_data_default,
  getAllAllowedBricks: get_all_allowed_bricks_default
};

// src/services/collections/get-single.ts
var getSingle7 = async (client, data) => {
  const instances = Config.collections || [];
  if (!instances) {
    throw new LucidError({
      type: "basic",
      name: "Collection not found",
      message: `Collection with key "${data.collection_key}" under environment "${data.environment_key}" not found`,
      status: 404
    });
  }
  const collectionsF = instances.map(
    (collection2) => format_collections_default(collection2)
  );
  const environment = data.environment ? data.environment : await service_default(
    environments_default.getSingle,
    false,
    client
  )({
    key: data.environment_key
  });
  const assignedCollections = environment.assigned_collections || [];
  let collection;
  if (data.type) {
    collection = collectionsF.find((c) => {
      return c.key === data.collection_key && c.type === data.type && assignedCollections.includes(c.key);
    });
  } else {
    collection = collectionsF.find((c) => {
      return c.key === data.collection_key && assignedCollections.includes(c.key);
    });
  }
  if (!collection) {
    throw new LucidError({
      type: "basic",
      name: "Collection not found",
      message: `Collection with key "${data.collection_key}" and of type "${data.type}" under environment "${data.environment_key}" not found`,
      status: 404
    });
  }
  const collectionBricks = brick_config_default.getAllAllowedBricks({
    collection,
    environment
  });
  collection["bricks"] = collectionBricks.collectionBricks;
  return collection;
};
var get_single_default7 = getSingle7;

// src/services/collections/get-all.ts
var getAll4 = async (client, data) => {
  const instances = Config.collections || [];
  if (!instances)
    return [];
  let collectionsF = instances.map(
    (collection) => format_collections_default(collection)
  );
  let environment;
  if (data.query.filter?.environment_key) {
    environment = await service_default(
      environments_default.getSingle,
      false,
      client
    )({
      key: data.query.filter?.environment_key
    });
    collectionsF = collectionsF.filter(
      (collection) => environment?.assigned_collections.includes(collection.key)
    );
  }
  collectionsF = filterCollections(data.query.filter, collectionsF);
  collectionsF = collectionsF.map((collection) => {
    const collectionData = {
      key: collection.key,
      title: collection.title,
      singular: collection.singular,
      description: collection.description,
      type: collection.type
    };
    if (data.query.include?.includes("bricks") && environment) {
      const collectionBricks = brick_config_default.getAllAllowedBricks({
        collection,
        environment
      });
      collectionData.bricks = collectionBricks.collectionBricks;
    }
    return collectionData;
  });
  return collectionsF;
};
var filterCollections = (filter, collections) => {
  if (!filter)
    return collections;
  let filtered = [...collections];
  Object.keys(filter).forEach((f) => {
    switch (f) {
      case "type":
        filtered = filtered.filter(
          (collection) => collection.type === filter.type
        );
        break;
      default:
        break;
    }
  });
  return filtered;
};
var get_all_default4 = getAll4;

// src/services/collections/index.ts
var collections_default = {
  getSingle: get_single_default7,
  getAll: get_all_default4
};

// src/services/categories/create-single.ts
var createSingle4 = async (client, data) => {
  await service_default(
    collections_default.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    type: "pages",
    environment_key: data.environment_key
  });
  const isSlugUnique = await Category.isSlugUniqueInCollection(client, {
    collection_key: data.collection_key,
    slug: data.slug,
    environment_key: data.environment_key
  });
  if (!isSlugUnique) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Created",
      message: "Please provide a unique slug within this post type.",
      status: 400,
      errors: modelErrors({
        slug: {
          code: "not_unique",
          message: "Please provide a unique slug within this post type."
        }
      })
    });
  }
  const category = await Category.createSingle(client, data);
  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Created",
      message: "There was an error creating the category.",
      status: 500
    });
  }
  return category;
};
var create_single_default4 = createSingle4;

// src/services/categories/delete-single.ts
var deleteSingle6 = async (client, data) => {
  const category = await Category.deleteSingle(client, {
    environment_key: data.environment_key,
    id: data.id
  });
  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Deleted",
      message: "There was an error deleting the category.",
      status: 500
    });
  }
  return category;
};
var delete_single_default6 = deleteSingle6;

// src/services/categories/get-multiple.ts
var getMultiple4 = async (client, data) => {
  const { filter, sort, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",
      "title",
      "slug",
      "description",
      "created_at",
      "updated_at"
    ],
    exclude: void 0,
    filter: {
      data: {
        ...filter,
        environment_key: data.environment_key
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        title: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  return await Category.getMultiple(client, SelectQuery);
};
var get_multiple_default4 = getMultiple4;

// src/services/categories/get-single.ts
var getSingle8 = async (client, data) => {
  const category = await Category.getSingle(client, {
    environment_key: data.environment_key,
    id: data.id
  });
  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Found",
      message: "Category not found.",
      status: 404,
      errors: modelErrors({
        id: {
          code: "not_found",
          message: "Category not found."
        }
      })
    });
  }
  return category;
};
var get_single_default8 = getSingle8;

// src/services/categories/update-single.ts
var updateSingle3 = async (client, data) => {
  const currentCategory = await service_default(
    categories_default2.getSingle,
    false,
    client
  )({
    environment_key: data.environment_key,
    id: data.id
  });
  if (data.data.slug) {
    const isSlugUnique = await Category.isSlugUniqueInCollection(client, {
      collection_key: currentCategory.collection_key,
      slug: data.data.slug,
      environment_key: data.environment_key,
      ignore_id: data.id
    });
    if (!isSlugUnique) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Updated",
        message: "Please provide a unique slug within this post type.",
        status: 400,
        errors: modelErrors({
          slug: {
            code: "not_unique",
            message: "Please provide a unique slug within this post type."
          }
        })
      });
    }
  }
  return await Category.updateSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
    title: data.data.title,
    slug: data.data.slug,
    description: data.data.description
  });
};
var update_single_default4 = updateSingle3;

// src/services/categories/index.ts
var categories_default2 = {
  createSingle: create_single_default4,
  deleteSingle: delete_single_default6,
  getMultiple: get_multiple_default4,
  getSingle: get_single_default8,
  updateSingle: update_single_default4
};

// src/controllers/categories/get-multiple.ts
var getMultipleController = async (req, res, next) => {
  try {
    const categoriesRes = await service_default(
      categories_default2.getMultiple,
      false
    )({
      environment_key: req.headers["lucid-environment"],
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: categoriesRes.data,
        pagination: {
          count: categoriesRes.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default5 = {
  schema: categories_default.getMultiple,
  controller: getMultipleController
};

// src/controllers/categories/create-single.ts
var createSingleControllers = async (req, res, next) => {
  try {
    const category = await service_default(
      categories_default2.createSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      collection_key: req.body.collection_key,
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description
    });
    res.status(200).json(
      build_response_default(req, {
        data: category
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default5 = {
  schema: categories_default.createSingle,
  controller: createSingleControllers
};

// src/controllers/categories/update-single.ts
var updateSingleController = async (req, res, next) => {
  try {
    const category = await service_default(
      categories_default2.updateSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id),
      data: {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description
      }
    });
    res.status(200).json(
      build_response_default(req, {
        data: category
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default5 = {
  schema: categories_default.updateSingle,
  controller: updateSingleController
};

// src/controllers/categories/delete-single.ts
var deleteSingleController = async (req, res, next) => {
  try {
    const category = await service_default(
      categories_default2.deleteSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: category
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default7 = {
  schema: categories_default.deleteSingle,
  controller: deleteSingleController
};

// src/controllers/categories/get-single.ts
var getSingleController = async (req, res, next) => {
  try {
    const category = await service_default(
      categories_default2.getSingle,
      false
    )({
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: category
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default9 = {
  schema: categories_default.getSingle,
  controller: getSingleController
};

// src/routes/v1/categories.routes.ts
var router3 = Router3();
route_default(router3, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
    validateEnvironment: true
  },
  schema: get_multiple_default5.schema,
  controller: get_multiple_default5.controller
});
route_default(router3, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default9.schema,
  controller: get_single_default9.controller
});
route_default(router3, {
  method: "post",
  path: "/",
  permissions: {
    environments: ["create_category"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: create_single_default5.schema,
  controller: create_single_default5.controller
});
route_default(router3, {
  method: "patch",
  path: "/:id",
  permissions: {
    environments: ["update_category"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: update_single_default5.schema,
  controller: update_single_default5.controller
});
route_default(router3, {
  method: "delete",
  path: "/:id",
  permissions: {
    environments: ["delete_category"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: delete_single_default7.schema,
  controller: delete_single_default7.controller
});
var categories_routes_default = router3;

// src/routes/v1/pages.routes.ts
import { Router as Router4 } from "express";

// src/schemas/pages.ts
import z9 from "zod";

// src/schemas/bricks.ts
import z8 from "zod";

// src/builders/brick-builder/index.ts
import z7 from "zod";
import sanitizeHtml from "sanitize-html";

// src/builders/brick-builder/types.ts
var FieldTypesEnum = /* @__PURE__ */ ((FieldTypesEnum2) => {
  FieldTypesEnum2["Tab"] = "tab";
  FieldTypesEnum2["Text"] = "text";
  FieldTypesEnum2["Wysiwyg"] = "wysiwyg";
  FieldTypesEnum2["Media"] = "media";
  FieldTypesEnum2["Repeater"] = "repeater";
  FieldTypesEnum2["Number"] = "number";
  FieldTypesEnum2["Checkbox"] = "checkbox";
  FieldTypesEnum2["Select"] = "select";
  FieldTypesEnum2["Textarea"] = "textarea";
  FieldTypesEnum2["JSON"] = "json";
  FieldTypesEnum2["Colour"] = "colour";
  FieldTypesEnum2["Datetime"] = "datetime";
  FieldTypesEnum2["Pagelink"] = "pagelink";
  FieldTypesEnum2["Link"] = "link";
  return FieldTypesEnum2;
})(FieldTypesEnum || {});

// src/builders/brick-builder/index.ts
var baseCustomFieldSchema = z7.object({
  type: z7.string(),
  key: z7.string(),
  title: z7.string(),
  description: z7.string().optional(),
  placeholder: z7.string().optional(),
  // boolean or string
  default: z7.union([z7.boolean(), z7.string()]).optional(),
  options: z7.array(
    z7.object({
      label: z7.string(),
      value: z7.string()
    })
  ).optional(),
  validation: z7.object({
    zod: z7.any().optional(),
    required: z7.boolean().optional(),
    extensions: z7.array(z7.string()).optional(),
    width: z7.object({
      min: z7.number().optional(),
      max: z7.number().optional()
    }).optional(),
    height: z7.object({
      min: z7.number().optional(),
      max: z7.number().optional()
    }).optional()
  }).optional()
});
var customFieldSchemaObject = baseCustomFieldSchema.extend(
  {
    fields: z7.lazy(() => customFieldSchemaObject.array().optional())
  }
);
var ValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "ValidationError";
  }
};
var BrickBuilder = class {
  key;
  title;
  fields = /* @__PURE__ */ new Map();
  repeaterStack = [];
  maxRepeaterDepth = 5;
  config = {};
  constructor(key, config) {
    this.key = key;
    this.title = this.#keyToTitle(key);
    this.config = config || {};
  }
  // ------------------------------------
  addFields(BrickBuilder2) {
    const fields = BrickBuilder2.fields;
    fields.forEach((field) => {
      this.#checkKeyDuplication(field.key);
      this.fields.set(field.key, field);
    });
    return this;
  }
  endRepeater() {
    const key = this.repeaterStack.pop();
    if (!key) {
      throw new Error("No open repeater to end.");
    }
    const fields = Array.from(this.fields.values());
    let selectedRepeaterIndex = 0;
    let repeaterKey = "";
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type === "repeater" && fields[i].key === key) {
        selectedRepeaterIndex = i;
        repeaterKey = fields[i].key;
        break;
      }
    }
    if (!repeaterKey) {
      throw new Error(`Repeater with key "${key}" does not exist.`);
    }
    const fieldsAfterSelectedRepeater = fields.slice(selectedRepeaterIndex + 1);
    const repeater = this.fields.get(repeaterKey);
    if (repeater) {
      repeater.fields = fieldsAfterSelectedRepeater.filter(
        (field) => field.type !== "tab"
      );
      fieldsAfterSelectedRepeater.map((field) => {
        this.fields.delete(field.key);
      });
    }
    return this;
  }
  // ------------------------------------
  // Custom Fields
  addTab(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("tab", config);
    return this;
  }
  addText = (config) => {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("text", config);
    return this;
  };
  addWysiwyg(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("wysiwyg", config);
    return this;
  }
  addMedia(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("media", config);
    return this;
  }
  addRepeater(config) {
    this.#checkKeyDuplication(config.key);
    if (this.repeaterStack.length >= this.maxRepeaterDepth) {
      throw new Error(
        `Maximum repeater depth of ${this.maxRepeaterDepth} exceeded.`
      );
    }
    this.#addToFields("repeater", config);
    this.repeaterStack.push(config.key);
    return this;
  }
  addNumber(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("number", config);
    return this;
  }
  addCheckbox(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("checkbox", config);
    return this;
  }
  addSelect(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("select", config);
    return this;
  }
  addTextarea(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("textarea", config);
    return this;
  }
  addJSON(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("json", config);
    return this;
  }
  addColour(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("colour", config);
    return this;
  }
  addDateTime(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("datetime", config);
    return this;
  }
  addPageLink(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("pagelink", config);
    return this;
  }
  addLink(config) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("link", config);
    return this;
  }
  // ------------------------------------
  // Getters
  get fieldTree() {
    const fields = Array.from(this.fields.values());
    let result = [];
    let currentTab = null;
    fields.forEach((item) => {
      if (item.type === "tab") {
        if (currentTab) {
          result.push(currentTab);
        }
        currentTab = { ...item, fields: [] };
      } else if (currentTab) {
        if (!currentTab.fields)
          currentTab.fields = [];
        currentTab.fields.push(item);
      } else {
        result.push(item);
      }
    });
    if (currentTab) {
      result.push(currentTab);
    }
    return result;
  }
  get basicFieldTree() {
    const fieldArray = Array.from(this.fields.values());
    fieldArray.forEach((field) => {
      if (field.type === "tab") {
        fieldArray.splice(fieldArray.indexOf(field), 1);
      }
    });
    return fieldArray;
  }
  get flatFields() {
    const fields = [];
    const fieldArray = Array.from(this.fields.values());
    const getFields = (field) => {
      fields.push(field);
      if (field.type === "repeater") {
        field.fields?.forEach((item) => {
          getFields(item);
        });
      }
    };
    fieldArray.forEach((field) => {
      getFields(field);
    });
    return fields;
  }
  // ------------------------------------
  // Field Type Validation
  fieldTypeToDataType = {
    text: "string",
    textarea: "string",
    colour: "string",
    datetime: "string",
    link: "string",
    wysiwyg: "string",
    select: "string",
    number: "number",
    pagelink: "number",
    checkbox: "boolean"
  };
  fieldValidation({
    type,
    key,
    value,
    referenceData,
    flatFieldConfig
  }) {
    try {
      const field = flatFieldConfig.find((item) => item.key === key);
      if (!field) {
        throw new ValidationError(`Field with key "${key}" does not exist.`);
      }
      if (field.type !== type) {
        throw new ValidationError(`Field with key "${key}" is not a ${type}.`);
      }
      if (field.validation?.required) {
        if (value === void 0 || value === null || value === "") {
          throw new ValidationError(`Please enter a value.`);
        }
      }
      if (field.validation?.zod && field.type !== "wysiwyg") {
        this.#validateZodSchema(field.validation.zod, value);
      }
      const dataType = this.fieldTypeToDataType[field.type];
      if (dataType) {
        if (typeof value !== dataType) {
          throw new ValidationError(`The field value must be a ${dataType}.`);
        }
      }
      switch (field.type) {
        case "select": {
          this.#validateSelectType(field, value);
          break;
        }
        case "wysiwyg": {
          this.#validateWysiwygType(field, value);
          break;
        }
        case "media": {
          this.#validateMediaType(field, referenceData);
          break;
        }
        case "datetime": {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            throw new ValidationError("Please ensure the date is valid.");
          }
          break;
        }
        case "link": {
          this.#validateLinkTarget(referenceData);
          break;
        }
        case "pagelink": {
          if (!referenceData) {
            throw new ValidationError(
              "We couldn't find the page you selected."
            );
          }
          this.#validateLinkTarget(referenceData);
          break;
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          valid: false,
          message: error.message
        };
      }
      throw error;
    }
    return {
      valid: true
    };
  }
  // ------------------------------------
  #validateSelectType(field, value) {
    if (field.options) {
      const optionValues = field.options.map((option) => option.value);
      if (!optionValues.includes(value)) {
        throw new ValidationError("Please ensure the value is a valid option.");
      }
    }
  }
  #validateWysiwygType(field, value) {
    const sanitizedValue = sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
    if (field.validation?.zod) {
      this.#validateZodSchema(field.validation.zod, sanitizedValue);
    }
  }
  #validateMediaType(field, referenceData) {
    if (referenceData === void 0) {
      throw new ValidationError("We couldn't find the media you selected.");
    }
    if (field.validation?.extensions && field.validation.extensions.length) {
      const extension = referenceData.extension;
      if (!field.validation.extensions.includes(extension)) {
        throw new ValidationError(
          `Media must be one of the following extensions: ${field.validation.extensions.join(
            ", "
          )}`
        );
      }
    }
    if (field.validation?.width) {
      const width = referenceData.width;
      if (!width) {
        throw new ValidationError("This media does not have a width.");
      }
      if (field.validation.width.min && width < field.validation.width.min) {
        throw new ValidationError(
          `Media width must be greater than ${field.validation.width.min}px.`
        );
      }
      if (field.validation.width.max && width > field.validation.width.max) {
        throw new ValidationError(
          `Media width must be less than ${field.validation.width.max}px.`
        );
      }
    }
    if (field.validation?.height) {
      const height = referenceData.height;
      if (!height) {
        throw new ValidationError("This media does not have a height.");
      }
      if (field.validation.height.min && height < field.validation.height.min) {
        throw new ValidationError(
          `Media height must be greater than ${field.validation.height.min}px.`
        );
      }
      if (field.validation.height.max && height > field.validation.height.max) {
        throw new ValidationError(
          `Media height must be less than ${field.validation.height.max}px.`
        );
      }
    }
  }
  #validateLinkTarget(referenceData) {
    const allowedValues = ["_self", "_blank"];
    if (!allowedValues.includes(referenceData.target)) {
      throw new ValidationError(
        `Please set the target to one of the following: ${allowedValues.join(
          ", "
        )}.`
      );
    }
  }
  // ------------------------------------
  // Validation Util
  #validateZodSchema(schema, value) {
    try {
      schema.parse(value);
    } catch (error) {
      const err = error;
      throw new ValidationError(err.issues[0].message);
    }
  }
  // ------------------------------------
  // Private Methods
  #keyToTitle(key) {
    if (typeof key !== "string")
      return key;
    const title = key.split(/[-_]/g).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return title;
  }
  #addToFields(type, config) {
    const noUndefinedConfig = Object.keys(config).reduce((acc, key) => {
      if (config[key] !== void 0) {
        acc[key] = config[key];
      }
      return acc;
    }, {});
    const data = {
      type,
      title: config.title || this.#keyToTitle(config.key),
      ...noUndefinedConfig
    };
    const validation = baseCustomFieldSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    this.fields.set(config.key, data);
  }
  #checkKeyDuplication(key) {
    if (this.fields.has(key)) {
      throw new Error(`Field with key "${key}" already exists.`);
    }
  }
};

// src/schemas/bricks.ts
var FieldTypesSchema = z8.nativeEnum(FieldTypesEnum);
var baseFieldSchema = z8.object({
  fields_id: z8.number().optional(),
  parent_repeater: z8.number().optional(),
  group_position: z8.number().optional(),
  key: z8.string(),
  type: FieldTypesSchema,
  value: z8.any(),
  target: z8.any().optional()
});
var FieldSchema = baseFieldSchema.extend({
  items: z8.lazy(() => FieldSchema.array().optional())
});
var BrickSchema = z8.object({
  id: z8.number().optional(),
  key: z8.string(),
  fields: z8.array(FieldSchema).optional()
});
var getAllConfigBody = z8.object({});
var getAllConfigQuery = z8.object({
  include: z8.array(z8.enum(["fields"])).optional(),
  filter: z8.object({
    collection_key: z8.string().optional(),
    environment_key: z8.string().optional()
  }).optional().refine(
    (data) => data?.collection_key && data?.environment_key || !data?.collection_key && !data?.environment_key,
    {
      message: "Both collection_key and environment_key should be set or neither.",
      path: []
    }
  )
});
var getAllConfigParams = z8.object({});
var getSingleConfigBody = z8.object({});
var getSingleConfigQuery = z8.object({});
var getSingleConfigParams = z8.object({
  brick_key: z8.string().nonempty()
});
var bricks_default = {
  config: {
    getAll: {
      body: getAllConfigBody,
      query: getAllConfigQuery,
      params: getAllConfigParams
    },
    getSingle: {
      body: getSingleConfigBody,
      query: getSingleConfigQuery,
      params: getSingleConfigParams
    }
  }
};

// src/schemas/pages.ts
var getMultipleBody2 = z9.object({});
var getMultipleQuery2 = z9.object({
  filter: z9.object({
    collection_key: z9.union([z9.string(), z9.array(z9.string())]).optional(),
    title: z9.string().optional(),
    slug: z9.string().optional(),
    category_id: z9.union([z9.string(), z9.array(z9.string())]).optional()
  }).optional(),
  sort: z9.array(
    z9.object({
      key: z9.enum(["created_at"]),
      value: z9.enum(["asc", "desc"])
    })
  ).optional(),
  page: z9.string().optional(),
  per_page: z9.string().optional()
});
var getMultipleParams2 = z9.object({});
var createSingleBody2 = z9.object({
  title: z9.string().min(2),
  slug: z9.string().min(2).toLowerCase(),
  collection_key: z9.string(),
  homepage: z9.boolean().optional(),
  excerpt: z9.string().optional(),
  published: z9.boolean().optional(),
  parent_id: z9.number().optional(),
  category_ids: z9.array(z9.number()).optional()
});
var createSingleQuery2 = z9.object({});
var createSingleParams2 = z9.object({});
var getSingleBody2 = z9.object({});
var getSingleQuery3 = z9.object({
  include: z9.array(z9.enum(["bricks"])).optional()
});
var getSingleParams2 = z9.object({
  id: z9.string()
});
var updateSingleBody2 = z9.object({
  title: z9.string().optional(),
  slug: z9.string().optional(),
  homepage: z9.boolean().optional(),
  parent_id: z9.number().optional(),
  category_ids: z9.array(z9.number()).optional(),
  published: z9.boolean().optional(),
  excerpt: z9.string().optional(),
  builder_bricks: z9.array(BrickSchema).optional(),
  fixed_bricks: z9.array(BrickSchema).optional()
});
var updateSingleQuery2 = z9.object({});
var updateSingleParams2 = z9.object({
  id: z9.string()
});
var deleteSingleBody2 = z9.object({});
var deleteSingleQuery2 = z9.object({});
var deleteSingleParams2 = z9.object({
  id: z9.string()
});
var pages_default = {
  getMultiple: {
    body: getMultipleBody2,
    query: getMultipleQuery2,
    params: getMultipleParams2
  },
  createSingle: {
    body: createSingleBody2,
    query: createSingleQuery2,
    params: createSingleParams2
  },
  getSingle: {
    body: getSingleBody2,
    query: getSingleQuery3,
    params: getSingleParams2
  },
  updateSingle: {
    body: updateSingleBody2,
    query: updateSingleQuery2,
    params: updateSingleParams2
  },
  deleteSingle: {
    body: deleteSingleBody2,
    query: deleteSingleQuery2,
    params: deleteSingleParams2
  }
};

// src/db/models/Page.ts
var Page = class {
  static getMultiple = async (client, query_instance) => {
    const pages = client.query({
      text: `SELECT
          ${query_instance.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id
        ${query_instance.query.order}
        ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        `,
      values: query_instance.countValues
    });
    const data = await Promise.all([pages, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static getSingle = async (client, query_instance) => {
    const page = await client.query({
      text: `SELECT
        ${query_instance.query.select},
        COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id`,
      values: query_instance.values
    });
    return page.rows[0];
  };
  static createSingle = async (client, data) => {
    const page = await client.query({
      text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [
        data.environment_key,
        data.title,
        data.slug,
        data.homepage || false,
        data.collection_key,
        data.excerpt || null,
        data.published || false,
        data.parent_id,
        data.userId
      ]
    });
    return page.rows[0];
  };
  static updateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "title",
        "slug",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "parent_id",
        "homepage"
      ],
      values: [
        data.title,
        data.slug,
        data.excerpt,
        data.published,
        data.published ? /* @__PURE__ */ new Date() : null,
        data.published ? data.userId : null,
        data.parent_id,
        data.homepage
      ],
      conditional: {
        hasValues: {
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    const page = await client.query({
      text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
      values: [...values.value, data.id]
    });
    return page.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const page = await client.query({
      text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING *`,
      values: [data.id]
    });
    return page.rows[0];
  };
  static getMultipleByIds = async (client, data) => {
    const pages = await client.query({
      text: `SELECT * FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
      values: [data.ids, data.environment_key]
    });
    return pages.rows;
  };
  static getSingleBasic = async (client, data) => {
    const page = await client.query({
      text: `SELECT
          *
        FROM
          lucid_pages
        WHERE
          id = $1
        AND
          environment_key = $2`,
      values: [data.id, data.environment_key]
    });
    return page.rows[0];
  };
  static getSlugCount = async (client, data) => {
    const values = [
      data.slug,
      data.collection_key,
      data.environment_key
    ];
    if (data.parent_id)
      values.push(data.parent_id);
    const slugCount = await client.query({
      // where slug is like, slug-example, slug-example-1, slug-example-2
      text: `SELECT COUNT(*) 
        FROM 
          lucid_pages 
        WHERE slug ~ '^${data.slug}-\\d+$' 
        OR 
          slug = $1
        AND
          collection_key = $2
        AND
          environment_key = $3
        ${data.parent_id ? `AND parent_id = $4` : `AND parent_id IS NULL`}`,
      values
    });
    return Number(slugCount.rows[0].count);
  };
  static getNonCurrentHomepages = async (client, data) => {
    const result = await client.query({
      text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
      values: [data.current_id, data.environment_key]
    });
    return result.rows;
  };
  static checkSlugExistence = async (client, data) => {
    const slugExists = await client.query({
      text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
      values: [data.slug, data.id, data.environment_key]
    });
    return Number(slugExists.rows[0].count) > 0;
  };
  static updatePageToNonHomepage = async (client, data) => {
    const updateRes = await client.query({
      text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
      values: [data.id, data.slug]
    });
    return updateRes.rows[0];
  };
};

// src/db/models/PageCategory.ts
var PageCategory = class {
  static createMultiple = async (client, data) => {
    const categories = await client.query({
      text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
      values: [data.page_id, data.category_ids]
    });
    return categories.rows;
  };
  static getMultiple = async (client, data) => {
    const res = await client.query({
      text: `SELECT * FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
      values: [data.category_ids, data.collection_key]
    });
    return res.rows;
  };
  static getMultipleByPageId = async (client, data) => {
    const res = await client.query({
      text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
      values: [data.page_id]
    });
    return res.rows;
  };
  static deleteMultiple = async (client, data) => {
    const deleteCategories = await client.query({
      text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
      values: [data.page_id, data.category_ids]
    });
    return deleteCategories.rows;
  };
};

// src/services/page-categories/create-multiple.ts
var createMultiple2 = async (client, data) => {
  await service_default(
    page_categories_default.verifyCategoriesInCollection,
    false,
    client
  )({
    category_ids: data.category_ids,
    collection_key: data.collection_key
  });
  const pageCategory = await PageCategory.createMultiple(client, {
    page_id: data.page_id,
    category_ids: data.category_ids
  });
  if (pageCategory.length !== data.category_ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Page Category Not Created",
      message: "There was an error creating the page category.",
      status: 500
    });
  }
  return pageCategory;
};
var create_multiple_default2 = createMultiple2;

// src/services/page-categories/verify-cateogies-in-collection.ts
var verifyCategoriesInCollection = async (client, data) => {
  const pageCategories = await PageCategory.getMultiple(client, {
    category_ids: data.category_ids,
    collection_key: data.collection_key
  });
  if (pageCategories.length !== data.category_ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Found",
      message: "Category not found.",
      status: 404,
      errors: modelErrors({
        id: {
          code: "not_found",
          message: "Category not found."
        },
        collection_key: {
          code: "not_found",
          message: "Collection key not found."
        }
      })
    });
  }
  return pageCategories;
};
var verify_cateogies_in_collection_default = verifyCategoriesInCollection;

// src/services/page-categories/delete-multiple.ts
var deleteMultiple2 = async (client, data) => {
  const pageCategory = await PageCategory.deleteMultiple(client, {
    page_id: data.page_id,
    category_ids: data.category_ids
  });
  if (pageCategory.length !== data.category_ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Page Category Not Deleted",
      message: "There was an error deleting the page category.",
      status: 500
    });
  }
  return pageCategory;
};
var delete_multiple_default2 = deleteMultiple2;

// src/services/page-categories/update-multiple.ts
var updateMultiple = async (client, data) => {
  const pageCategoriesRes = await PageCategory.getMultipleByPageId(client, {
    page_id: data.page_id
  });
  const categoriesToAdd = data.category_ids.filter(
    (id) => !pageCategoriesRes.find((pageCategory) => pageCategory.category_id === id)
  );
  const categoriesToRemove = pageCategoriesRes.filter(
    (pageCategory) => !data.category_ids.includes(pageCategory.category_id)
  );
  const updatePromise = [];
  if (categoriesToAdd.length > 0) {
    updatePromise.push(
      service_default(
        page_categories_default.createMultiple,
        false,
        client
      )({
        page_id: data.page_id,
        category_ids: categoriesToAdd,
        collection_key: data.collection_key
      })
    );
  }
  if (categoriesToRemove.length > 0) {
    updatePromise.push(
      service_default(
        page_categories_default.deleteMultiple,
        false,
        client
      )({
        page_id: data.page_id,
        category_ids: categoriesToRemove.map(
          (category) => category.category_id
        )
      })
    );
  }
  const updateRes = await Promise.all(updatePromise);
  const newPageCategories = pageCategoriesRes.filter(
    (pageCategory) => !categoriesToRemove.includes(pageCategory)
  );
  if (categoriesToAdd.length > 0) {
    newPageCategories.push(...updateRes[0]);
  }
  return newPageCategories;
};
var update_multiple_default = updateMultiple;

// src/services/page-categories/index.ts
var page_categories_default = {
  createMultiple: create_multiple_default2,
  verifyCategoriesInCollection: verify_cateogies_in_collection_default,
  deleteMultiple: delete_multiple_default2,
  updateMultiple: update_multiple_default
};

// src/utils/format/format-page.ts
var formatPage = (data) => {
  if (data.categories) {
    data.categories = data.categories[0] === null ? [] : data.categories;
  }
  if (data.full_slug) {
    if (!data.full_slug.startsWith("/")) {
      data.full_slug = "/" + data.full_slug;
    }
  }
  return data;
};
var format_page_default = formatPage;

// src/services/pages/create-single.ts
var createSingle5 = async (client, data) => {
  const parentId = data.homepage ? void 0 : data.parent_id;
  const checks = Promise.all([
    service_default(
      collections_default.getSingle,
      false,
      client
    )({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: "pages"
    }),
    parentId === void 0 ? Promise.resolve(void 0) : service_default(
      pages_default2.parentChecks,
      false,
      client
    )({
      parent_id: parentId,
      environment_key: data.environment_key,
      collection_key: data.collection_key
    })
  ]);
  await checks;
  const slug5 = await service_default(
    pages_default2.buildUniqueSlug,
    false,
    client
  )({
    slug: data.slug,
    homepage: data.homepage || false,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: parentId
  });
  const page = await Page.createSingle(client, {
    environment_key: data.environment_key,
    title: data.title,
    slug: slug5,
    collection_key: data.collection_key,
    homepage: data.homepage,
    excerpt: data.excerpt,
    published: data.published,
    parent_id: parentId,
    category_ids: data.category_ids,
    userId: data.userId
  });
  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Created",
      message: "There was an error creating the page",
      status: 500
    });
  }
  const operations = [
    data.category_ids ? service_default(
      page_categories_default.createMultiple,
      false,
      client
    )({
      page_id: page.id,
      category_ids: data.category_ids,
      collection_key: data.collection_key
    }) : Promise.resolve(),
    data.homepage ? service_default(
      pages_default2.resetHomepages,
      false,
      client
    )({
      current: page.id,
      environment_key: data.environment_key
    }) : Promise.resolve()
  ];
  await Promise.all(operations);
  return format_page_default(page);
};
var create_single_default6 = createSingle5;

// src/services/pages/delete-single.ts
var deleteSingle7 = async (client, data) => {
  await service_default(
    pages_default2.checkPageExists,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key
  });
  const page = await Page.deleteSingle(client, {
    id: data.id
  });
  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Deleted",
      message: "There was an error deleting the page",
      status: 500
    });
  }
  return format_page_default(page);
};
var delete_single_default8 = deleteSingle7;

// src/services/pages/get-multiple.ts
var getMultiple5 = async (client, data) => {
  const { filter, sort, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",
      "parent_id",
      "title",
      "slug",
      "full_slug",
      "homepage",
      "excerpt",
      "published",
      "published_at",
      "published_by",
      "created_by",
      "created_at",
      "updated_at"
    ],
    exclude: void 0,
    filter: {
      data: {
        ...filter,
        environment_key: data.environment_key
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        title: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        slug: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        category_id: {
          operator: "=",
          type: "int",
          columnType: "standard",
          table: "lucid_page_categories"
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const pages = await Page.getMultiple(client, SelectQuery);
  return {
    data: pages.data.map((page2) => format_page_default(page2)),
    count: pages.count
  };
};
var get_multiple_default6 = getMultiple5;

// src/services/collection-bricks/update-multiple.ts
var updateMultiple2 = async (client, data) => {
  const builderBricksPromise = data.builder_bricks.map(
    (brick, index) => service_default(
      collection_bricks_default.upsertSingle,
      false,
      client
    )({
      reference_id: data.id,
      brick,
      brick_type: "builder",
      order: index,
      environment: data.environment,
      collection: data.collection
    })
  ) || [];
  const fixedBricksPromise = data.fixed_bricks.map(
    (brick, index) => service_default(
      collection_bricks_default.upsertSingle,
      false,
      client
    )({
      reference_id: data.id,
      brick,
      brick_type: "fixed",
      order: index,
      environment: data.environment,
      collection: data.collection
    })
  ) || [];
  const [buildBrickRes, fixedBrickRes] = await Promise.all([
    Promise.all(builderBricksPromise),
    Promise.all(fixedBricksPromise)
  ]);
  const builderIds = buildBrickRes.map((brickId) => brickId);
  const fixedIds = fixedBrickRes.map((brickId) => brickId);
  if (builderIds.length > 0)
    await service_default(
      collection_bricks_default.deleteUnused,
      false,
      client
    )({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: builderIds,
      brick_type: "builder"
    });
  if (fixedIds.length > 0)
    await service_default(
      collection_bricks_default.deleteUnused,
      false,
      client
    )({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: fixedIds,
      brick_type: "fixed"
    });
};
var update_multiple_default2 = updateMultiple2;

// src/utils/bricks/generate-field-query.ts
var valueKey = (type) => {
  switch (type) {
    case "text":
      return "text_value";
    case "wysiwyg":
      return "text_value";
    case "media":
      return "media_id";
    case "number":
      return "int_value";
    case "checkbox":
      return "bool_value";
    case "select":
      return "text_value";
    case "textarea":
      return "text_value";
    case "json":
      return "json_value";
    case "pagelink":
      return "page_link_id";
    case "link":
      return "text_value";
    case "datetime":
      return "text_value";
    case "colour":
      return "text_value";
    default:
      return "text_value";
  }
};
var generateFieldQuery = (data) => {
  const brickField = data.data;
  switch (brickField.type) {
    case "link": {
      if (data.mode === "create") {
        return queryDataFormat({
          columns: [
            "collection_brick_id",
            "key",
            "type",
            "text_value",
            "json_value",
            "parent_repeater",
            "group_position"
          ],
          values: [
            data.brick_id,
            brickField.key,
            brickField.type,
            brickField.value,
            {
              target: brickField.target
            },
            brickField.parent_repeater,
            brickField.group_position
          ]
        });
      } else {
        return queryDataFormat({
          columns: ["text_value", "json_value", "group_position"],
          values: [
            brickField.value,
            {
              target: brickField.target
            },
            brickField.group_position
          ]
        });
      }
    }
    case "pagelink": {
      if (data.mode === "create") {
        return queryDataFormat({
          columns: [
            "collection_brick_id",
            "key",
            "type",
            "page_link_id",
            "json_value",
            "parent_repeater",
            "group_position"
          ],
          values: [
            data.brick_id,
            brickField.key,
            brickField.type,
            brickField.value,
            {
              target: brickField.target
            },
            brickField.parent_repeater,
            brickField.group_position
          ]
        });
      } else {
        return queryDataFormat({
          columns: ["page_link_id", "json_value", "group_position"],
          values: [
            brickField.value,
            {
              target: brickField.target
            },
            brickField.group_position
          ]
        });
      }
    }
    default: {
      if (data.mode === "create") {
        return queryDataFormat({
          columns: [
            "collection_brick_id",
            "key",
            "type",
            valueKey(brickField.type),
            "parent_repeater",
            "group_position"
          ],
          values: [
            data.brick_id,
            brickField.key,
            brickField.type,
            brickField.value,
            brickField.parent_repeater,
            brickField.group_position
          ]
        });
      } else {
        return queryDataFormat({
          columns: [valueKey(brickField.type), "group_position"],
          values: [brickField.value, brickField.group_position]
        });
      }
    }
  }
};
var generate_field_query_default = generateFieldQuery;

// src/db/models/CollectionBrick.ts
var CollectionBrick = class {
  static getAll = async (client, data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const brickFields = await client.query(
      `SELECT 
          lucid_collection_bricks.*,
          lucid_fields.*,
          json_build_object(
            'title', lucid_pages.title,
            'slug', lucid_pages.slug,
            'full_slug', lucid_pages.full_slug
          ) as linked_page,
          json_build_object(
            'key', lucid_media.key,
            'mime_type', lucid_media.mime_type,
            'file_extension', lucid_media.file_extension,
            'file_size', lucid_media.file_size,
            'width', lucid_media.width,
            'height', lucid_media.height,
            'name', lucid_media.name,
            'alt', lucid_media.alt
          ) as media
        FROM 
          lucid_collection_bricks
        LEFT JOIN 
          lucid_fields
        ON 
          lucid_collection_bricks.id = lucid_fields.collection_brick_id
        LEFT JOIN 
          lucid_pages
        ON 
          lucid_fields.page_link_id = lucid_pages.id
        LEFT JOIN 
          lucid_media
        ON 
          lucid_fields.media_id = lucid_media.id
        WHERE 
          lucid_collection_bricks.${referenceKey} = $1
        ORDER BY 
          lucid_collection_bricks.brick_order`,
      [data.reference_id]
    );
    return brickFields.rows;
  };
  // -------------------------------------------
  // Page Brick
  static createSingleBrick = async (client, data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const brickRes = await client.query(
      `INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING *`,
      [data.brick.key, data.brick_type, data.reference_id, data.order]
    );
    return brickRes.rows[0];
  };
  static updateSingleBrick = async (client, data) => {
    const brickRes = await client.query(
      `UPDATE 
        lucid_collection_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      AND
        brick_type = $3
      RETURNING *`,
      [data.order, data.brick.id, data.brick_type]
    );
    return brickRes.rows[0];
  };
  static getAllBricks = async (client, data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const collectionBrickIds = await client.query({
      text: `SELECT id FROM lucid_collection_bricks WHERE ${referenceKey} = $1 AND brick_type = $2`,
      values: [data.reference_id, data.brick_type]
    });
    return collectionBrickIds.rows;
  };
  static deleteSingleBrick = async (client, data) => {
    const brickRes = await client.query({
      text: `DELETE FROM lucid_collection_bricks WHERE id = $1 RETURNING *`,
      values: [data.brick_id]
    });
    return brickRes.rows[0];
  };
  // -------------------------------------------
  // Fields
  static updateField = async (client, data) => {
    const { columns, aliases, values } = generate_field_query_default({
      brick_id: data.brick_id,
      data: data.field,
      mode: "update"
    });
    const fieldRes = await client.query({
      text: `UPDATE lucid_fields SET ${columns.formatted.update} WHERE fields_id = $${aliases.value.length + 1} RETURNING *`,
      values: [...values.value, data.field.fields_id]
    });
    return fieldRes.rows[0];
  };
  static createField = async (client, data) => {
    const { columns, aliases, values } = generate_field_query_default({
      brick_id: data.brick_id,
      data: data.field,
      mode: "create"
    });
    const fieldRes = await client.query({
      text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return fieldRes.rows[0];
  };
  static checkFieldExists = async (client, data) => {
    let queryText = "SELECT EXISTS(SELECT 1 FROM lucid_fields WHERE collection_brick_id = $1 AND key = $2 AND type = $3";
    let queryValues = [data.brick_id, data.key, data.type];
    if (data.parent_repeater !== void 0) {
      queryText += " AND parent_repeater = $4";
      queryValues.push(data.parent_repeater);
    }
    if (data.group_position !== void 0) {
      queryText += " AND group_position = $5";
      queryValues.push(data.group_position);
    }
    queryText += ")";
    const res = await client.query({
      text: queryText,
      values: queryValues
    });
    return res.rows[0].exists;
  };
  // -------------------------------------------
  // Repeater Field
  static updateRepeater = async (client, data) => {
    const repeaterRes = await client.query({
      text: `UPDATE lucid_fields SET group_position = $1 WHERE fields_id = $2 RETURNING *`,
      values: [data.field.group_position, data.field.fields_id]
    });
    return repeaterRes.rows[0];
  };
  static createRepeater = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "collection_brick_id",
        "key",
        "type",
        "parent_repeater",
        "group_position"
      ],
      values: [
        data.brick_id,
        data.field.key,
        data.field.type,
        data.field.parent_repeater,
        data.field.group_position
      ]
    });
    const repeaterRes = await client.query({
      text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return repeaterRes.rows[0];
  };
};

// src/services/collection-bricks/upsert-single.ts
var upsertSingleWithFields = async (client, data) => {
  const promises = [];
  const allowed = brick_config_default.isBrickAllowed({
    key: data.brick.key,
    type: data.brick_type,
    environment: data.environment,
    collection: data.collection
  });
  if (!allowed.allowed) {
    throw new LucidError({
      type: "basic",
      name: "Brick not allowed",
      message: `The brick "${data.brick.key}" of type "${data.brick_type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
      status: 500
    });
  }
  let brickId = data.brick.id;
  if (brickId) {
    const brickRes = await CollectionBrick.updateSingleBrick(client, {
      order: data.order,
      brick: data.brick,
      brick_type: data.brick_type
    });
    brickId = brickRes.id;
    if (!brickRes) {
      throw new LucidError({
        type: "basic",
        name: "Page Brick Update Error",
        message: "Could not update page brick",
        status: 500
      });
    }
  } else {
    const brickRes = await CollectionBrick.createSingleBrick(client, {
      type: data.collection.type,
      reference_id: data.reference_id,
      order: data.order,
      brick: data.brick,
      brick_type: data.brick_type
    });
    brickId = brickRes.id;
    if (!brickRes) {
      throw new LucidError({
        type: "basic",
        name: "Page Brick Create Error",
        message: "Could not create page brick",
        status: 500
      });
    }
  }
  if (!data.brick.fields)
    return brickId;
  for (const field of data.brick.fields) {
    if (field.type === "tab")
      continue;
    if (field.type === "repeater")
      promises.push(
        service_default(
          collection_bricks_default.upsertRepeater,
          false,
          client
        )({
          brick_id: brickId,
          data: field
        })
      );
    else
      promises.push(
        service_default(
          collection_bricks_default.upsertField,
          false,
          client
        )({
          brick_id: brickId,
          data: field
        })
      );
  }
  await Promise.all(promises);
  return brickId;
};
var upsert_single_default2 = upsertSingleWithFields;

// src/services/collection-bricks/upsert-repeater.ts
var upsertRepeater = async (client, data) => {
  let repeaterId;
  const brickField = data.data;
  if (brickField.fields_id && brickField.group_position !== void 0) {
    const repeaterRes = await CollectionBrick.updateRepeater(client, {
      field: brickField
    });
    repeaterId = repeaterRes.fields_id;
  } else {
    await service_default(
      collection_bricks_default.checkFieldExists,
      false,
      client
    )({
      brick_id: data.brick_id,
      key: brickField.key,
      type: brickField.type,
      parent_repeater: brickField.parent_repeater,
      group_position: brickField.group_position,
      create: true
    });
    const repeaterRes = await CollectionBrick.createRepeater(client, {
      brick_id: data.brick_id,
      field: brickField
    });
    repeaterId = repeaterRes.fields_id;
  }
  if (!brickField.items)
    return;
  const promises = [];
  for (let i = 0; i < brickField.items.length; i++) {
    const item = brickField.items[i];
    if (item.type === "tab")
      continue;
    item.parent_repeater = repeaterId;
    if (item.type === "repeater") {
      promises.push(
        service_default(
          collection_bricks_default.upsertRepeater,
          false,
          client
        )({
          brick_id: data.brick_id,
          data: item
        })
      );
      continue;
    }
    promises.push(
      service_default(
        collection_bricks_default.upsertField,
        false,
        client
      )({
        brick_id: data.brick_id,
        data: item
      })
    );
  }
  await Promise.all(promises);
};
var upsert_repeater_default = upsertRepeater;

// src/services/collection-bricks/check-field-exists.ts
var checkFieldExists = async (client, data) => {
  const repeaterExists = await CollectionBrick.checkFieldExists(client, {
    brick_id: data.brick_id,
    key: data.key,
    type: data.type,
    parent_repeater: data.parent_repeater,
    group_position: data.group_position
  });
  if (!repeaterExists && !data.create) {
    throw new LucidError({
      type: "basic",
      name: "Field Not Found",
      message: `The field cannot be updated because it does not exist.`,
      status: 409
    });
  } else if (repeaterExists && data.create) {
    throw new LucidError({
      type: "basic",
      name: "Field Already Exists",
      message: `The field cannot be created because it already exists.`,
      status: 409
    });
  }
};
var check_field_exists_default = checkFieldExists;

// src/services/collection-bricks/upsert-field.ts
var upsertField = async (client, data) => {
  let fieldId;
  const brickField = data.data;
  await service_default(
    collection_bricks_default.checkFieldExists,
    false,
    client
  )({
    brick_id: data.brick_id,
    key: brickField.key,
    type: brickField.type,
    parent_repeater: brickField.parent_repeater,
    group_position: brickField.group_position,
    create: brickField.fields_id !== void 0 ? false : true
  });
  if (brickField.fields_id) {
    const fieldRes = await CollectionBrick.updateField(client, {
      brick_id: data.brick_id,
      field: brickField
    });
    fieldId = fieldRes.fields_id;
  } else {
    const fieldRes = await CollectionBrick.createField(client, {
      brick_id: data.brick_id,
      field: brickField
    });
    if (!fieldRes) {
      throw new LucidError({
        type: "basic",
        name: "Field Create Error",
        message: `Could not create field "${brickField.key}" for brick "${data.brick_id}".`,
        status: 500
      });
    }
    fieldId = fieldRes.fields_id;
  }
  return fieldId;
};
var upsert_field_default = upsertField;

// src/utils/media/create-url.ts
var createURL = (key) => {
  if (!key) {
    return void 0;
  }
  return `${Config.host}/cdn/v1/${key}`;
};
var create_url_default = createURL;

// src/utils/format/format-bricks.ts
var specificFieldValues = (type, builderField, field) => {
  let value = null;
  switch (type) {
    case "tab": {
      break;
    }
    case "text": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "wysiwyg": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "media": {
      value = {
        id: field?.media_id || void 0,
        url: create_url_default(field?.media.key || void 0),
        key: field?.media.key || void 0,
        mime_type: field?.media.mime_type || void 0,
        file_extension: field?.media.file_extension || void 0,
        file_size: field?.media.file_size || void 0,
        width: field?.media.width || void 0,
        height: field?.media.height || void 0,
        name: field?.media.name || void 0,
        alt: field?.media.alt || void 0
      };
      break;
    }
    case "number": {
      value = field?.int_value || builderField.default || 0;
      break;
    }
    case "checkbox": {
      value = field?.bool_value || builderField.default || false;
      break;
    }
    case "select": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "textarea": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "json": {
      value = field?.json_value || builderField.default || {};
      break;
    }
    case "colour": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "datetime": {
      value = field?.text_value || builderField.default || "";
      break;
    }
    case "pagelink": {
      value = {
        id: field?.page_link_id || void 0,
        target: field?.json_value.target || "_self",
        title: field?.linked_page.title || void 0,
        full_slug: field?.linked_page.full_slug || void 0,
        slug: field?.linked_page.slug || void 0
      };
      break;
    }
    case "link": {
      value = {
        target: field?.json_value.target || "_self",
        url: field?.text_value || builderField.default || ""
      };
      break;
    }
  }
  return { value };
};
var buildFieldTree = (brickId, fields, builderInstance) => {
  const brickFields = fields.filter(
    (field) => field.collection_brick_id === brickId
  );
  const basicFieldTree = builderInstance.basicFieldTree;
  const fieldRes = buildFields(brickFields, basicFieldTree);
  return fieldRes;
};
var buildFields = (brickFields, fields) => {
  const fieldObjs = [];
  fields.forEach((field) => {
    const brickField = brickFields.find((bField) => bField.key === field.key);
    const { value } = specificFieldValues(field.type, field, brickField);
    if (!brickField) {
      const fieldObj = {
        fields_id: -1,
        // use a sentinel value for non-existing fields
        key: field.key,
        type: field.type
      };
      if (value !== null)
        fieldObj.value = value;
      fieldObjs.push(fieldObj);
    } else {
      if (field.type === "repeater") {
        fieldObjs.push({
          fields_id: brickField.fields_id,
          key: brickField.key,
          type: brickField.type,
          items: buildFieldGroups(brickFields, field.fields || [])
        });
      } else {
        const fieldObj = {
          fields_id: brickField.fields_id,
          key: brickField.key,
          type: brickField.type
        };
        if (value !== null)
          fieldObj.value = value;
        fieldObjs.push(fieldObj);
      }
    }
  });
  return fieldObjs;
};
var buildFieldGroups = (data, fields) => {
  const groupMap = /* @__PURE__ */ new Map();
  let maxGroupPosition = 0;
  for (const datum of data) {
    if (datum.group_position !== null) {
      const group = groupMap.get(datum.group_position) || [];
      group.push(datum);
      groupMap.set(datum.group_position, group);
      maxGroupPosition = Math.max(maxGroupPosition, datum.group_position);
    }
  }
  const output = [];
  for (let i = 1; i <= maxGroupPosition; i++) {
    const group = groupMap.get(i) || [];
    const outputGroup = buildFields(group, fields);
    output.push(outputGroup);
  }
  const grouplessData = groupMap.get(null) || [];
  if (grouplessData.length > 0) {
    const lastGroup = output[output.length - 1];
    lastGroup.push(...buildFields(grouplessData, fields));
  }
  return output;
};
var buildBrickStructure = (brickFields) => {
  const brickStructure = [];
  brickFields.forEach((brickField) => {
    const brickStructureIndex = brickStructure.findIndex(
      (brick) => brick.id === brickField.id
    );
    if (brickStructureIndex === -1) {
      brickStructure.push({
        id: brickField.id,
        key: brickField.brick_key,
        order: brickField.brick_order,
        type: brickField.brick_type,
        fields: []
      });
    }
  });
  return brickStructure;
};
var formatBricks = async (data) => {
  const builderInstances = brick_config_default.getBrickConfig();
  if (!builderInstances)
    return [];
  if (!data.environment)
    return [];
  const brickStructure = buildBrickStructure(data.brick_fields).filter(
    (brick) => {
      const allowed = brick_config_default.isBrickAllowed({
        key: brick.key,
        type: brick.type,
        environment: data.environment,
        collection: data.collection
      });
      return allowed.allowed;
    }
  );
  brickStructure.forEach((brick) => {
    const instance = builderInstances.find((b) => b.key === brick.key);
    if (!instance)
      return;
    brick.fields = buildFieldTree(brick.id, data.brick_fields, instance);
  });
  return brickStructure;
};
var format_bricks_default = formatBricks;

// src/services/collection-bricks/get-all.ts
var getAll5 = async (client, data) => {
  const brickFields = await CollectionBrick.getAll(client, {
    reference_id: data.reference_id,
    type: data.type
  });
  if (!brickFields) {
    return {
      builder_bricks: [],
      fixed_bricks: []
    };
  }
  const environment = await service_default(
    environments_default.getSingle,
    false,
    client
  )({
    key: data.environment_key
  });
  const formmatedBricks = await format_bricks_default({
    brick_fields: brickFields,
    environment_key: data.environment_key,
    collection: data.collection,
    environment
  });
  return {
    builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
    fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder")
  };
};
var get_all_default5 = getAll5;

// src/services/collection-bricks/delete-unused.ts
var deleteUnused = async (client, data) => {
  const allBricks = await CollectionBrick.getAllBricks(client, {
    type: data.type,
    reference_id: data.reference_id,
    brick_type: data.brick_type
  });
  const brickIds = allBricks.map((brick) => brick.id);
  const bricksToDelete = brickIds.filter((id) => !data.brick_ids.includes(id));
  const promises = bricksToDelete.map(
    (id) => CollectionBrick.deleteSingleBrick(client, {
      brick_id: id
    })
  );
  try {
    await Promise.all(promises);
  } catch (err) {
    throw new LucidError({
      type: "basic",
      name: "Brick Delete Error",
      message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
      status: 500
    });
  }
};
var delete_unused_default = deleteUnused;

// src/utils/media/helpers.ts
import slug2 from "slug";
import mime from "mime-types";
import sharp from "sharp";
var uniqueKey = (name) => {
  const slugVal = slug2(name, {
    lower: true
  });
  return `${slugVal}-${Date.now()}`;
};
var getMetaData = async (file) => {
  const fileExtension = mime.extension(file.mimetype);
  const mimeType = file.mimetype;
  const size = file.size;
  let width = null;
  let height = null;
  try {
    const metaData = await sharp(file.data).metadata();
    width = metaData.width;
    height = metaData.height;
  } catch (error) {
  }
  return {
    mimeType,
    fileExtension: fileExtension || "",
    size,
    width: width || null,
    height: height || null
  };
};
var formatReqFiles = (files) => {
  const file = files["file"];
  if (Array.isArray(file)) {
    return file;
  } else {
    return [file];
  }
};
var createProcessKey = (data) => {
  let key = `processed/${data.key}`;
  if (data.query.format)
    key = key.concat(`.${data.query.format}`);
  if (data.query.quality)
    key = key.concat(`.${data.query.quality}`);
  if (data.query.width)
    key = key.concat(`.${data.query.width}`);
  if (data.query.height)
    key = key.concat(`.${data.query.height}`);
  return key;
};
var streamToBuffer = (readable) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
};
var getMediaType = (mimeType) => {
  const normalizedMimeType = mimeType.toLowerCase();
  if (normalizedMimeType.includes("image"))
    return "image";
  if (normalizedMimeType.includes("video"))
    return "video";
  if (normalizedMimeType.includes("audio"))
    return "audio";
  if (normalizedMimeType.includes("pdf") || normalizedMimeType.startsWith("application/vnd"))
    return "document";
  if (normalizedMimeType.includes("zip") || normalizedMimeType.includes("tar"))
    return "archive";
  return "unknown";
};
var helpers = {
  uniqueKey,
  getMetaData,
  formatReqFiles,
  createProcessKey,
  streamToBuffer,
  getMediaType
};
var helpers_default = helpers;

// src/db/models/Media.ts
var Media = class {
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "key",
        "e_tag",
        "type",
        "name",
        "alt",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height"
      ],
      values: [
        data.key,
        data.etag,
        data.type,
        data.name,
        data.alt,
        data.meta.mimeType,
        data.meta.fileExtension,
        data.meta.size,
        data.meta.width,
        data.meta.height
      ]
    });
    const media = await client.query({
      text: `INSERT INTO lucid_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return media.rows[0];
  };
  static getMultiple = async (client, query_instance) => {
    const mediasRes = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_media ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT COUNT(DISTINCT lucid_media.id) FROM lucid_media ${query_instance.query.where}`,
      values: query_instance.countValues
    });
    const data = await Promise.all([mediasRes, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static getSingle = async (client, data) => {
    const media = await client.query({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          key = $1`,
      values: [data.key]
    });
    return media.rows[0];
  };
  static getSingleById = async (client, data) => {
    const media = await client.query({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = $1`,
      values: [data.id]
    });
    return media.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const media = await client.query({
      text: `DELETE FROM
          lucid_media
        WHERE
          key = $1
        RETURNING key, file_size`,
      values: [data.key]
    });
    return media.rows[0];
  };
  static updateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "name",
        "alt",
        "type",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height",
        "key"
      ],
      values: [
        data.name,
        data.alt,
        data.type,
        data.meta?.mimeType,
        data.meta?.fileExtension,
        data.meta?.size,
        data.meta?.width,
        data.meta?.height,
        data.newKey
      ],
      conditional: {
        hasValues: {
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    const mediaRes = await client.query({
      text: `UPDATE 
            lucid_media 
          SET 
            ${columns.formatted.update} 
          WHERE 
            key = $${aliases.value.length + 1}
          RETURNING key`,
      values: [...values.value, data.key]
    });
    return mediaRes.rows[0];
  };
  static getMultipleByIds = async (client, data) => {
    const media = await client.query({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = ANY($1)`,
      values: [data.ids]
    });
    return media.rows;
  };
};

// src/services/s3/save-object.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";

// src/utils/app/s3-client.ts
import { S3Client } from "@aws-sdk/client-s3";
var getS3Client = async () => {
  const config = await Config.getConfig();
  const s3Config = {
    region: config.media.store.region,
    credentials: {
      accessKeyId: config.media.store.accessKeyId,
      secretAccessKey: config.media.store.secretAccessKey
    }
  };
  if (config.media.store.service === "cloudflare") {
    s3Config.endpoint = `https://${config.media.store.cloudflareAccountId}.r2.cloudflarestorage.com`;
  }
  return new S3Client(s3Config);
};
var s3_client_default = getS3Client();

// src/services/s3/save-object.ts
var saveObject = async (data) => {
  const S3 = await s3_client_default;
  const command = new PutObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key,
    Body: data.type === "file" ? data.file?.data : data.buffer,
    ContentType: data.meta.mimeType,
    Metadata: {
      width: data.meta.width?.toString() || "",
      height: data.meta.height?.toString() || "",
      extension: data.meta.fileExtension
    }
  });
  return S3.send(command);
};
var save_object_default = saveObject;

// src/services/s3/delete-object.ts
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
var deleteObject = async (data) => {
  const S3 = await s3_client_default;
  const command = new DeleteObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key
  });
  return S3.send(command);
};
var delete_object_default = deleteObject;

// src/services/s3/delete-objects.ts
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
var deleteObjects = async (data) => {
  const S3 = await s3_client_default;
  const command = new DeleteObjectsCommand({
    Bucket: Config.media.store.bucket,
    Delete: {
      Objects: data.objects.map((object) => ({
        Key: object.key
      }))
    }
  });
  return S3.send(command);
};
var delete_objects_default = deleteObjects;

// src/services/s3/update-object-key.ts
import { DeleteObjectCommand as DeleteObjectCommand2, CopyObjectCommand } from "@aws-sdk/client-s3";
var updateObjectKey = async (data) => {
  const S3 = await s3_client_default;
  const copyCommand = new CopyObjectCommand({
    Bucket: Config.media.store.bucket,
    CopySource: `${Config.media.store.bucket}/${data.oldKey}`,
    Key: data.newKey
  });
  const res = await S3.send(copyCommand);
  const command = new DeleteObjectCommand2({
    Bucket: Config.media.store.bucket,
    Key: data.oldKey
  });
  await S3.send(command);
  return res;
};
var update_object_key_default = updateObjectKey;

// src/services/s3/index.ts
var s3_default = {
  saveObject: save_object_default,
  deleteObject: delete_object_default,
  deleteObjects: delete_objects_default,
  updateObjectKey: update_object_key_default
};

// src/utils/format/format-media.ts
var formatMedia = (media) => {
  return {
    id: media.id,
    key: media.key,
    url: create_url_default(media.key),
    name: media.name,
    alt: media.alt,
    type: media.type,
    meta: {
      mime_type: media.mime_type,
      file_extension: media.file_extension,
      file_size: media.file_size,
      width: media.width,
      height: media.height
    },
    created_at: media.created_at,
    updated_at: media.updated_at
  };
};
var format_media_default = formatMedia;

// src/services/media/create-single.ts
var createSingle6 = async (client, data) => {
  if (!data.files || !data.files["file"]) {
    throw new LucidError({
      type: "basic",
      name: "No files provided",
      message: "No files provided",
      status: 400,
      errors: modelErrors({
        file: {
          code: "required",
          message: "No files provided"
        }
      })
    });
  }
  const files = helpers_default.formatReqFiles(data.files);
  const firstFile = files[0];
  await service_default(
    media_default.canStoreFiles,
    false,
    client
  )({
    files
  });
  const key = helpers_default.uniqueKey(data.name || firstFile.name);
  const meta = await helpers_default.getMetaData(firstFile);
  const type = helpers_default.getMediaType(meta.mimeType);
  const response = await s3_default.saveObject({
    type: "file",
    key,
    file: firstFile,
    meta
  });
  if (response.$metadata.httpStatusCode !== 200) {
    throw new LucidError({
      type: "basic",
      name: "Error saving file",
      message: "Error saving file",
      status: 500,
      errors: modelErrors({
        file: {
          code: "required",
          message: "Error saving file"
        }
      })
    });
  }
  const media = await Media.createSingle(client, {
    key,
    name: data.name || firstFile.name,
    alt: data.alt,
    etag: response.ETag?.replace(/"/g, ""),
    type,
    meta
  });
  if (!media) {
    await s3_default.deleteObject({
      key
    });
    throw new LucidError({
      type: "basic",
      name: "Error saving file",
      message: "Error saving file",
      status: 500,
      errors: modelErrors({
        file: {
          code: "required",
          message: "Error saving file"
        }
      })
    });
  }
  await service_default(
    media_default.setStorageUsed,
    false,
    client
  )({
    add: meta.size
  });
  return format_media_default(media);
};
var create_single_default7 = createSingle6;

// src/db/models/ProcessedImage.ts
var ProcessedImage = class {
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["key", "media_key"],
      values: [data.key, data.media_key]
    });
    const processedImage = await client.query({
      text: `INSERT INTO lucid_processed_images (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING key`,
      values: values.value
    });
    return processedImage.rows[0];
  };
  static getAllByMediaKey = async (client, data) => {
    const processedImages = await client.query({
      text: `SELECT * FROM lucid_processed_images WHERE media_key = $1`,
      values: [data.media_key]
    });
    return processedImages.rows;
  };
  static deleteAllByMediaKey = async (client, data) => {
    const processedImages = await client.query({
      text: `DELETE FROM lucid_processed_images WHERE media_key = $1`,
      values: [data.media_key]
    });
    return processedImages.rows;
  };
  static getAll = async (client) => {
    const processedImages = await client.query({
      text: `SELECT * FROM lucid_processed_images`
    });
    return processedImages.rows;
  };
  static deleteAll = async (client) => {
    const processedImages = await client.query({
      text: `DELETE FROM lucid_processed_images`
    });
    return processedImages.rows;
  };
  static getAllByMediaKeyCount = async (client, data) => {
    const processedImages = await client.query({
      text: `SELECT COUNT(*) FROM lucid_processed_images WHERE media_key = $1`,
      values: [data.media_key]
    });
    return Number(processedImages.rows[0].count);
  };
  static getAllCount = async (client) => {
    const processedImages = await client.query({
      text: `SELECT COUNT(*) FROM lucid_processed_images`
    });
    return Number(processedImages.rows[0].count);
  };
};

// src/services/processed-images/clear-single.ts
var clearSingle = async (client, data) => {
  const media = await service_default(
    media_default.getSingle,
    false,
    client
  )({
    id: data.id
  });
  const processedImages = await ProcessedImage.getAllByMediaKey(client, {
    media_key: media.key
  });
  if (processedImages.length > 0) {
    await s3_default.deleteObjects({
      objects: processedImages.map((processedImage) => ({
        key: processedImage.key
      }))
    });
    await ProcessedImage.deleteAllByMediaKey(client, {
      media_key: media.key
    });
  }
  return;
};
var clear_single_default = clearSingle;

// src/services/processed-images/clear-all.ts
var clearAll = async (client) => {
  const processedImages = await ProcessedImage.getAll(client);
  if (processedImages.length > 0) {
    await s3_default.deleteObjects({
      objects: processedImages.map((processedImage) => ({
        key: processedImage.key
      }))
    });
    await ProcessedImage.deleteAll(client);
  }
  return;
};
var clear_all_default = clearAll;

// src/services/processed-images/process-image.ts
import { PassThrough } from "stream";

// src/workers/process-image.ts
import sharp2 from "sharp";
import { parentPort, Worker } from "worker_threads";
import path4 from "path";
import mime2 from "mime-types";
var currentDir3 = get_dirname_default(import.meta.url);
parentPort?.on("message", async (data) => {
  try {
    const transform = sharp2(data.buffer);
    if (data.options.format) {
      transform.toFormat(data.options.format, {
        quality: data.options.quality ? parseInt(data.options.quality) : 80
      });
    }
    if (data.options.width || data.options.height) {
      transform.resize({
        width: data.options.width ? parseInt(data.options.width) : void 0,
        height: data.options.height ? parseInt(data.options.height) : void 0
      });
    }
    const outputBuffer = await transform.toBuffer();
    const meta = await sharp2(outputBuffer).metadata();
    const mimeType = mime2.lookup(data.options.format || "jpg") || "image/jpeg";
    const response = {
      success: true,
      data: {
        buffer: outputBuffer,
        mimeType,
        size: outputBuffer.length,
        width: meta.width || null,
        height: meta.height || null,
        extension: mime2.extension(mimeType) || ""
      }
    };
    parentPort?.postMessage(response);
  } catch (error) {
    const response = {
      success: false,
      error: error.message
    };
    parentPort?.postMessage(response);
  }
});
var useProcessImage = async (data) => {
  const worker = new Worker(path4.join(currentDir3, "process-image.ts"));
  return new Promise((resolve, reject) => {
    worker.on(
      "message",
      (message) => {
        if (message.success) {
          resolve(message.data);
        } else {
          reject(new Error(message.error));
        }
      }
    );
    worker.postMessage(data);
  });
};
var process_image_default = useProcessImage;

// src/services/processed-images/process-image.ts
var saveAndRegister = async (client, data, image) => {
  try {
    await s3_default.saveObject({
      type: "buffer",
      key: data.processKey,
      buffer: image.buffer,
      meta: {
        mimeType: image.mimeType,
        fileExtension: image.extension,
        size: image.size,
        width: image.width,
        height: image.height
      }
    });
    await ProcessedImage.createSingle(client, {
      key: data.processKey,
      media_key: data.key
    });
  } catch (err) {
  }
};
var processImage = async (client, data) => {
  const s3Response = await media_default.getS3Object({
    key: data.key
  });
  if (!s3Response.contentType?.startsWith("image/")) {
    return {
      contentLength: s3Response.contentLength,
      contentType: s3Response.contentType,
      body: s3Response.body
    };
  }
  try {
    await processed_images_default.getSingleCount(client, {
      key: data.key
    });
  } catch (err) {
    return {
      contentLength: s3Response.contentLength,
      contentType: s3Response.contentType,
      body: s3Response.body
    };
  }
  const processRes = await process_image_default({
    buffer: await helpers_default.streamToBuffer(s3Response.body),
    options: data.options
  });
  const stream = new PassThrough();
  stream.end(Buffer.from(processRes.buffer));
  saveAndRegister(client, data, processRes);
  return {
    contentLength: processRes.size,
    contentType: processRes.mimeType,
    body: stream
  };
};
var process_image_default2 = processImage;

// src/services/processed-images/get-single-count.ts
var getSingleCount = async (client, data) => {
  const limit = Config.media.processedImageLimit;
  const count = await ProcessedImage.getAllByMediaKeyCount(client, {
    media_key: data.key
  });
  if (count >= limit) {
    throw new LucidError({
      type: "basic",
      name: "Processed image limit reached",
      message: `The processed image limit of ${limit} has been reached for this image.`,
      status: 400
    });
  }
  return count;
};
var get_single_count_default = getSingleCount;

// src/services/processed-images/index.ts
var processed_images_default = {
  clearSingle: clear_single_default,
  clearAll: clear_all_default,
  processImage: process_image_default2,
  getSingleCount: get_single_count_default
};

// src/services/media/delete-single.ts
var deleteSingle8 = async (client, data) => {
  const media = await service_default(
    media_default.getSingle,
    false,
    client
  )({
    id: data.id
  });
  await service_default(
    processed_images_default.clearSingle,
    false,
    client
  )({
    id: media.id
  });
  await Media.deleteSingle(client, {
    key: media.key
  });
  await s3_default.deleteObject({
    key: media.key
  });
  await service_default(
    media_default.setStorageUsed,
    false,
    client
  )({
    add: 0,
    minus: media.meta.file_size
  });
  return void 0;
};
var delete_single_default9 = deleteSingle8;

// src/services/media/get-multiple.ts
var getMultiple6 = async (client, data) => {
  const { filter, sort, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "key",
      "e_tag",
      "type",
      "name",
      "alt",
      "mime_type",
      "file_extension",
      "file_size",
      "width",
      "height",
      "created_at",
      "updated_at"
    ],
    filter: {
      data: filter,
      meta: {
        type: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        name: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        key: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        mime_type: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        file_extension: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const mediasRes = await Media.getMultiple(client, SelectQuery);
  return {
    data: mediasRes.data.map((media) => format_media_default(media)),
    count: mediasRes.count
  };
};
var get_multiple_default7 = getMultiple6;

// src/services/media/get-single.ts
var getSingle9 = async (client, data) => {
  const media = await Media.getSingleById(client, {
    id: data.id
  });
  if (!media) {
    throw new LucidError({
      type: "basic",
      name: "Media not found",
      message: "We couldn't find the media you were looking for.",
      status: 404
    });
  }
  return format_media_default(media);
};
var get_single_default10 = getSingle9;

// src/services/media/update-single.ts
var updateSingle4 = async (client, data) => {
  const media = await service_default(
    media_default.getSingle,
    false,
    client
  )({
    id: data.id
  });
  let meta = void 0;
  let newKey = void 0;
  let newType = void 0;
  if (data.data.files && data.data.files["file"]) {
    const files = helpers_default.formatReqFiles(data.data.files);
    const firstFile = files[0];
    await service_default(
      media_default.canStoreFiles,
      false,
      client
    )({
      files
    });
    meta = await helpers_default.getMetaData(firstFile);
    newKey = helpers_default.uniqueKey(data.data.name || firstFile.name);
    newType = helpers_default.getMediaType(meta.mimeType);
    const updateKeyRes = await s3_default.updateObjectKey({
      oldKey: media.key,
      newKey
    });
    if (updateKeyRes.$metadata.httpStatusCode !== 200) {
      throw new LucidError({
        type: "basic",
        name: "Error updating file",
        message: "There was an error updating the file.",
        status: 500,
        errors: modelErrors({
          file: {
            code: "required",
            message: "There was an error updating the file."
          }
        })
      });
    }
    const response = await s3_default.saveObject({
      type: "file",
      key: newKey,
      file: firstFile,
      meta
    });
    if (response.$metadata.httpStatusCode !== 200) {
      throw new LucidError({
        type: "basic",
        name: "Error updating file",
        message: "There was an error updating the file.",
        status: 500,
        errors: modelErrors({
          file: {
            code: "required",
            message: "There was an error updating the file."
          }
        })
      });
    }
    await service_default(
      media_default.setStorageUsed,
      false,
      client
    )({
      add: meta.size,
      minus: media.meta.file_size
    });
    await service_default(
      processed_images_default.clearSingle,
      false,
      client
    )({
      id: media.id
    });
  }
  const mediaUpdate = await Media.updateSingle(client, {
    key: media.key,
    name: data.data.name,
    alt: data.data.alt,
    meta,
    type: newType,
    newKey
  });
  if (!mediaUpdate) {
    throw new LucidError({
      type: "basic",
      name: "Error updating media",
      message: "There was an error updating the media.",
      status: 500
    });
  }
  return void 0;
};
var update_single_default6 = updateSingle4;

// src/services/media/stream-media.ts
var streamMedia = async (data) => {
  if (data.query?.format === void 0 && data.query?.width === void 0 && data.query?.height === void 0) {
    return await media_default.getS3Object({
      key: data.key
    });
  }
  const processKey = helpers_default.createProcessKey({
    key: data.key,
    query: data.query
  });
  try {
    return await media_default.getS3Object({
      key: processKey
    });
  } catch (err) {
    return await service_default(
      processed_images_default.processImage,
      false
    )({
      key: data.key,
      processKey,
      options: data.query
    });
  }
};
var stream_media_default = streamMedia;

// src/services/media/can-store-files.ts
var canStoreFiles = async (client, data) => {
  const { storageLimit, maxFileSize } = Config.media;
  for (let i = 0; i < data.files.length; i++) {
    const file = data.files[i];
    if (file.size > maxFileSize) {
      const message = `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`;
      throw new LucidError({
        type: "basic",
        name: "Error saving file",
        message,
        status: 500,
        errors: modelErrors({
          file: {
            code: "storage_limit",
            message
          }
        })
      });
    }
  }
  const storageUsed = await service_default(
    media_default.getStorageUsed,
    false,
    client
  )();
  const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
  if (totalSize + (storageUsed || 0) > storageLimit) {
    const message = `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`;
    throw new LucidError({
      type: "basic",
      name: "Error saving file",
      message,
      status: 500,
      errors: modelErrors({
        file: {
          code: "storage_limit",
          message
        }
      })
    });
  }
};
var can_store_files_default = canStoreFiles;

// src/db/models/Option.ts
var Option = class {
  static getByName = async (client, data) => {
    const options = await client.query({
      text: `SELECT * FROM lucid_options WHERE option_name = $1`,
      values: [data.name]
    });
    return options.rows[0];
  };
  static patchByName = async (client, data) => {
    const options = await client.query({
      text: `UPDATE lucid_options SET option_value = $1, type = $2, updated_at = NOW() WHERE option_name = $3 RETURNING *`,
      values: [data.value, data.type, data.name]
    });
    return options.rows[0];
  };
};

// src/utils/format/format-option.ts
var formatOptions = (options) => {
  const formattedOptions = {};
  options.forEach((option) => {
    formattedOptions[option.option_name] = option.option_value;
  });
  return formattedOptions;
};
var format_option_default = formatOptions;

// src/utils/options/convert-to-type.ts
var convertToType = (option) => {
  switch (option.type) {
    case "boolean":
      option.option_value = option.option_value === "true" ? true : false;
      break;
    case "number":
      option.option_value = parseInt(option.option_value);
      break;
    case "json":
      option.option_value = JSON.parse(option.option_value);
      break;
    default:
      option.option_value;
      break;
  }
  return option;
};
var convert_to_type_default = convertToType;

// src/services/options/get-by-name.ts
var getByName = async (client, data) => {
  const option = await Option.getByName(client, {
    name: data.name
  });
  if (!option) {
    throw new LucidError({
      type: "basic",
      name: "Option Not Found",
      message: "There was an error finding the option.",
      status: 500,
      errors: modelErrors({
        option_name: {
          code: "not_found",
          message: "Option not found."
        }
      })
    });
  }
  const convertOptionType = convert_to_type_default(option);
  return format_option_default([convertOptionType]);
};
var get_by_name_default = getByName;

// src/utils/options/convert-to-string.ts
var convertToString = (value, type) => {
  switch (type) {
    case "boolean":
      value = value ? "true" : "false";
      break;
    case "json":
      value = JSON.stringify(value);
      break;
    default:
      value = value.toString();
      break;
  }
  return value;
};
var convert_to_string_default = convertToString;

// src/services/options/patch-by-name.ts
var patchByName = async (client, data) => {
  const value = convert_to_string_default(data.value, data.type);
  const option = await Option.patchByName(client, {
    name: data.name,
    value,
    type: data.type
  });
  if (!option) {
    throw new LucidError({
      type: "basic",
      name: "Option Not Found",
      message: "There was an error patching the option.",
      status: 500,
      errors: modelErrors({
        option_name: {
          code: "not_found",
          message: "Option not found."
        }
      })
    });
  }
  const convertOptionType = convert_to_type_default(option);
  return format_option_default([convertOptionType]);
};
var patch_by_name_default = patchByName;

// src/services/options/index.ts
var options_default = {
  getByName: get_by_name_default,
  patchByName: patch_by_name_default
};

// src/services/media/get-storage-used.ts
var getStorageUsed = async (client) => {
  const res = await service_default(
    options_default.getByName,
    false,
    client
  )({
    name: "media_storage_used"
  });
  return res.media_storage_used;
};
var get_storage_used_default = getStorageUsed;

// src/services/media/set-storage-used.ts
var getStorageUsed2 = async (client, data) => {
  const storageUsed = await service_default(
    media_default.getStorageUsed,
    false,
    client
  )();
  let newValue = (storageUsed || 0) + data.add;
  if (data.minus !== void 0) {
    newValue = newValue - data.minus;
  }
  const res = await service_default(
    options_default.patchByName,
    false,
    client
  )({
    name: "media_storage_used",
    value: newValue,
    type: "number"
  });
  return res.media_storage_used;
};
var set_storage_used_default = getStorageUsed2;

// src/services/media/get-single-by-id.ts
var getSingleById = async (client, data) => {
  const media = await Media.getSingle(client, {
    key: data.key
  });
  if (!media) {
    throw new LucidError({
      type: "basic",
      name: "Media not found",
      message: "We couldn't find the media you were looking for.",
      status: 404
    });
  }
  return format_media_default(media);
};
var get_single_by_id_default = getSingleById;

// src/services/media/get-multiple-by-ids.ts
var getMultipleByIds = async (client, data) => {
  const mediasRes = await Media.getMultipleByIds(client, {
    ids: data.ids
  });
  if (!mediasRes) {
    return [];
  }
  return mediasRes.map((media) => format_media_default(media));
};
var get_multiple_by_ids_default = getMultipleByIds;

// src/services/media/stream-error-image.ts
import fs4 from "fs-extra";
import path5 from "path";
var currentDir4 = get_dirname_default(import.meta.url);
var pipeLocalImage = (res) => {
  let pathVal = path5.join(currentDir4, "../../assets/404.jpg");
  let contentType = "image/jpeg";
  const steam = fs4.createReadStream(pathVal);
  res.setHeader("Content-Type", contentType);
  steam.pipe(res);
};
var streamErrorImage = async (data) => {
  const error = decodeError(data.error);
  if (error.status !== 404) {
    data.next(data.error);
    return;
  }
  if (Config.media.fallbackImage === false || data.fallback === "0") {
    data.next(
      new LucidError({
        type: "basic",
        name: "Error",
        message: "We're sorry, but this image is not available.",
        status: 404
      })
    );
    return;
  }
  if (Config.media.fallbackImage === void 0) {
    pipeLocalImage(data.res);
    return;
  }
  try {
    const { buffer, contentType } = await media_default.pipeRemoteURL({
      url: Config.media.fallbackImage
    });
    data.res.setHeader("Content-Type", contentType || "image/jpeg");
    data.res.send(buffer);
  } catch (err) {
    pipeLocalImage(data.res);
    return;
  }
};
var stream_error_image_default = streamErrorImage;

// src/services/media/get-s3-object.ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
var getS3Object = async (data) => {
  try {
    const S3 = await s3_client_default;
    const command = new GetObjectCommand({
      Bucket: Config.media.store.bucket,
      Key: data.key
    });
    const res = await S3.send(command);
    return {
      contentLength: res.ContentLength,
      contentType: res.ContentType,
      body: res.Body
    };
  } catch (err) {
    const error = err;
    throw new LucidError({
      type: "basic",
      name: error.name || "Error",
      message: error.message || "An error occurred",
      status: error.message === "The specified key does not exist." ? 404 : 500
    });
  }
};
var get_s3_object_default = getS3Object;

// src/services/media/pipe-remote-url.ts
import https from "https";
var pipeRemoteURL = (data) => {
  return new Promise((resolve, reject) => {
    https.get(data.url, (response) => {
      const { statusCode } = response;
      const redirections = data?.redirections || 0;
      if (statusCode && statusCode >= 300 && statusCode < 400 && response.headers.location && redirections < 5) {
        pipeRemoteURL({
          url: response.headers.location,
          redirections: redirections + 1
        }).then(resolve).catch(reject);
        return;
      }
      if (statusCode !== 200) {
        reject(new Error(`Request failed. Status code: ${statusCode}`));
        return;
      }
      const contentType = response.headers["content-type"];
      if (contentType && !contentType.includes("image")) {
        reject(new Error("Content type is not an image"));
        return;
      }
      const chunks = [];
      response.on("data", (chunk) => {
        chunks.push(chunk);
      });
      response.on("end", () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType
        });
      });
      response.on("error", (error) => {
        reject(new Error("Error fetching the fallback image"));
      });
    }).on("error", (error) => {
      reject(new Error("Error with the HTTPS request"));
    });
  });
};
var pipe_remote_url_default = pipeRemoteURL;

// src/services/media/index.ts
var media_default = {
  createSingle: create_single_default7,
  deleteSingle: delete_single_default9,
  getMultiple: get_multiple_default7,
  getSingle: get_single_default10,
  updateSingle: update_single_default6,
  streamMedia: stream_media_default,
  canStoreFiles: can_store_files_default,
  getStorageUsed: get_storage_used_default,
  setStorageUsed: set_storage_used_default,
  getSingleById: get_single_by_id_default,
  getMultipleByIds: get_multiple_by_ids_default,
  streamErrorImage: stream_error_image_default,
  getS3Object: get_s3_object_default,
  pipeRemoteURL: pipe_remote_url_default
};

// src/services/collection-bricks/validate-bricks.ts
var flattenAllBricks = (builder_bricks, fixed_bricks) => {
  if (!builder_bricks && !fixed_bricks)
    return {
      builder_bricks: [],
      fixed_bricks: [],
      flat_fields: []
    };
  const builderBricks = [];
  const fixedBricks = [];
  const flatBricks = [];
  for (let brick of builder_bricks) {
    const flatFields = flattenBricksFields(brick.fields);
    builderBricks.push({
      brick_key: brick.key,
      flat_fields: flatFields
    });
    flatBricks.push(...flatFields);
  }
  for (let brick of fixed_bricks) {
    const flatFields = flattenBricksFields(brick.fields);
    fixedBricks.push({
      brick_key: brick.key,
      flat_fields: flatFields
    });
    flatBricks.push(...flatFields);
  }
  return {
    builder_bricks: builderBricks,
    fixed_bricks: fixedBricks,
    flat_fields: flatBricks
  };
};
var flattenBricksFields = (fields) => {
  let flatFields = [];
  if (!fields)
    return flatFields;
  for (let brick of fields) {
    let flatBrick = {
      fields_id: brick.fields_id,
      parent_repeater: brick.parent_repeater,
      key: brick.key,
      type: brick.type,
      value: brick.value,
      target: brick.target,
      group_position: brick.group_position
    };
    Object.keys(flatBrick).forEach(
      // @ts-ignore
      (key) => flatBrick[key] === void 0 && delete flatBrick[key]
    );
    flatFields.push(flatBrick);
    if (brick.items) {
      flatFields = flatFields.concat(flattenBricksFields(brick.items));
    }
  }
  return flatFields;
};
var errorKey = (key, group_position) => {
  return group_position ? `${key}[${group_position}]` : key;
};
var buildErrorObject = (brickErrors) => {
  const errorObject = {};
  brickErrors.forEach((brick, index) => {
    const brickKeyWithIndex = `${brick.key}[${index}]`;
    errorObject[brickKeyWithIndex] = {};
    brick.errors.forEach((error) => {
      const brickObj = errorObject[brickKeyWithIndex];
      brickObj[error.key] = {
        code: "invalid",
        message: error.message || "Invalid value."
      };
    });
  });
  return errorObject;
};
var validateBricksGroup = async (data) => {
  const errors = [];
  let hasErrors = false;
  for (let i = 0; i < data.bricks.length; i++) {
    const brick = data.bricks[i];
    const brickErrors = {
      key: brick.brick_key,
      errors: []
    };
    const instance = data.builderInstances.find(
      (b) => b.key === brick.brick_key
    );
    if (!instance) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404
      });
    }
    const allowed = brick_config_default.isBrickAllowed({
      key: brick.brick_key,
      type: data.type,
      environment: data.environment,
      collection: data.collection
    });
    if (!allowed.allowed) {
      throw new LucidError({
        type: "basic",
        name: "Brick not allowed",
        message: `The brick "${brick.brick_key}" of type "${data.type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
        status: 500
      });
    }
    const flatFields = brick.flat_fields;
    for (let j = 0; j < flatFields.length; j++) {
      const field = flatFields[j];
      let referenceData = void 0;
      switch (field.type) {
        case "link": {
          referenceData = {
            target: field.target
          };
          break;
        }
        case "pagelink": {
          const page = data.pages.find((p) => p.id === field.value);
          if (page) {
            referenceData = {
              target: field.target
            };
          }
          break;
        }
        case "media": {
          const media = data.media.find((m) => m.id === field.value);
          if (media) {
            referenceData = {
              extension: media.meta.file_extension,
              width: media.meta.width,
              height: media.meta.height
            };
          }
          break;
        }
      }
      const err = instance.fieldValidation({
        key: field.key,
        value: field.value,
        type: field.type,
        referenceData,
        flatFieldConfig: instance.flatFields
      });
      if (err.valid === false) {
        brickErrors.errors.push({
          key: errorKey(field.key, field.group_position),
          message: err.message
        });
        hasErrors = true;
      }
    }
    errors.push(brickErrors);
  }
  return { errors, hasErrors };
};
var getAllMedia = async (client, fields) => {
  try {
    const getIDs = fields.map((field) => {
      if (field.type === "media") {
        return field.value;
      }
    });
    const ids = getIDs.filter((id) => id !== void 0).filter(
      (value, index, self) => self.indexOf(value) === index
    );
    const media = await service_default(
      media_default.getMultipleByIds,
      false,
      client
    )({
      ids
    });
    return media;
  } catch (err) {
    return [];
  }
};
var getAllPages = async (client, fields, environment_key) => {
  try {
    const getIDs = fields.map((field) => {
      if (field.type === "pagelink") {
        return field.value;
      }
    });
    const ids = getIDs.filter((id) => id !== void 0).filter(
      (value, index, self) => self.indexOf(value) === index
    );
    const pages = await service_default(
      pages_default2.getMultipleById,
      false,
      client
    )({
      ids,
      environment_key
    });
    return pages;
  } catch (err) {
    return [];
  }
};
var validateBricks = async (client, data) => {
  const builderInstances = brick_config_default.getBrickConfig();
  const bricksFlattened = flattenAllBricks(
    data.builder_bricks,
    data.fixed_bricks
  );
  const pageMediaPromises = await Promise.all([
    getAllMedia(client, bricksFlattened.flat_fields),
    getAllPages(client, bricksFlattened.flat_fields, data.environment.key)
  ]);
  const media = pageMediaPromises[0];
  const pages = pageMediaPromises[1];
  const { errors: builderErrors, hasErrors: builderHasErrors } = await validateBricksGroup({
    bricks: bricksFlattened.builder_bricks,
    builderInstances,
    collection: data.collection,
    environment: data.environment,
    type: "builder",
    media,
    pages
  });
  const { errors: fixedErrors, hasErrors: fixedHasErrors } = await validateBricksGroup({
    bricks: bricksFlattened.fixed_bricks,
    builderInstances,
    collection: data.collection,
    environment: data.environment,
    type: "fixed",
    media,
    pages
  });
  if (builderHasErrors || fixedHasErrors) {
    throw new LucidError({
      type: "basic",
      name: "Validation Error",
      message: "There was an error validating your bricks.",
      status: 400,
      errors: modelErrors({
        builder_bricks: buildErrorObject(builderErrors),
        fixed_bricks: buildErrorObject(fixedErrors)
      })
    });
  }
};
var validate_bricks_default = validateBricks;

// src/services/collection-bricks/index.ts
var collection_bricks_default = {
  updateMultiple: update_multiple_default2,
  upsertSingle: upsert_single_default2,
  upsertRepeater: upsert_repeater_default,
  checkFieldExists: check_field_exists_default,
  upsertField: upsert_field_default,
  getAll: get_all_default5,
  deleteUnused: delete_unused_default,
  validateBricks: validate_bricks_default
};

// src/services/pages/get-single.ts
var getSingle10 = async (client, data) => {
  const { include } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",
      "parent_id",
      "title",
      "slug",
      "full_slug",
      "homepage",
      "excerpt",
      "published",
      "published_at",
      "published_by",
      "created_by",
      "created_at",
      "updated_at"
    ],
    exclude: void 0,
    filter: {
      data: {
        id: data.id.toString(),
        environment_key: data.environment_key
      },
      meta: {
        id: {
          operator: "=",
          type: "int",
          columnType: "standard"
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort: void 0,
    page: void 0,
    per_page: void 0
  });
  const page = await Page.getSingle(client, SelectQuery);
  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page not found",
      message: `Page with id "${data.id}" not found`,
      status: 404
    });
  }
  if (include && include.includes("bricks")) {
    const collection = await service_default(
      collections_default.getSingle,
      false,
      client
    )({
      collection_key: page.collection_key,
      environment_key: page.environment_key,
      type: "pages"
    });
    const pageBricks = await service_default(
      collection_bricks_default.getAll,
      false,
      client
    )({
      reference_id: page.id,
      type: "pages",
      environment_key: data.environment_key,
      collection
    });
    page.builder_bricks = pageBricks.builder_bricks;
    page.fixed_bricks = pageBricks.fixed_bricks;
  }
  return format_page_default(page);
};
var get_single_default11 = getSingle10;

// src/services/pages/update-single.ts
var updateSingle5 = async (client, data) => {
  const currentPage = await service_default(
    pages_default2.checkPageExists,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key
  });
  const [environment, collection] = await Promise.all([
    service_default(
      environments_default.getSingle,
      false,
      client
    )({
      key: data.environment_key
    }),
    service_default(
      collections_default.getSingle,
      false,
      client
    )({
      collection_key: currentPage.collection_key,
      environment_key: data.environment_key,
      type: "pages"
    })
  ]);
  const parentId = data.homepage ? void 0 : data.parent_id;
  if (parentId) {
    await service_default(
      pages_default2.parentChecks,
      false,
      client
    )({
      parent_id: parentId,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key
    });
  }
  await service_default(
    collection_bricks_default.validateBricks,
    false,
    client
  )({
    builder_bricks: data.builder_bricks || [],
    fixed_bricks: data.fixed_bricks || [],
    collection,
    environment
  });
  let newSlug = void 0;
  if (data.slug) {
    newSlug = await service_default(
      pages_default2.buildUniqueSlug,
      false,
      client
    )({
      slug: data.slug,
      homepage: data.homepage || false,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
      parent_id: parentId
    });
  }
  const page = await Page.updateSingle(client, {
    id: data.id,
    environment_key: data.environment_key,
    userId: data.userId,
    title: data.title,
    slug: newSlug,
    homepage: data.homepage,
    parent_id: parentId,
    category_ids: data.category_ids,
    published: data.published,
    excerpt: data.excerpt,
    builder_bricks: data.builder_bricks,
    fixed_bricks: data.fixed_bricks
  });
  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Updated",
      message: "There was an error updating the page",
      status: 500
    });
  }
  await Promise.all([
    data.category_ids ? service_default(
      page_categories_default.updateMultiple,
      false,
      client
    )({
      page_id: page.id,
      category_ids: data.category_ids,
      collection_key: currentPage.collection_key
    }) : Promise.resolve(),
    service_default(
      collection_bricks_default.updateMultiple,
      false,
      client
    )({
      id: page.id,
      builder_bricks: data.builder_bricks || [],
      fixed_bricks: data.fixed_bricks || [],
      collection,
      environment
    })
  ]);
  return format_page_default(page);
};
var update_single_default7 = updateSingle5;

// src/services/pages/check-page-exists.ts
var checkPageExists = async (client, data) => {
  const page = await Page.getSingleBasic(client, {
    id: data.id,
    environment_key: data.environment_key
  });
  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page not found",
      message: `Page with id "${data.id}" not found in environment "${data.environment_key}"!`,
      status: 404
    });
  }
  return page;
};
var check_page_exists_default = checkPageExists;

// src/services/pages/build-unique-slug.ts
import slug3 from "slug";
var buildUniqueSlug = async (client, data) => {
  if (data.homepage) {
    return "/";
  }
  data.slug = slug3(data.slug, { lower: true });
  const slugCount = await Page.getSlugCount(client, {
    slug: data.slug,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    parent_id: data.parent_id
  });
  if (slugCount >= 1) {
    return `${data.slug}-${slugCount}`;
  } else {
    return data.slug;
  }
};
var build_unique_slug_default = buildUniqueSlug;

// src/services/pages/parent-checks.ts
var parentChecks = async (client, data) => {
  const parent = await service_default(
    pages_default2.checkPageExists,
    false,
    client
  )({
    id: data.parent_id,
    environment_key: data.environment_key
  });
  if (parent.homepage) {
    throw new LucidError({
      type: "basic",
      name: "Homepage Parent",
      message: "The homepage cannot be set as a parent!",
      status: 400
    });
  }
  if (parent.collection_key !== data.collection_key) {
    throw new LucidError({
      type: "basic",
      name: "Parent Collection Mismatch",
      message: "The parent page must be in the same collection as the page you are creating!",
      status: 400
    });
  }
  return parent;
};
var parent_checks_default = parentChecks;

// src/services/pages/reset-homepages.ts
import slug4 from "slug";
var resetHomepages = async (client, data) => {
  const homepages = await Page.getNonCurrentHomepages(client, {
    current_id: data.current,
    environment_key: data.environment_key
  });
  const updatePromises = homepages.map(async (homepage) => {
    let newSlug = slug4(homepage.title, { lower: true });
    const slugExists = await Page.checkSlugExistence(client, {
      slug: newSlug,
      id: homepage.id,
      environment_key: data.environment_key
    });
    if (slugExists) {
      newSlug += `-${homepage.id}`;
    }
    return Page.updatePageToNonHomepage(client, {
      id: homepage.id,
      slug: newSlug
    });
  });
  await Promise.all(updatePromises);
};
var reset_homepages_default = resetHomepages;

// src/services/pages/get-multiple-by-id.ts
var getMultipleById = async (client, data) => {
  const pages = await Page.getMultipleByIds(client, {
    ids: data.ids,
    environment_key: data.environment_key
  });
  return pages.map((page) => format_page_default(page));
};
var get_multiple_by_id_default = getMultipleById;

// src/services/pages/index.ts
var pages_default2 = {
  createSingle: create_single_default6,
  deleteSingle: delete_single_default8,
  getMultiple: get_multiple_default6,
  getSingle: get_single_default11,
  updateSingle: update_single_default7,
  checkPageExists: check_page_exists_default,
  buildUniqueSlug: build_unique_slug_default,
  parentChecks: parent_checks_default,
  resetHomepages: reset_homepages_default,
  getMultipleById: get_multiple_by_id_default
};

// src/controllers/pages/create-single.ts
var createSingleController = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.createSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      title: req.body.title,
      slug: req.body.slug,
      collection_key: req.body.collection_key,
      homepage: req.body.homepage,
      excerpt: req.body.excerpt,
      published: req.body.published,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      userId: req.auth.id
    });
    res.status(200).json(
      build_response_default(req, {
        data: page
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default8 = {
  schema: pages_default.createSingle,
  controller: createSingleController
};

// src/controllers/pages/get-multiple.ts
var getMultipleController2 = async (req, res, next) => {
  try {
    const pagesRes = await service_default(
      pages_default2.getMultiple,
      false
    )({
      query: req.query,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: pagesRes.data,
        pagination: {
          count: pagesRes.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default8 = {
  schema: pages_default.getMultiple,
  controller: getMultipleController2
};

// src/controllers/pages/get-single.ts
var getSingleController2 = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.getSingle,
      false
    )({
      query: req.query,
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: page
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default12 = {
  schema: pages_default.getSingle,
  controller: getSingleController2
};

// src/controllers/pages/update-single.ts
var updateSingleController2 = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.updateSingle,
      true
    )({
      id: parseInt(req.params.id),
      environment_key: req.headers["lucid-environment"],
      userId: req.auth.id,
      title: req.body.title,
      slug: req.body.slug,
      homepage: req.body.homepage,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      published: req.body.published,
      excerpt: req.body.excerpt,
      builder_bricks: req.body.builder_bricks,
      fixed_bricks: req.body.fixed_bricks
    });
    res.status(200).json(
      build_response_default(req, {
        data: page
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default8 = {
  schema: pages_default.updateSingle,
  controller: updateSingleController2
};

// src/controllers/pages/delete-single.ts
var deleteSingleController2 = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.deleteSingle,
      true
    )({
      id: parseInt(req.params.id),
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: page
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default10 = {
  schema: pages_default.deleteSingle,
  controller: deleteSingleController2
};

// src/routes/v1/pages.routes.ts
var router4 = Router4();
route_default(router4, {
  method: "post",
  path: "/",
  permissions: {
    environments: ["create_content"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: create_single_default8.schema,
  controller: create_single_default8.controller
});
route_default(router4, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
    validateEnvironment: true
  },
  schema: get_multiple_default8.schema,
  controller: get_multiple_default8.controller
});
route_default(router4, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default12.schema,
  controller: get_single_default12.controller
});
route_default(router4, {
  method: "patch",
  path: "/:id",
  permissions: {
    environments: ["update_content"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: update_single_default8.schema,
  controller: update_single_default8.controller
});
route_default(router4, {
  method: "delete",
  path: "/:id",
  permissions: {
    environments: ["delete_content"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: delete_single_default10.schema,
  controller: delete_single_default10.controller
});
var pages_routes_default = router4;

// src/routes/v1/single-pages.routes.ts
import { Router as Router5 } from "express";

// src/schemas/single-page.ts
import z10 from "zod";
var updateSingleBody3 = z10.object({
  builder_bricks: z10.array(BrickSchema).optional(),
  fixed_bricks: z10.array(BrickSchema).optional()
});
var updateSingleQuery3 = z10.object({});
var updateSingleParams3 = z10.object({
  collection_key: z10.string()
});
var getSingleBody3 = z10.object({});
var getSingleQuery4 = z10.object({});
var getSingleParams3 = z10.object({
  collection_key: z10.string()
});
var single_page_default = {
  updateSingle: {
    body: updateSingleBody3,
    query: updateSingleQuery3,
    params: updateSingleParams3
  },
  getSingle: {
    body: getSingleBody3,
    query: getSingleQuery4,
    params: getSingleParams3
  }
};

// src/db/models/SinglePage.ts
var SinglePage = class {
  static getSingle = async (client, query_instance) => {
    const singlepage = await client.query({
      text: `SELECT
          ${query_instance.query.select}
        FROM
          lucid_singlepages
        ${query_instance.query.where}`,
      values: query_instance.values
    });
    return singlepage.rows[0];
  };
  static createSingle = async (client, data) => {
    const res = await client.query({
      text: `INSERT INTO lucid_singlepages ( environment_key, collection_key, updated_by ) VALUES ($1, $2, $3) RETURNING *`,
      values: [data.environment_key, data.collection_key, data.user_id]
    });
    return res.rows[0];
  };
  static updateSingle = async (client, data) => {
    const updateSinglePage = await client.query({
      text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
      values: [data.user_id, data.id]
    });
    return updateSinglePage.rows[0];
  };
};

// src/services/single-pages/get-single.ts
var getSingle11 = async (client, data) => {
  const collection = await service_default(
    collections_default.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    type: "singlepage"
  });
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",
      "created_at",
      "updated_at",
      "updated_by"
    ],
    exclude: void 0,
    filter: {
      data: {
        collection_key: data.collection_key,
        environment_key: data.environment_key
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort: void 0,
    page: void 0,
    per_page: void 0
  });
  let singlepage = await SinglePage.getSingle(client, SelectQuery);
  if (!singlepage) {
    singlepage = await SinglePage.createSingle(client, {
      user_id: data.user_id,
      environment_key: data.environment_key,
      collection_key: data.collection_key,
      builder_bricks: [],
      fixed_bricks: []
    });
  }
  if (data.include_bricks) {
    const pageBricks = await service_default(
      collection_bricks_default.getAll,
      false,
      client
    )({
      reference_id: singlepage.id,
      type: "singlepage",
      environment_key: data.environment_key,
      collection
    });
    singlepage.builder_bricks = pageBricks.builder_bricks;
    singlepage.fixed_bricks = pageBricks.fixed_bricks;
  }
  return singlepage;
};
var get_single_default13 = getSingle11;

// src/services/single-pages/update-single.ts
var updateSingle6 = async (client, data) => {
  const environment = await service_default(
    environments_default.getSingle,
    false,
    client
  )({
    key: data.environment_key
  });
  const collection = await service_default(
    collections_default.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    type: "singlepage"
  });
  const getSinglepage = await service_default(
    single_pages_default.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key
  });
  await service_default(
    collection_bricks_default.validateBricks,
    false,
    client
  )({
    builder_bricks: data.builder_bricks || [],
    fixed_bricks: data.fixed_bricks || [],
    collection,
    environment
  });
  const singlepage = await SinglePage.updateSingle(client, {
    id: getSinglepage.id,
    user_id: data.user_id
  });
  await service_default(
    collection_bricks_default.updateMultiple,
    false,
    client
  )({
    id: singlepage.id,
    builder_bricks: data.builder_bricks || [],
    fixed_bricks: data.fixed_bricks || [],
    collection,
    environment
  });
  return await service_default(
    single_pages_default.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    include_bricks: true
  });
};
var update_single_default9 = updateSingle6;

// src/services/single-pages/index.ts
var single_pages_default = {
  getSingle: get_single_default13,
  updateSingle: update_single_default9
};

// src/controllers/single-pages/update-single.ts
var updateSingleController3 = async (req, res, next) => {
  try {
    const singlepage = await service_default(
      single_pages_default.updateSingle,
      true
    )({
      user_id: req.auth.id,
      environment_key: req.headers["lucid-environment"],
      collection_key: req.params.collection_key,
      builder_bricks: req.body.builder_bricks,
      fixed_bricks: req.body.fixed_bricks
    });
    res.status(200).json(
      build_response_default(req, {
        data: singlepage
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default10 = {
  schema: single_page_default.updateSingle,
  controller: updateSingleController3
};

// src/controllers/single-pages/get-single.ts
var getSingleController3 = async (req, res, next) => {
  try {
    const singlepage = await service_default(
      single_pages_default.getSingle,
      true
    )({
      user_id: req.auth.id,
      environment_key: req.headers["lucid-environment"],
      collection_key: req.params.collection_key,
      include_bricks: true
    });
    res.status(200).json(
      build_response_default(req, {
        data: singlepage
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default14 = {
  schema: single_page_default.getSingle,
  controller: getSingleController3
};

// src/routes/v1/single-pages.routes.ts
var router5 = Router5();
route_default(router5, {
  method: "patch",
  path: "/:collection_key",
  permissions: {
    environments: ["update_content"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: update_single_default10.schema,
  controller: update_single_default10.controller
});
route_default(router5, {
  method: "get",
  path: "/:collection_key",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default14.schema,
  controller: get_single_default14.controller
});
var single_pages_routes_default = router5;

// src/routes/v1/collections.routes.ts
import { Router as Router6 } from "express";

// src/schemas/collections.ts
import z11 from "zod";
var getAllBody = z11.object({});
var getAllQuery = z11.object({
  filter: z11.object({
    type: z11.enum(["pages", "singlepage"]).optional(),
    environment_key: z11.string().optional()
  }).optional(),
  include: z11.array(z11.enum(["bricks"])).optional()
});
var getAllParams = z11.object({});
var getSingleBody4 = z11.object({});
var getSingleQuery5 = z11.object({});
var getSingleParams4 = z11.object({
  collection_key: z11.string()
});
var collections_default2 = {
  getAll: {
    body: getAllBody,
    query: getAllQuery,
    params: getAllParams
  },
  getSingle: {
    body: getSingleBody4,
    query: getSingleQuery5,
    params: getSingleParams4
  }
};

// src/controllers/collections/get-all.ts
var getAllController = async (req, res, next) => {
  try {
    const collectionsRes = await service_default(
      collections_default.getAll,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: collectionsRes
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_all_default6 = {
  schema: collections_default2.getAll,
  controller: getAllController
};

// src/controllers/collections/get-single.ts
var getSingleController4 = async (req, res, next) => {
  try {
    const collectionsRes = await service_default(
      collections_default.getSingle,
      false
    )({
      collection_key: req.params.collection_key,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: collectionsRes
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default15 = {
  schema: collections_default2.getSingle,
  controller: getSingleController4
};

// src/routes/v1/collections.routes.ts
var router6 = Router6();
route_default(router6, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true
  },
  schema: get_all_default6.schema,
  controller: get_all_default6.controller
});
route_default(router6, {
  method: "get",
  path: "/:collection_key",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default15.schema,
  controller: get_single_default15.controller
});
var collections_routes_default = router6;

// src/routes/v1/environments.routes.ts
import { Router as Router7 } from "express";

// src/schemas/environments.ts
import z12 from "zod";
var getAllBody2 = z12.object({});
var getAllQuery2 = z12.object({});
var getAllParams2 = z12.object({});
var getSingleBody5 = z12.object({});
var getSingleQuery6 = z12.object({});
var getSingleParams5 = z12.object({
  key: z12.string()
});
var migrateEnvironmentBody = z12.object({});
var migrateEnvironmentQuery = z12.object({});
var migrateEnvironmentParams = z12.object({
  key: z12.string()
});
var updateSingleBody4 = z12.object({
  title: z12.string().optional(),
  assigned_bricks: z12.array(z12.string()).optional(),
  assigned_collections: z12.array(z12.string()).optional(),
  assigned_forms: z12.array(z12.string()).optional()
});
var updateSingleQuery4 = z12.object({});
var updateSingleParams4 = z12.object({
  key: z12.string()
});
var createSingleBody3 = z12.object({
  key: z12.string().min(4).max(64).refine((value) => /^[a-z-]+$/.test(value), {
    message: "Invalid key format. Only lowercase letters and dashes are allowed."
  }),
  title: z12.string(),
  assigned_bricks: z12.array(z12.string()).optional(),
  assigned_collections: z12.array(z12.string()).optional(),
  assigned_forms: z12.array(z12.string()).optional()
});
var createSingleQuery3 = z12.object({});
var createSingleParams3 = z12.object({});
var deleteSingleBody3 = z12.object({});
var deleteSingleQuery3 = z12.object({});
var deleteSingleParams3 = z12.object({
  key: z12.string()
});
var environments_default2 = {
  getAll: {
    body: getAllBody2,
    query: getAllQuery2,
    params: getAllParams2
  },
  getSingle: {
    body: getSingleBody5,
    query: getSingleQuery6,
    params: getSingleParams5
  },
  migrateEnvironment: {
    body: migrateEnvironmentBody,
    query: migrateEnvironmentQuery,
    params: migrateEnvironmentParams
  },
  updateSingle: {
    body: updateSingleBody4,
    query: updateSingleQuery4,
    params: updateSingleParams4
  },
  createSingle: {
    body: createSingleBody3,
    query: createSingleQuery3,
    params: createSingleParams3
  },
  deleteSingle: {
    body: deleteSingleBody3,
    query: deleteSingleQuery3,
    params: deleteSingleParams3
  }
};

// src/controllers/environments/get-all.ts
var getAllController2 = async (req, res, next) => {
  try {
    const environmentsRes = await service_default(environments_default.getAll, false)();
    res.status(200).json(
      build_response_default(req, {
        data: environmentsRes
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_all_default7 = {
  schema: environments_default2.getAll,
  controller: getAllController2
};

// src/controllers/environments/get-single.ts
var getSingleController5 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.getSingle,
      false
    )({
      key: req.params.key
    });
    res.status(200).json(
      build_response_default(req, {
        data: environment
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default16 = {
  schema: environments_default2.getSingle,
  controller: getSingleController5
};

// src/controllers/environments/update-single.ts
var updateSingleController4 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.upsertSingle,
      true
    )({
      data: {
        key: req.params.key,
        title: req.body.title,
        assigned_bricks: req.body.assigned_bricks,
        assigned_collections: req.body.assigned_collections,
        assigned_forms: req.body.assigned_forms
      },
      create: false
    });
    res.status(200).json(
      build_response_default(req, {
        data: environment
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default11 = {
  schema: environments_default2.updateSingle,
  controller: updateSingleController4
};

// src/controllers/environments/create-single.ts
var createSingleController2 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.upsertSingle,
      true
    )({
      data: {
        key: req.body.key,
        title: req.body.title,
        assigned_bricks: req.body.assigned_bricks,
        assigned_collections: req.body.assigned_collections,
        assigned_forms: req.body.assigned_forms
      },
      create: true
    });
    res.status(200).json(
      build_response_default(req, {
        data: environment
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default9 = {
  schema: environments_default2.createSingle,
  controller: createSingleController2
};

// src/controllers/environments/delete-single.ts
var deleteSingleController3 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.deleteSingle,
      true
    )({
      key: req.params.key
    });
    res.status(200).json(
      build_response_default(req, {
        data: environment
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default11 = {
  schema: environments_default2.deleteSingle,
  controller: deleteSingleController3
};

// src/controllers/environments/migrate-envrionment.ts
var migrateEnvironmentController = async (req, res, next) => {
  try {
    await environments_default.migrateEnvironment({});
    res.status(200).json(
      build_response_default(req, {
        data: {
          message: "Environment migrated successfully"
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var migrate_envrionment_default = {
  schema: environments_default2.migrateEnvironment,
  controller: migrateEnvironmentController
};

// src/routes/v1/environments.routes.ts
var router7 = Router7();
route_default(router7, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true
  },
  schema: get_all_default7.schema,
  controller: get_all_default7.controller
});
route_default(router7, {
  method: "delete",
  path: "/:key",
  permissions: {
    global: ["delete_environment"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: delete_single_default11.schema,
  controller: delete_single_default11.controller
});
route_default(router7, {
  method: "get",
  path: "/:key",
  middleware: {
    authenticate: true
  },
  schema: get_single_default16.schema,
  controller: get_single_default16.controller
});
route_default(router7, {
  method: "patch",
  path: "/:key",
  permissions: {
    global: ["update_environment"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: update_single_default11.schema,
  controller: update_single_default11.controller
});
route_default(router7, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_environment"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: create_single_default9.schema,
  controller: create_single_default9.controller
});
route_default(router7, {
  method: "post",
  path: "/:key/migrate",
  permissions: {
    global: ["migrate_environment"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: migrate_envrionment_default.schema,
  controller: migrate_envrionment_default.controller
});
var environments_routes_default = router7;

// src/routes/v1/roles.routes.ts
import { Router as Router8 } from "express";

// src/schemas/roles.ts
import z13 from "zod";
var createSingleBody4 = z13.object({
  name: z13.string().min(2),
  permission_groups: z13.array(
    z13.object({
      environment_key: z13.string().optional(),
      permissions: z13.array(z13.string())
    })
  )
});
var createSingleQuery4 = z13.object({});
var createSingleParams4 = z13.object({});
var updateSingleBody5 = z13.object({
  name: z13.string().min(2).optional(),
  permission_groups: z13.array(
    z13.object({
      environment_key: z13.string().optional(),
      permissions: z13.array(z13.string())
    })
  ).optional()
});
var updateSingleQuery5 = z13.object({});
var updateSingleParams5 = z13.object({
  id: z13.string()
});
var deleteSingleBody4 = z13.object({});
var deleteSingleQuery4 = z13.object({});
var deleteSingleParams4 = z13.object({
  id: z13.string()
});
var getMultipleQuery3 = z13.object({
  filter: z13.object({
    name: z13.string().optional(),
    role_ids: z13.union([z13.string(), z13.array(z13.string())]).optional()
  }).optional(),
  sort: z13.array(
    z13.object({
      key: z13.enum(["created_at", "name"]),
      value: z13.enum(["asc", "desc"])
    })
  ).optional(),
  include: z13.array(z13.enum(["permissions"])).optional(),
  page: z13.string().optional(),
  per_page: z13.string().optional()
});
var getMultipleParams3 = z13.object({});
var getMultipleBody3 = z13.object({});
var getSingleQuery7 = z13.object({});
var getSingleParams6 = z13.object({
  id: z13.string()
});
var getSingleBody6 = z13.object({});
var roles_default2 = {
  createSingle: {
    body: createSingleBody4,
    query: createSingleQuery4,
    params: createSingleParams4
  },
  updateSingle: {
    body: updateSingleBody5,
    query: updateSingleQuery5,
    params: updateSingleParams5
  },
  deleteSingle: {
    body: deleteSingleBody4,
    query: deleteSingleQuery4,
    params: deleteSingleParams4
  },
  getMultiple: {
    body: getMultipleBody3,
    query: getMultipleQuery3,
    params: getMultipleParams3
  },
  getSingle: {
    body: getSingleBody6,
    query: getSingleQuery7,
    params: getSingleParams6
  }
};

// src/controllers/roles/create-single.ts
var createSingleController3 = async (req, res, next) => {
  try {
    const role = await service_default(
      roles_default.createSingle,
      true
    )({
      name: req.body.name,
      permission_groups: req.body.permission_groups
    });
    res.status(200).json(
      build_response_default(req, {
        data: role
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default10 = {
  schema: roles_default2.createSingle,
  controller: createSingleController3
};

// src/controllers/roles/delete-single.ts
var deleteSingleController4 = async (req, res, next) => {
  try {
    const role = await service_default(
      roles_default.deleteSingle,
      true
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: role
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default12 = {
  schema: roles_default2.deleteSingle,
  controller: deleteSingleController4
};

// src/controllers/roles/update-single.ts
var updateSingleController5 = async (req, res, next) => {
  try {
    const role = await service_default(
      roles_default.updateSingle,
      true
    )({
      id: parseInt(req.params.id),
      name: req.body.name,
      permission_groups: req.body.permission_groups
    });
    res.status(200).json(
      build_response_default(req, {
        data: role
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default12 = {
  schema: roles_default2.updateSingle,
  controller: updateSingleController5
};

// src/controllers/roles/get-multiple.ts
var getMultipleController3 = async (req, res, next) => {
  try {
    const rolesRes = await service_default(
      roles_default.getMultiple,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: rolesRes.data,
        pagination: {
          count: rolesRes.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default9 = {
  schema: roles_default2.getMultiple,
  controller: getMultipleController3
};

// src/controllers/roles/get-single.ts
var getSingleController6 = async (req, res, next) => {
  try {
    const role = await service_default(
      roles_default.getSingle,
      false
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: role
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default17 = {
  schema: roles_default2.getSingle,
  controller: getSingleController6
};

// src/routes/v1/roles.routes.ts
var router8 = Router8();
route_default(router8, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true
  },
  schema: get_multiple_default9.schema,
  controller: get_multiple_default9.controller
});
route_default(router8, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true
  },
  schema: get_single_default17.schema,
  controller: get_single_default17.controller
});
route_default(router8, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_role"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: create_single_default10.schema,
  controller: create_single_default10.controller
});
route_default(router8, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_role"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: delete_single_default12.schema,
  controller: delete_single_default12.controller
});
route_default(router8, {
  method: "patch",
  path: "/:id",
  permissions: {
    global: ["update_role"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: update_single_default12.schema,
  controller: update_single_default12.controller
});
var roles_routes_default = router8;

// src/routes/v1/users.routes.ts
import { Router as Router9 } from "express";

// src/schemas/users.ts
import z14 from "zod";
var updateSingleBody6 = z14.object({
  role_ids: z14.array(z14.number()).optional(),
  super_admin: z14.boolean().optional()
});
var updateSingleQuery6 = z14.object({});
var updateSingleParams6 = z14.object({
  id: z14.string()
});
var createSingleBody5 = z14.object({
  email: z14.string().email(),
  username: z14.string(),
  password: z14.string().min(8),
  password_confirmation: z14.string().min(8),
  role_ids: z14.array(z14.number()),
  first_name: z14.string().optional(),
  last_name: z14.string().optional(),
  super_admin: z14.boolean().optional()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords must match",
  path: ["password_confirmation"]
});
var createSingleQuery5 = z14.object({});
var createSingleParams5 = z14.object({});
var deleteSingleBody5 = z14.object({});
var deleteSingleQuery5 = z14.object({});
var deleteSingleParams5 = z14.object({
  id: z14.string()
});
var getMultipleBody4 = z14.object({});
var getMultipleQuery4 = z14.object({
  filter: z14.object({
    first_name: z14.string().optional(),
    last_name: z14.string().optional(),
    email: z14.string().optional(),
    username: z14.string().optional()
  }).optional(),
  sort: z14.array(
    z14.object({
      key: z14.enum(["created_at"]),
      value: z14.enum(["asc", "desc"])
    })
  ).optional(),
  page: z14.string().optional(),
  per_page: z14.string().optional()
});
var getMultipleParams4 = z14.object({});
var getSingleBody7 = z14.object({});
var getSingleQuery8 = z14.object({});
var getSingleParams7 = z14.object({
  id: z14.string()
});
var users_default2 = {
  updateSingle: {
    body: updateSingleBody6,
    query: updateSingleQuery6,
    params: updateSingleParams6
  },
  createSingle: {
    body: createSingleBody5,
    query: createSingleQuery5,
    params: createSingleParams5
  },
  deleteSingle: {
    body: deleteSingleBody5,
    query: deleteSingleQuery5,
    params: deleteSingleParams5
  },
  getMultiple: {
    body: getMultipleBody4,
    query: getMultipleQuery4,
    params: getMultipleParams4
  },
  getSingle: {
    body: getSingleBody7,
    query: getSingleQuery8,
    params: getSingleParams7
  }
};

// src/controllers/users/update-single.ts
var updateSingleController6 = async (req, res, next) => {
  try {
    const userRoles = await service_default(users_default.updateSingle, true)(
      {
        user_id: parseInt(req.params.id),
        role_ids: req.body.role_ids,
        super_admin: req.body.super_admin
      },
      req.auth.id
    );
    res.status(200).json(
      build_response_default(req, {
        data: userRoles
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default13 = {
  schema: users_default2.updateSingle,
  controller: updateSingleController6
};

// src/controllers/users/create-single.ts
var createSingleController4 = async (req, res, next) => {
  try {
    const user = await service_default(users_default.registerSingle, true)(
      {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        super_admin: req.body.super_admin,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role_ids: req.body.role_ids
      },
      req.auth.id
    );
    res.status(200).json(
      build_response_default(req, {
        data: user
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default11 = {
  schema: users_default2.createSingle,
  controller: createSingleController4
};

// src/controllers/users/delete-single.ts
var deleteSingleController5 = async (req, res, next) => {
  try {
    const user = await service_default(
      users_default.deleteSingle,
      true
    )({
      user_id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: user
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default13 = {
  schema: users_default2.deleteSingle,
  controller: deleteSingleController5
};

// src/controllers/users/get-multiple.ts
var getMultipleController4 = async (req, res, next) => {
  try {
    const user = await service_default(
      users_default.getMultiple,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: user.data,
        pagination: {
          count: user.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default10 = {
  schema: users_default2.getMultiple,
  controller: getMultipleController4
};

// src/controllers/users/get-single.ts
var getSingleController7 = async (req, res, next) => {
  try {
    const user = await service_default(
      users_default.getSingle,
      false
    )({
      user_id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: user
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default18 = {
  schema: users_default2.getSingle,
  controller: getSingleController7
};

// src/routes/v1/users.routes.ts
var router9 = Router9();
route_default(router9, {
  method: "patch",
  path: "/:id",
  permissions: {
    global: ["update_user"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: update_single_default13.schema,
  controller: update_single_default13.controller
});
route_default(router9, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_user"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: create_single_default11.schema,
  controller: create_single_default11.controller
});
route_default(router9, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_user"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: delete_single_default13.schema,
  controller: delete_single_default13.controller
});
route_default(router9, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true
  },
  schema: get_multiple_default10.schema,
  controller: get_multiple_default10.controller
});
route_default(router9, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true
  },
  schema: get_single_default18.schema,
  controller: get_single_default18.controller
});
var users_routes_default = router9;

// src/routes/v1/permissions.routes.ts
import { Router as Router10 } from "express";

// src/schemas/permissions.ts
import z15 from "zod";
var getAllBody3 = z15.object({});
var getAllQuery3 = z15.object({});
var getAllParams3 = z15.object({});
var permissions_default2 = {
  getAll: {
    body: getAllBody3,
    query: getAllQuery3,
    params: getAllParams3
  }
};

// src/controllers/permissions/get-all.ts
var getAllController3 = async (req, res, next) => {
  try {
    const permissionsRes = format_permissions_default(Permissions.raw);
    res.status(200).json(
      build_response_default(req, {
        data: permissionsRes
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_all_default8 = {
  schema: permissions_default2.getAll,
  controller: getAllController3
};

// src/routes/v1/permissions.routes.ts
var router10 = Router10();
route_default(router10, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true
  },
  schema: get_all_default8.schema,
  controller: get_all_default8.controller
});
var permissions_routes_default = router10;

// src/routes/v1/bricks.routes.ts
import { Router as Router11 } from "express";

// src/controllers/brick-config/get-all.ts
var getAllController4 = async (req, res, next) => {
  try {
    const bricks = await service_default(
      brick_config_default.getAll,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: bricks
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_all_default9 = {
  schema: bricks_default.config.getAll,
  controller: getAllController4
};

// src/controllers/brick-config/get-single.ts
var getSingleController8 = async (req, res, next) => {
  try {
    const brick = await service_default(
      brick_config_default.getSingle,
      false
    )({
      brick_key: req.params.brick_key
    });
    res.status(200).json(
      build_response_default(req, {
        data: brick
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default19 = {
  schema: bricks_default.config.getSingle,
  controller: getSingleController8
};

// src/routes/v1/bricks.routes.ts
var router11 = Router11();
route_default(router11, {
  method: "get",
  path: "/config",
  middleware: {
    authenticate: true
  },
  schema: get_all_default9.schema,
  controller: get_all_default9.controller
});
route_default(router11, {
  method: "get",
  path: "/config/:brick_key",
  middleware: {
    authenticate: true
  },
  schema: get_single_default19.schema,
  controller: get_single_default19.controller
});
var bricks_routes_default = router11;

// src/routes/v1/menus.routes.ts
import { Router as Router12 } from "express";

// src/schemas/menus.ts
import z16 from "zod";
var BaseMenuItemSchema = z16.object({
  id: z16.number().optional(),
  url: z16.string().optional(),
  page_id: z16.number().optional(),
  name: z16.string().nonempty(),
  target: z16.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  meta: z16.any().optional()
});
var BaseMenuItemSchemaUpdate = z16.object({
  id: z16.number().optional(),
  url: z16.string().optional(),
  page_id: z16.number().optional(),
  name: z16.string().optional(),
  target: z16.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  meta: z16.any().optional()
});
var MenuItem = BaseMenuItemSchema.extend({
  children: z16.lazy(() => MenuItem.array().optional())
});
var MenuItemUpdate = BaseMenuItemSchemaUpdate.extend({
  children: z16.lazy(() => MenuItem.array().optional())
});
var createSingleBody6 = z16.object({
  key: z16.string().nonempty(),
  name: z16.string().nonempty(),
  description: z16.string().optional(),
  items: z16.array(MenuItem).optional()
});
var createSingleQuery6 = z16.object({});
var createSingleParams6 = z16.object({});
var deleteSingleBody6 = z16.object({});
var deleteSingleQuery6 = z16.object({});
var deleteSingleParams6 = z16.object({
  id: z16.string()
});
var getSingleBody8 = z16.object({});
var getSingleQuery9 = z16.object({});
var getSingleParams8 = z16.object({
  id: z16.string()
});
var getMultipleBody5 = z16.object({});
var getMultipleQuery5 = z16.object({
  filter: z16.object({
    name: z16.string().optional()
  }).optional(),
  sort: z16.array(
    z16.object({
      key: z16.enum(["created_at"]),
      value: z16.enum(["asc", "desc"])
    })
  ).optional(),
  include: z16.array(z16.enum(["items"])).optional(),
  page: z16.string().optional(),
  per_page: z16.string().optional()
});
var getMultipleParams5 = z16.object({});
var updateSingleBody7 = z16.object({
  key: z16.string().optional(),
  name: z16.string().optional(),
  description: z16.string().optional(),
  items: z16.array(MenuItemUpdate).optional()
});
var updateSingleQuery7 = z16.object({});
var updateSingleParams7 = z16.object({
  id: z16.string()
});
var menus_default = {
  createSingle: {
    body: createSingleBody6,
    query: createSingleQuery6,
    params: createSingleParams6
  },
  deleteSingle: {
    body: deleteSingleBody6,
    query: deleteSingleQuery6,
    params: deleteSingleParams6
  },
  getSingle: {
    body: getSingleBody8,
    query: getSingleQuery9,
    params: getSingleParams8
  },
  getMultiple: {
    body: getMultipleBody5,
    query: getMultipleQuery5,
    params: getMultipleParams5
  },
  updateSingle: {
    body: updateSingleBody7,
    query: updateSingleQuery7,
    params: updateSingleParams7
  }
};

// src/db/models/Menu.ts
var Menu = class {
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["environment_key", "key", "name", "description"],
      values: [data.environment_key, data.key, data.name, data.description]
    });
    const menu = await client.query({
      text: `INSERT INTO lucid_menus (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return menu.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const menu = await client.query({
      text: `DELETE FROM lucid_menus WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [data.id, data.environment_key]
    });
    return menu.rows[0];
  };
  static getSingle = async (client, data) => {
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "key",
        "environment_key",
        "name",
        "description",
        "created_at",
        "updated_at"
      ],
      filter: {
        data: {
          id: data.id.toString(),
          environment_key: data.environment_key
        },
        meta: {
          id: {
            operator: "=",
            type: "int",
            columnType: "standard"
          },
          environment_key: {
            operator: "=",
            type: "text",
            columnType: "standard"
          }
        }
      }
    });
    const menu = await client.query({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_menus
        ${SelectQuery.query.where}`,
      values: SelectQuery.values
    });
    return menu.rows[0];
  };
  static getMultiple = async (client, query_instance) => {
    const menus = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_menus ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT COUNT(DISTINCT lucid_menus.id) FROM lucid_menus ${query_instance.query.where} `,
      values: query_instance.countValues
    });
    const data = await Promise.all([menus, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static updateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["key", "name", "description"],
      values: [data.key, data.name, data.description],
      conditional: {
        hasValues: {
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    const menu = await client.query({
      text: `UPDATE 
            lucid_menus 
          SET 
            ${columns.formatted.update} 
          WHERE 
            id = $${aliases.value.length + 1}
          AND 
            environment_key = $${aliases.value.length + 2}
          RETURNING *`,
      values: [...values.value, data.id, data.environment_key]
    });
    return menu.rows[0];
  };
  static checkKeyIsUnique = async (client, data) => {
    const findMenu = await client.query({
      text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
      values: [data.key, data.environment_key]
    });
    return findMenu.rows[0];
  };
  // -------------------------------------------
  // Menu Items
  static getMenuItems = async (client, data) => {
    const menuItems = await client.query({
      text: `SELECT
          mi.*,
          p.full_slug
        FROM
          lucid_menu_items mi
        LEFT JOIN
          lucid_pages p ON mi.page_id = p.id
        WHERE
          mi.menu_id = ANY($1::int[])`,
      values: [data.menu_ids]
    });
    return menuItems.rows;
  };
  static getSingleItem = async (client, data) => {
    const menuItem = await client.query({
      text: `SELECT * FROM lucid_menu_items WHERE id = $1 AND menu_id = $2`,
      values: [data.id, data.menu_id]
    });
    return menuItem.rows[0];
  };
  static deleteItemsByIds = async (client, data) => {
    const deleted = await client.query({
      text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[]) RETURNING *`,
      values: [data.ids]
    });
    return deleted.rows;
  };
  static updateMenuItem = async (client, data) => {
    const res = await client.query({
      text: `UPDATE lucid_menu_items SET ${data.query_data.columns.formatted.update} WHERE id = $${data.query_data.aliases.value.length + 1} RETURNING *`,
      values: [...data.query_data.values.value, data.item_id]
    });
    return res.rows[0];
  };
  static createMenuItem = async (client, data) => {
    const res = await client.query({
      text: `INSERT INTO lucid_menu_items (${data.query_data.columns.formatted.insert}) VALUES (${data.query_data.aliases.formatted.insert}) RETURNING *`,
      values: data.query_data.values.value
    });
    return res.rows[0];
  };
};

// src/utils/format/format-menu.ts
var buildURL = (full_slug, url) => {
  if (full_slug) {
    if (full_slug === "/")
      return "/";
    return `/${full_slug}`;
  }
  return url;
};
var buildItems = (items, parent_id) => {
  const matchedItems = items?.filter((item) => item.parent_id === parent_id) || [];
  return matchedItems.map((item) => ({
    page_id: item.page_id,
    name: item.name,
    url: buildURL(item.full_slug, item.url),
    target: item.target,
    meta: item.meta,
    children: buildItems(items, item.id)
  }));
};
var formatMenu = (menu, items) => {
  const menuItems = items.filter((item) => item.menu_id === menu.id);
  const nestedItems = buildItems(menuItems, null);
  return {
    id: menu.id,
    key: menu.key,
    environment_key: menu.environment_key,
    name: menu.name,
    description: menu.description,
    created_at: menu.created_at,
    updated_at: menu.updated_at,
    items: nestedItems.length ? nestedItems : null
  };
};
var format_menu_default = formatMenu;

// src/services/menu/create-single.ts
var createSingle7 = async (client, data) => {
  await service_default(
    menu_default.checkKeyUnique,
    false,
    client
  )({
    key: data.key,
    environment_key: data.environment_key
  });
  const menu = await Menu.createSingle(client, {
    environment_key: data.environment_key,
    key: data.key,
    name: data.name,
    description: data.description
  });
  if (!menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Creation Error",
      message: "Menu could not be created",
      status: 500
    });
  }
  if (data.items) {
    await service_default(
      menu_default.upsertMultipleItems,
      false,
      client
    )({
      menu_id: menu.id,
      items: data.items
    });
  }
  const menuItems = await service_default(
    menu_default.getItems,
    false,
    client
  )({
    menu_ids: [menu.id]
  });
  return format_menu_default(menu, menuItems);
};
var create_single_default12 = createSingle7;

// src/services/menu/delete-single.ts
var deleteSingle9 = async (client, data) => {
  const menu = await Menu.deleteSingle(client, {
    environment_key: data.environment_key,
    id: data.id
  });
  if (!menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Delete Error",
      message: "Menu could not be deleted",
      status: 500
    });
  }
  return menu;
};
var delete_single_default14 = deleteSingle9;

// src/services/menu/get-multiple.ts
var getMultiple7 = async (client, data) => {
  const { filter, sort, include, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "key",
      "environment_key",
      "name",
      "description",
      "created_at",
      "updated_at"
    ],
    exclude: void 0,
    filter: {
      data: {
        ...filter,
        environment_key: data.environment_key
      },
      meta: {
        name: {
          operator: "%",
          type: "text",
          columnType: "standard"
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const menus = await Menu.getMultiple(client, SelectQuery);
  let menuItems = [];
  if (include && include.includes("items")) {
    menuItems = await service_default(
      menu_default.getItems,
      false,
      client
    )({
      menu_ids: menus.data.map((menu) => menu.id)
    });
  }
  return {
    data: menus.data.map((menu) => format_menu_default(menu, menuItems)),
    count: menus.count
  };
};
var get_multiple_default11 = getMultiple7;

// src/services/menu/get-single.ts
var getSingle12 = async (client, data) => {
  const menu = await Menu.getSingle(client, {
    environment_key: data.environment_key,
    id: data.id
  });
  if (!menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Get Error",
      message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
      status: 404
    });
  }
  const menuItems = await service_default(
    menu_default.getItems,
    false,
    client
  )({
    menu_ids: [menu.id]
  });
  return format_menu_default(menu, menuItems);
};
var get_single_default20 = getSingle12;

// src/services/menu/update-single.ts
var updateSingle7 = async (client, data) => {
  const getMenu = await service_default(
    menu_default.getSingle,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key
  });
  if (getMenu.key === data.key) {
    delete data.key;
  }
  if (data.key) {
    await service_default(
      menu_default.checkKeyUnique,
      false,
      client
    )({
      key: data.key,
      environment_key: data.environment_key
    });
  }
  const menu = await Menu.updateSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
    key: data.key,
    name: data.name,
    description: data.description
  });
  if (!menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Update Error",
      message: "Menu could not be updated",
      status: 500
    });
  }
  if (data.items) {
    const originalItems = await service_default(
      menu_default.getItems,
      false,
      client
    )({
      menu_ids: [getMenu.id]
    });
    const updatedItems = await service_default(
      menu_default.upsertMultipleItems,
      false,
      client
    )({
      menu_id: getMenu.id,
      items: data.items
    });
    const deleteItems = originalItems.filter((item) => {
      return updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) === -1;
    });
    await service_default(
      menu_default.deleteItemsByIds,
      false,
      client
    )({
      ids: deleteItems.map((item) => item.id)
    });
  }
  return await service_default(
    menu_default.getSingle,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key
  });
};
var update_single_default14 = updateSingle7;

// src/services/menu/check-key-unique.ts
var checkKeyUnique = async (client, data) => {
  const menu = await Menu.checkKeyIsUnique(client, {
    key: data.key,
    environment_key: data.environment_key
  });
  if (menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Key Already Exists",
      message: `Menu key "${data.key}" already exists in environment "${data.environment_key}"`,
      status: 400
    });
  }
};
var check_key_unique_default = checkKeyUnique;

// src/services/menu/get-items.ts
var getItems = async (client, data) => {
  const items = await Menu.getMenuItems(client, {
    menu_ids: data.menu_ids
  });
  return items;
};
var get_items_default = getItems;

// src/services/menu/get-single-item.ts
var getSingleItem = async (client, data) => {
  const menuItem = await Menu.getSingleItem(client, {
    id: data.id,
    menu_id: data.menu_id
  });
  if (!menuItem) {
    throw new LucidError({
      type: "basic",
      name: "Menu Item Not Found",
      message: `Menu item with id "${data.id}" not found in menu with id "${data.menu_id}"`,
      status: 404
    });
  }
  return menuItem;
};
var get_single_item_default = getSingleItem;

// src/services/menu/delete-items-by-ids.ts
var deleteItemsByIds = async (client, data) => {
  const deletedItems = await Menu.deleteItemsByIds(client, {
    ids: data.ids
  });
  if (deletedItems.length !== data.ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Menu Item Delete Error",
      message: "Menu items could not be deleted",
      status: 500
    });
  }
  return deletedItems;
};
var delete_items_by_ids_default = deleteItemsByIds;

// src/services/menu/upsert-multiple-items.ts
var upsertMultipleItems = async (client, data) => {
  const itemsRes = [];
  const promises = data.items.map(
    (item, i) => service_default(
      menu_default.upsertItem,
      false,
      client
    )({
      menu_id: data.menu_id,
      item,
      pos: i
    })
  );
  const res = await Promise.all(promises);
  res.forEach((items) => itemsRes.push(...items));
  return itemsRes;
};
var upsert_multiple_items_default = upsertMultipleItems;

// src/services/menu/upsert-item.ts
var upsertItem = async (client, data) => {
  const itemsRes = [];
  const queryData = queryDataFormat({
    columns: [
      "menu_id",
      "parent_id",
      "url",
      "page_id",
      "name",
      "target",
      "position",
      "meta"
    ],
    values: [
      data.menu_id,
      data.parentId,
      data.item.url,
      data.item.page_id,
      data.item.name,
      data.item.target,
      data.pos,
      data.item.meta
    ]
  });
  let newParentId = data.parentId;
  if (data.item.id) {
    await service_default(
      menu_default.getSingleItem,
      false,
      client
    )({
      id: data.item.id,
      menu_id: data.menu_id
    });
    const updatedItem = await Menu.updateMenuItem(client, {
      item_id: data.item.id,
      query_data: queryData
    });
    newParentId = updatedItem.id;
    itemsRes.push(updatedItem);
  } else {
    const newItem = await Menu.createMenuItem(client, {
      query_data: queryData
    });
    newParentId = newItem.id;
    itemsRes.push(newItem);
  }
  if (data.item.children) {
    const promises = data.item.children.map(
      (child, i) => service_default(
        upsertItem,
        false,
        client
      )({
        menu_id: data.menu_id,
        item: child,
        pos: i,
        parentId: newParentId
      })
      // recursive call to handle children
    );
    const childrenRes = await Promise.all(promises);
    childrenRes.forEach((res) => itemsRes.push(...res));
  }
  return itemsRes;
};
var upsert_item_default = upsertItem;

// src/services/menu/index.ts
var menu_default = {
  createSingle: create_single_default12,
  deleteSingle: delete_single_default14,
  getMultiple: get_multiple_default11,
  getSingle: get_single_default20,
  updateSingle: update_single_default14,
  checkKeyUnique: check_key_unique_default,
  getItems: get_items_default,
  getSingleItem: get_single_item_default,
  deleteItemsByIds: delete_items_by_ids_default,
  upsertMultipleItems: upsert_multiple_items_default,
  upsertItem: upsert_item_default
};

// src/controllers/menu/create-single.ts
var createSingleController5 = async (req, res, next) => {
  try {
    const menu = await service_default(
      menu_default.createSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      key: req.body.key,
      name: req.body.name,
      description: req.body.description,
      items: req.body.items
    });
    res.status(200).json(
      build_response_default(req, {
        data: menu
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default13 = {
  schema: menus_default.createSingle,
  controller: createSingleController5
};

// src/controllers/menu/delete-single.ts
var deleteSingleController6 = async (req, res, next) => {
  try {
    const menu = await service_default(
      menu_default.deleteSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: menu
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default15 = {
  schema: menus_default.deleteSingle,
  controller: deleteSingleController6
};

// src/controllers/menu/get-single.ts
var getSingleController9 = async (req, res, next) => {
  try {
    const menu = await service_default(
      menu_default.getSingle,
      false
    )({
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: menu
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default21 = {
  schema: menus_default.getSingle,
  controller: getSingleController9
};

// src/controllers/menu/get-multiple.ts
var getMultipleController5 = async (req, res, next) => {
  try {
    const menusRes = await service_default(
      menu_default.getMultiple,
      false
    )({
      query: req.query,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: menusRes.data,
        pagination: {
          count: menusRes.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default12 = {
  schema: menus_default.getMultiple,
  controller: getMultipleController5
};

// src/controllers/menu/update-single.ts
var updateSingleController7 = async (req, res, next) => {
  try {
    const menu = await service_default(
      menu_default.updateSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"],
      id: parseInt(req.params.id),
      key: req.body.key,
      name: req.body.name,
      description: req.body.description,
      items: req.body.items
    });
    res.status(200).json(
      build_response_default(req, {
        data: menu
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default15 = {
  schema: menus_default.updateSingle,
  controller: updateSingleController7
};

// src/routes/v1/menus.routes.ts
var router12 = Router12();
route_default(router12, {
  method: "post",
  path: "/",
  permissions: {
    environments: ["create_menu"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: create_single_default13.schema,
  controller: create_single_default13.controller
});
route_default(router12, {
  method: "delete",
  path: "/:id",
  permissions: {
    environments: ["delete_menu"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: delete_single_default15.schema,
  controller: delete_single_default15.controller
});
route_default(router12, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default21.schema,
  controller: get_single_default21.controller
});
route_default(router12, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
    validateEnvironment: true
  },
  schema: get_multiple_default12.schema,
  controller: get_multiple_default12.controller
});
route_default(router12, {
  method: "patch",
  path: "/:id",
  permissions: {
    environments: ["update_menu"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: update_single_default15.schema,
  controller: update_single_default15.controller
});
var menus_routes_default = router12;

// src/routes/v1/media.routes.ts
import { Router as Router13 } from "express";

// src/schemas/media.ts
import z17 from "zod";
var createSingleBody7 = z17.object({
  name: z17.string().optional(),
  alt: z17.string().optional()
});
var createSingleQuery7 = z17.object({});
var createSingleParams7 = z17.object({});
var streamSingleBody = z17.object({});
var streamSingleQuery = z17.object({
  width: z17.string().optional(),
  height: z17.string().optional(),
  format: z17.enum(["jpeg", "png", "webp", "avif"]).optional(),
  quality: z17.string().optional(),
  fallback: z17.enum(["1", "0"]).optional()
});
var streamSingleParams = z17.object({
  key: z17.string()
});
var getMultipleBody6 = z17.object({});
var getMultipleQuery6 = z17.object({
  filter: z17.object({
    name: z17.string().optional(),
    key: z17.string().optional(),
    mime_type: z17.union([z17.string(), z17.array(z17.string())]).optional(),
    type: z17.union([z17.string(), z17.array(z17.string())]).optional(),
    file_extension: z17.union([z17.string(), z17.array(z17.string())]).optional()
  }).optional(),
  sort: z17.array(
    z17.object({
      key: z17.enum([
        "created_at",
        "updated_at",
        "name",
        "file_size",
        "width",
        "height",
        "mime_type",
        "file_extension"
      ]),
      value: z17.enum(["asc", "desc"])
    })
  ).optional(),
  page: z17.string().optional(),
  per_page: z17.string().optional()
});
var getMultipleParams6 = z17.object({});
var getSingleBody9 = z17.object({});
var getSingleQuery10 = z17.object({});
var getSingleParams9 = z17.object({
  id: z17.string()
});
var deleteSingleBody7 = z17.object({});
var deleteSingleQuery7 = z17.object({});
var deleteSingleParams7 = z17.object({
  id: z17.string()
});
var updateSingleBody8 = z17.object({
  name: z17.string().optional(),
  alt: z17.string().optional()
});
var updateSingleQuery8 = z17.object({});
var updateSingleParams8 = z17.object({
  id: z17.string()
});
var clearSingleProcessedBody = z17.object({});
var clearSingleProcessedQuery = z17.object({});
var clearSingleProcessedParams = z17.object({
  id: z17.string()
});
var clearAllProcessedBody = z17.object({});
var clearAllProcessedQuery = z17.object({});
var clearAllProcessedParams = z17.object({});
var media_default2 = {
  createSingle: {
    body: createSingleBody7,
    query: createSingleQuery7,
    params: createSingleParams7
  },
  streamSingle: {
    body: streamSingleBody,
    query: streamSingleQuery,
    params: streamSingleParams
  },
  getMultiple: {
    body: getMultipleBody6,
    query: getMultipleQuery6,
    params: getMultipleParams6
  },
  getSingle: {
    body: getSingleBody9,
    query: getSingleQuery10,
    params: getSingleParams9
  },
  deleteSingle: {
    body: deleteSingleBody7,
    query: deleteSingleQuery7,
    params: deleteSingleParams7
  },
  updateSingle: {
    body: updateSingleBody8,
    query: updateSingleQuery8,
    params: updateSingleParams8
  },
  clearSingleProcessed: {
    body: clearSingleProcessedBody,
    query: clearSingleProcessedQuery,
    params: clearSingleProcessedParams
  },
  clearAllProcessed: {
    body: clearAllProcessedBody,
    query: clearAllProcessedQuery,
    params: clearAllProcessedParams
  }
};

// src/controllers/media/create-single.ts
var createSingleController6 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default.createSingle,
      true
    )({
      name: req.body.name,
      alt: req.body.alt,
      files: req.files
    });
    res.status(200).json(
      build_response_default(req, {
        data: media
      })
    );
  } catch (error) {
    next(error);
  }
};
var create_single_default14 = {
  schema: media_default2.createSingle,
  controller: createSingleController6
};

// src/controllers/media/get-multiple.ts
var getMultipleController6 = async (req, res, next) => {
  try {
    const mediasRes = await service_default(
      media_default.getMultiple,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: mediasRes.data,
        pagination: {
          count: mediasRes.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default13 = {
  schema: media_default2.getMultiple,
  controller: getMultipleController6
};

// src/controllers/media/get-single.ts
var getSingleController10 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default.getSingle,
      false
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: media
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default22 = {
  schema: media_default2.getSingle,
  controller: getSingleController10
};

// src/controllers/media/delete-single.ts
var deleteSingleController7 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default.deleteSingle,
      true
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: media
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default16 = {
  schema: media_default2.deleteSingle,
  controller: deleteSingleController7
};

// src/controllers/media/update-single.ts
var updateSingleController8 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default.updateSingle,
      true
    )({
      id: parseInt(req.params.id),
      data: {
        name: req.body.name,
        alt: req.body.alt,
        files: req.files
      }
    });
    res.status(200).json(
      build_response_default(req, {
        data: media
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_single_default16 = {
  schema: media_default2.updateSingle,
  controller: updateSingleController8
};

// src/controllers/media/clear-single-processed.ts
var clearSingleProcessedController = async (req, res, next) => {
  try {
    await service_default(
      processed_images_default.clearSingle,
      false
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: void 0
      })
    );
  } catch (error) {
    next(error);
  }
};
var clear_single_processed_default = {
  schema: media_default2.clearSingleProcessed,
  controller: clearSingleProcessedController
};

// src/controllers/media/clear-all-processed.ts
var clearAllProcessedController = async (req, res, next) => {
  try {
    await service_default(processed_images_default.clearAll, false)();
    res.status(200).json(
      build_response_default(req, {
        data: void 0
      })
    );
  } catch (error) {
    next(error);
  }
};
var clear_all_processed_default = {
  schema: media_default2.clearAllProcessed,
  controller: clearAllProcessedController
};

// src/routes/v1/media.routes.ts
var router13 = Router13();
route_default(router13, {
  method: "delete",
  path: "/processed",
  permissions: {
    global: ["update_media"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: clear_all_processed_default.schema,
  controller: clear_all_processed_default.controller
});
route_default(router13, {
  method: "post",
  path: "/",
  permissions: {
    global: ["create_media"]
  },
  middleware: {
    fileUpload: true,
    authenticate: true,
    authoriseCSRF: true
  },
  schema: create_single_default14.schema,
  controller: create_single_default14.controller
});
route_default(router13, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true
  },
  schema: get_multiple_default13.schema,
  controller: get_multiple_default13.controller
});
route_default(router13, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true
  },
  schema: get_single_default22.schema,
  controller: get_single_default22.controller
});
route_default(router13, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_media"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: delete_single_default16.schema,
  controller: delete_single_default16.controller
});
route_default(router13, {
  method: "patch",
  path: "/:id",
  permissions: {
    global: ["update_media"]
  },
  middleware: {
    fileUpload: true,
    authenticate: true,
    authoriseCSRF: true
  },
  schema: update_single_default16.schema,
  controller: update_single_default16.controller
});
route_default(router13, {
  method: "delete",
  path: "/:id/processed",
  permissions: {
    global: ["update_media"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: clear_single_processed_default.schema,
  controller: clear_single_processed_default.controller
});
var media_routes_default = router13;

// src/routes/v1/emails.routes.ts
import { Router as Router14 } from "express";

// src/schemas/email.ts
import z18 from "zod";
var getMultipleBody7 = z18.object({});
var getMultipleQuery7 = z18.object({
  filter: z18.object({
    to_address: z18.string().optional(),
    subject: z18.string().optional(),
    delivery_status: z18.union([z18.string(), z18.array(z18.string())]).optional()
  }).optional(),
  sort: z18.array(
    z18.object({
      key: z18.enum(["created_at", "updated_at"]),
      value: z18.enum(["asc", "desc"])
    })
  ).optional(),
  page: z18.string().optional(),
  per_page: z18.string().optional()
});
var getMultipleParams7 = z18.object({});
var getSingleBody10 = z18.object({});
var getSingleQuery11 = z18.object({});
var getSingleParams10 = z18.object({
  id: z18.string()
});
var deleteSingleBody8 = z18.object({});
var deleteSingleQuery8 = z18.object({});
var deleteSingleParams8 = z18.object({
  id: z18.string()
});
var resendSingleBody = z18.object({});
var resendSingleQuery = z18.object({});
var resendSingleParams = z18.object({
  id: z18.string()
});
var email_default2 = {
  getMultiple: {
    body: getMultipleBody7,
    query: getMultipleQuery7,
    params: getMultipleParams7
  },
  getSingle: {
    body: getSingleBody10,
    query: getSingleQuery11,
    params: getSingleParams10
  },
  deleteSingle: {
    body: deleteSingleBody8,
    query: deleteSingleQuery8,
    params: deleteSingleParams8
  },
  resendSingle: {
    body: resendSingleBody,
    query: resendSingleQuery,
    params: resendSingleParams
  }
};

// src/controllers/email/get-multiple.ts
var getMultipleController7 = async (req, res, next) => {
  try {
    const emailsRes = await service_default(
      email_default.getMultiple,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: emailsRes.data,
        pagination: {
          count: emailsRes.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default14 = {
  schema: email_default2.getMultiple,
  controller: getMultipleController7
};

// src/controllers/email/get-single.ts
var getSingleController11 = async (req, res, next) => {
  try {
    const email = await service_default(
      email_default.getSingle,
      false
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: email
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default23 = {
  schema: email_default2.getSingle,
  controller: getSingleController11
};

// src/controllers/email/delete-single.ts
var deleteSingleController8 = async (req, res, next) => {
  try {
    const email = await service_default(
      email_default.deleteSingle,
      true
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: email
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default17 = {
  schema: email_default2.deleteSingle,
  controller: deleteSingleController8
};

// src/controllers/email/resend-single.ts
var resendSingleController = async (req, res, next) => {
  try {
    const email = await service_default(
      email_default.resendSingle,
      true
    )({
      id: parseInt(req.params.id)
    });
    res.status(200).json(
      build_response_default(req, {
        data: email
      })
    );
  } catch (error) {
    next(error);
  }
};
var resend_single_default2 = {
  schema: email_default2.resendSingle,
  controller: resendSingleController
};

// src/routes/v1/emails.routes.ts
var router14 = Router14();
route_default(router14, {
  method: "get",
  path: "/",
  permissions: {
    global: ["read_email"]
  },
  middleware: {
    authenticate: true,
    paginated: true
  },
  schema: get_multiple_default14.schema,
  controller: get_multiple_default14.controller
});
route_default(router14, {
  method: "get",
  path: "/:id",
  permissions: {
    global: ["read_email"]
  },
  middleware: {
    authenticate: true
  },
  schema: get_single_default23.schema,
  controller: get_single_default23.controller
});
route_default(router14, {
  method: "delete",
  path: "/:id",
  permissions: {
    global: ["delete_email"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: delete_single_default17.schema,
  controller: delete_single_default17.controller
});
route_default(router14, {
  method: "post",
  path: "/:id/resend",
  permissions: {
    global: ["send_email"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: resend_single_default2.schema,
  controller: resend_single_default2.controller
});
var emails_routes_default = router14;

// src/routes/v1/forms.routes.ts
import { Router as Router15 } from "express";

// src/schemas/forms.ts
import z19 from "zod";
var getSingleBody11 = z19.object({});
var getSingleQuery12 = z19.object({});
var getSingleParams11 = z19.object({
  form_key: z19.string()
});
var getAllBody4 = z19.object({});
var getAllQuery4 = z19.object({
  include: z19.array(z19.enum(["fields"])).optional(),
  filter: z19.object({
    environment_key: z19.string().optional()
  }).optional()
});
var getAllParams4 = z19.object({});
var forms_default = {
  getSingle: {
    body: getSingleBody11,
    query: getSingleQuery12,
    params: getSingleParams11
  },
  getAll: {
    body: getAllBody4,
    query: getAllQuery4,
    params: getAllParams4
  }
};

// src/utils/format/format-form.ts
var formatForm = (instance) => {
  return {
    key: instance.key,
    title: instance.options.title,
    description: instance.options.description || null,
    fields: instance.options.fields
  };
};
var format_form_default = formatForm;

// src/services/forms/get-single.ts
var getSingle13 = async (client, data) => {
  const formInstances = Config.forms || [];
  const environment = await service_default(
    environments_default.getSingle,
    false,
    client
  )({
    key: data.environment_key
  });
  const allForms = formInstances.map((form) => format_form_default(form));
  const assignedForms = environment.assigned_forms || [];
  const formData = allForms.find((c) => {
    return c.key === data.key && assignedForms.includes(c.key);
  });
  if (!formData) {
    throw new LucidError({
      type: "basic",
      name: "Form not found",
      message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
      status: 404
    });
  }
  return formData;
};
var get_single_default24 = getSingle13;

// src/services/forms/get-all.ts
var getAll6 = async (client, data) => {
  const formInstances = Config.forms || [];
  let formsRes = formInstances.map((form) => format_form_default(form));
  if (data.query.filter?.environment_key) {
    const environment = await service_default(
      environments_default.getSingle,
      false,
      client
    )({
      key: data.query.filter?.environment_key
    });
    formsRes = formsRes.filter(
      (form) => environment.assigned_forms.includes(form.key)
    );
  }
  formsRes = formsRes.map((form) => {
    if (!data.query.include?.includes("fields")) {
      delete form.fields;
    }
    return form;
  });
  return formsRes;
};
var get_all_default10 = getAll6;

// src/services/forms/get-builder-instance.ts
var getBuilderInstance = (data) => {
  const FormBuilderInstances = Config.forms || [];
  const form = FormBuilderInstances.find((form2) => form2.key === data.form_key);
  if (!form) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "Form not found.",
      status: 404
    });
  }
  return form;
};
var get_builder_instance_default = getBuilderInstance;

// src/services/forms/index.ts
var forms_default2 = {
  getSingle: get_single_default24,
  getAll: get_all_default10,
  getBuilderInstance: get_builder_instance_default
};

// src/controllers/form/get-single.ts
var getSingleController12 = async (req, res, next) => {
  try {
    const form = await service_default(
      forms_default2.getSingle,
      false
    )({
      key: req.params.form_key,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: form
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default25 = {
  schema: forms_default.getSingle,
  controller: getSingleController12
};

// src/controllers/form/get-all.ts
var getAllController5 = async (req, res, next) => {
  try {
    const formsRes = await service_default(
      forms_default2.getAll,
      false
    )({
      query: req.query
    });
    res.status(200).json(
      build_response_default(req, {
        data: formsRes
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_all_default11 = {
  schema: forms_default.getAll,
  controller: getAllController5
};

// src/schemas/form-submissions.ts
import z20 from "zod";
var getSingleBody12 = z20.object({});
var getSingleQuery13 = z20.object({});
var getSingleParams12 = z20.object({
  id: z20.string(),
  form_key: z20.string()
});
var deleteSingleBody9 = z20.object({});
var deleteSingleQuery9 = z20.object({});
var deleteSingleParams9 = z20.object({
  id: z20.string(),
  form_key: z20.string()
});
var getMultipleBody8 = z20.object({});
var getMultipleQuery8 = z20.object({
  sort: z20.array(
    z20.object({
      key: z20.enum(["created_at", "updated_at", "read_at"]),
      value: z20.enum(["asc", "desc"])
    })
  ).optional(),
  include: z20.array(z20.enum(["fields"])).optional(),
  page: z20.string().optional(),
  per_page: z20.string().optional()
});
var getMultipleParams8 = z20.object({
  form_key: z20.string()
});
var toggleReadAtBody = z20.object({});
var toggleReadAtQuery = z20.object({});
var toggleReadAtParams = z20.object({
  id: z20.string(),
  form_key: z20.string()
});
var form_submissions_default = {
  getSingle: {
    body: getSingleBody12,
    query: getSingleQuery13,
    params: getSingleParams12
  },
  getMultiple: {
    body: getMultipleBody8,
    query: getMultipleQuery8,
    params: getMultipleParams8
  },
  toggleReadAt: {
    body: toggleReadAtBody,
    query: toggleReadAtQuery,
    params: toggleReadAtParams
  },
  deleteSingle: {
    body: deleteSingleBody9,
    query: deleteSingleQuery9,
    params: deleteSingleParams9
  }
};

// src/db/models/FormSubmission.ts
var FormSubmission = class {
  // -------------------------------------------
  // Submissions
  static createSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["form_key", "environment_key"],
      values: [data.form_key, data.environment_key]
    });
    const res = await client.query({
      text: `INSERT INTO lucid_form_submissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return res.rows[0];
  };
  static getSingle = async (client, data) => {
    const formSubmission = await client.query({
      text: `SELECT * FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3;`,
      values: [data.id, data.form_key, data.environment_key]
    });
    return formSubmission.rows[0];
  };
  static getMultiple = async (client, query_instance) => {
    const submissions = client.query({
      text: `SELECT ${query_instance.query.select} FROM lucid_form_submissions ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values
    });
    const count = client.query({
      text: `SELECT COUNT(DISTINCT lucid_form_submissions.id) FROM lucid_form_submissions ${query_instance.query.where} `,
      values: query_instance.countValues
    });
    const data = await Promise.all([submissions, count]);
    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count)
    };
  };
  static toggleReadAt = async (client, data) => {
    const updatedFormSubmission = await client.query({
      text: `UPDATE lucid_form_submissions SET read_at = $1 WHERE id = $2 AND form_key = $3 AND environment_key = $4 RETURNING *;`,
      values: [data.read_at, data.id, data.form_key, data.environment_key]
    });
    return updatedFormSubmission.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const formSubmission = await client.query({
      text: `DELETE FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3 RETURNING *;`,
      values: [data.id, data.form_key, data.environment_key]
    });
    return formSubmission.rows[0];
  };
  // -------------------------------------------
  // Submission Data
  static createFormData = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "form_submission_id",
        "name",
        "text_value",
        "number_value",
        "boolean_value"
      ],
      values: [
        data.form_submission_id,
        data.name,
        data.type === "string" ? data.value : null,
        data.type === "number" ? data.value : null,
        data.type === "boolean" ? data.value : null
      ]
    });
    const formData = await client.query({
      text: `INSERT INTO lucid_form_data (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value
    });
    return formData.rows[0];
  };
  static getAllFormData = async (client, data) => {
    const res = await client.query({
      text: `SELECT * FROM lucid_form_data WHERE form_submission_id = ANY($1)`,
      values: [data.submission_ids]
    });
    return res.rows;
  };
};

// src/utils/format/format-form-submission.ts
var formatFormSubmission = (form, data) => {
  const formattedFields = [];
  const fields = form.options.fields;
  for (let field of fields) {
    const fieldData = data.data.find((f) => f.name === field.name);
    if (!fieldData) {
      continue;
    }
    const value = fieldData.text_value || fieldData.number_value || fieldData.boolean_value;
    formattedFields.push({
      type: field.type,
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      options: field.options,
      show_in_table: field.show_in_table,
      value
    });
  }
  return {
    id: data.submission.id,
    form_key: data.submission.form_key,
    environment_key: data.submission.environment_key,
    read_at: data.submission.read_at,
    created_at: data.submission.created_at,
    updated_at: data.submission.updated_at,
    fields: formattedFields
  };
};
var format_form_submission_default = formatFormSubmission;

// src/services/form-submissions/delete-single.ts
var deleteSingle10 = async (client, data) => {
  await service_default(
    form_submissions_default2.hasEnvironmentPermission,
    false,
    client
  )({
    form_key: data.form_key,
    environment_key: data.environment_key
  });
  const formSubmission = await FormSubmission.deleteSingle(client, {
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key
  });
  if (!formSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form submission does not exist.",
      status: 404
    });
  }
  const formBuilder = forms_default2.getBuilderInstance({
    form_key: data.form_key
  });
  return format_form_submission_default(formBuilder, {
    submission: formSubmission,
    data: []
  });
};
var delete_single_default18 = deleteSingle10;

// src/services/form-submissions/get-multiple.ts
var getMultiple8 = async (client, data) => {
  await service_default(form_submissions_default2.hasEnvironmentPermission, false, client)(data);
  const { sort, include, page, per_page } = data.query;
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "form_key",
      "environment_key",
      "read_at",
      "created_at",
      "updated_at"
    ],
    filter: {
      data: {
        environment_key: data.environment_key,
        form_key: data.form_key
      },
      meta: {
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        form_key: {
          operator: "=",
          type: "text",
          columnType: "standard"
        }
      }
    },
    sort,
    page,
    per_page
  });
  const formSubmissionsRes = await FormSubmission.getMultiple(
    client,
    SelectQuery
  );
  const formBuilder = forms_default2.getBuilderInstance({
    form_key: data.form_key
  });
  let formData = [];
  if (include?.includes("fields")) {
    const formSubmissionIds = formSubmissionsRes.data.map(
      (submission) => submission.id
    );
    formData = await FormSubmission.getAllFormData(client, {
      submission_ids: formSubmissionIds
    });
  }
  const formattedSubmissions = formSubmissionsRes.data.map((submission) => {
    return format_form_submission_default(formBuilder, {
      submission,
      data: formData.filter(
        (field) => field.form_submission_id === submission.id
      )
    });
  });
  return {
    data: formattedSubmissions,
    count: formSubmissionsRes.count
  };
};
var get_multiple_default15 = getMultiple8;

// src/services/form-submissions/get-single.ts
var getSingle14 = async (client, data) => {
  await service_default(form_submissions_default2.hasEnvironmentPermission, false, client)(data);
  const formSubmission = await FormSubmission.getSingle(client, {
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key
  });
  if (!formSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form submission does not exist.",
      status: 404
    });
  }
  let formData = await FormSubmission.getAllFormData(client, {
    submission_ids: [formSubmission.id]
  });
  formData = formData.filter(
    (field) => field.form_submission_id === formSubmission.id
  );
  const formBuilder = forms_default2.getBuilderInstance({
    form_key: formSubmission.form_key
  });
  return format_form_submission_default(formBuilder, {
    submission: formSubmission,
    data: formData
  });
};
var get_single_default26 = getSingle14;

// src/services/form-submissions/toggle-read-at.ts
var toggleReadAt = async (client, data) => {
  await service_default(
    form_submissions_default2.hasEnvironmentPermission,
    false,
    client
  )({
    form_key: data.form_key,
    environment_key: data.environment_key
  });
  const formSubmission = await service_default(
    form_submissions_default2.getSingle,
    false,
    client
  )({
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key
  });
  const updateFormSubmission = await FormSubmission.toggleReadAt(client, {
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key,
    read_at: formSubmission.read_at ? null : /* @__PURE__ */ new Date()
  });
  if (!updateFormSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form submission does not exist.",
      status: 404
    });
  }
  let formData = await FormSubmission.getAllFormData(client, {
    submission_ids: [updateFormSubmission.id]
  });
  formData = formData.filter(
    (field) => field.form_submission_id === updateFormSubmission.id
  );
  const formBuilder = forms_default2.getBuilderInstance({
    form_key: updateFormSubmission.form_key
  });
  return format_form_submission_default(formBuilder, {
    submission: updateFormSubmission,
    data: formData
  });
};
var toggle_read_at_default = toggleReadAt;

// src/services/form-submissions/submit-form.ts
var submitForm = async (client, props) => {
  const data = [];
  for (let [key, value] of Object.entries(props.data)) {
    if (!value) {
      const defaultValue = props.form.options.fields.find(
        (field) => field.name === key
      )?.default_value;
      if (defaultValue !== void 0) {
        value = defaultValue;
      }
    }
    const type = typeof value;
    if (type !== "string" && type !== "number" && type !== "boolean") {
      throw new Error(
        "Form submision data must be a string, number or boolean."
      );
    }
    data.push({
      name: key,
      value,
      type
    });
  }
  const formRes = await service_default(
    form_submissions_default2.createSingle,
    false,
    client
  )({
    id: void 0,
    form_key: props.form.key,
    environment_key: props.environment_key,
    data
  });
  return formRes;
};
var submitFormExternal = async (props) => {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");
    await submitForm(client, props);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
var submit_form_default = submitForm;

// src/services/form-submissions/has-environment-permission.ts
var hasEnvironmentPermission = async (client, data) => {
  const environment = await service_default(
    environments_default.getSingle,
    false,
    client
  )({
    key: data.environment_key
  });
  const hasPerm = environment.assigned_forms?.includes(data.form_key);
  if (!hasPerm) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form is not assigned to this environment.",
      status: 403
    });
  }
  return environment;
};
var has_environment_permission_default = hasEnvironmentPermission;

// src/services/form-submissions/create-single.ts
var createSingle8 = async (client, data) => {
  await service_default(form_submissions_default2.hasEnvironmentPermission, false, client)(data);
  const formBuilder = forms_default2.getBuilderInstance({
    form_key: data.form_key
  });
  const formSubmission = await FormSubmission.createSingle(client, {
    form_key: data.form_key,
    environment_key: data.environment_key
  });
  if (!formSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Submission Error",
      message: "Failed to create form submission entry.",
      status: 500
    });
  }
  const formData = await Promise.all(
    data.data.map(
      (field) => FormSubmission.createFormData(client, {
        form_submission_id: formSubmission.id,
        name: field.name,
        type: field.type,
        value: field.value
      })
    )
  );
  return format_form_submission_default(formBuilder, {
    submission: formSubmission,
    data: formData
  });
};
var create_single_default15 = createSingle8;

// src/services/form-submissions/index.ts
var form_submissions_default2 = {
  deleteSingle: delete_single_default18,
  getMultiple: get_multiple_default15,
  getSingle: get_single_default26,
  toggleReadAt: toggle_read_at_default,
  submitForm: submit_form_default,
  hasEnvironmentPermission: has_environment_permission_default,
  createSingle: create_single_default15
};

// src/controllers/form-submissions/get-single.ts
var getSingleController13 = async (req, res, next) => {
  try {
    const formSubmission = await service_default(
      form_submissions_default2.getSingle,
      false
    )({
      id: parseInt(req.params.id),
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: formSubmission
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_single_default27 = {
  schema: form_submissions_default.getSingle,
  controller: getSingleController13
};

// src/controllers/form-submissions/get-multiple.ts
var getMultipleController8 = async (req, res, next) => {
  try {
    const submissions = await service_default(
      form_submissions_default2.getMultiple,
      false
    )({
      query: req.query,
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: submissions.data,
        pagination: {
          count: submissions.count,
          page: req.query.page,
          per_page: req.query.per_page
        }
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_multiple_default16 = {
  schema: form_submissions_default.getMultiple,
  controller: getMultipleController8
};

// src/controllers/form-submissions/toggle-read-at.ts
var toggleReadAtController = async (req, res, next) => {
  try {
    const formSubmission = await service_default(
      form_submissions_default2.toggleReadAt,
      true
    )({
      id: parseInt(req.params.id),
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: formSubmission
      })
    );
  } catch (error) {
    next(error);
  }
};
var toggle_read_at_default2 = {
  schema: form_submissions_default.toggleReadAt,
  controller: toggleReadAtController
};

// src/controllers/form-submissions/delete-single.ts
var deleteSingleController9 = async (req, res, next) => {
  try {
    const formSubmission = await service_default(
      form_submissions_default2.deleteSingle,
      true
    )({
      id: parseInt(req.params.id),
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"]
    });
    res.status(200).json(
      build_response_default(req, {
        data: formSubmission
      })
    );
  } catch (error) {
    next(error);
  }
};
var delete_single_default19 = {
  schema: form_submissions_default.deleteSingle,
  controller: deleteSingleController9
};

// src/routes/v1/forms.routes.ts
var router15 = Router15();
route_default(router15, {
  method: "get",
  path: "/:form_key",
  permissions: {
    environments: ["read_form_submissions"]
  },
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default25.schema,
  controller: get_single_default25.controller
});
route_default(router15, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true
  },
  schema: get_all_default11.schema,
  controller: get_all_default11.controller
});
route_default(router15, {
  method: "get",
  path: "/:form_key/submissions/:id",
  permissions: {
    environments: ["read_form_submissions"]
  },
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default27.schema,
  controller: get_single_default27.controller
});
route_default(router15, {
  method: "get",
  path: "/:form_key/submissions",
  permissions: {
    environments: ["read_form_submissions"]
  },
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_multiple_default16.schema,
  controller: get_multiple_default16.controller
});
route_default(router15, {
  method: "patch",
  path: "/:form_key/submissions/:id/read",
  permissions: {
    environments: ["read_form_submissions"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: toggle_read_at_default2.schema,
  controller: toggle_read_at_default2.controller
});
route_default(router15, {
  method: "delete",
  path: "/:form_key/submissions/:id",
  permissions: {
    environments: ["delete_form_submissions"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: delete_single_default19.schema,
  controller: delete_single_default19.controller
});
var forms_routes_default = router15;

// src/routes/v1/options.routes.ts
import { Router as Router16 } from "express";
var router16 = Router16();
var options_routes_default = router16;

// src/routes/v1/account.routes.ts
import { Router as Router17 } from "express";

// src/schemas/account.ts
import z21 from "zod";
var updateMeBody = z21.object({
  first_name: z21.string().optional(),
  last_name: z21.string().optional(),
  username: z21.string().min(3).optional(),
  email: z21.string().email().optional(),
  role_ids: z21.array(z21.number()).optional()
});
var updateMeQuery = z21.object({});
var updateMeParams = z21.object({});
var account_default = {
  updateMe: {
    body: updateMeBody,
    query: updateMeQuery,
    params: updateMeParams
  }
};

// src/controllers/account/update-me.ts
var updateMeController = async (req, res, next) => {
  try {
    const userRoles = await service_default(users_default.updateSingle, true)(
      {
        user_id: req.auth.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        role_ids: req.body.role_ids
      },
      req.auth.id
    );
    res.status(200).json(
      build_response_default(req, {
        data: userRoles
      })
    );
  } catch (error) {
    next(error);
  }
};
var update_me_default = {
  schema: account_default.updateMe,
  controller: updateMeController
};

// src/routes/v1/account.routes.ts
var router17 = Router17();
route_default(router17, {
  method: "patch",
  path: "/",
  middleware: {
    authenticate: true,
    authoriseCSRF: true
  },
  schema: update_me_default.schema,
  controller: update_me_default.controller
});
var account_routes_default = router17;

// src/routes/v1/settings.routes.ts
import { Router as Router18 } from "express";

// src/schemas/settings.ts
import z22 from "zod";
var getSettingsQuery = z22.object({});
var getSettingsParams = z22.object({});
var getSettingsBody = z22.object({});
var settings_default = {
  getSettings: {
    body: getSettingsBody,
    query: getSettingsQuery,
    params: getSettingsParams
  }
};

// src/services/settings/get-settings.ts
var getSettings = async (client) => {
  const [mediaStorageUsed, processedImagesCount] = await Promise.all([
    service_default(
      options_default.getByName,
      false,
      client
    )({
      name: "media_storage_used"
    }),
    ProcessedImage.getAllCount(client)
  ]);
  return {
    media: {
      storage_used: mediaStorageUsed.media_storage_used || null,
      storage_limit: Config.media.storageLimit,
      storage_remaining: mediaStorageUsed.media_storage_used ? Config.media.storageLimit - mediaStorageUsed.media_storage_used : null,
      processed_images: {
        per_image_limit: Config.media.processedImageLimit,
        total: processedImagesCount
      }
    }
  };
};
var get_settings_default = getSettings;

// src/services/settings/index.ts
var settings_default2 = {
  getSettings: get_settings_default
};

// src/controllers/settings/get-settings.ts
var getSettingsController = async (req, res, next) => {
  try {
    const settings = await service_default(settings_default2.getSettings, false)();
    res.status(200).json(
      build_response_default(req, {
        data: settings
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_settings_default2 = {
  schema: settings_default.getSettings,
  controller: getSettingsController
};

// src/routes/v1/settings.routes.ts
var router18 = Router18();
route_default(router18, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true
  },
  schema: get_settings_default2.schema,
  controller: get_settings_default2.controller
});
var settings_routes_default = router18;

// src/routes/v1/cdn.routes.ts
import { Router as Router19 } from "express";

// src/controllers/media/stream-single.ts
var streamSingleController = async (req, res, next) => {
  try {
    const response = await media_default.streamMedia({
      key: req.params.key,
      query: req.query
    });
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    if (response !== void 0) {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${req.params.key}"`
      );
      if (response?.contentLength)
        res.setHeader("Content-Length", response.contentLength);
      if (response?.contentType)
        res.setHeader("Content-Type", response.contentType);
      if (response?.body !== void 0)
        response.body.pipe(res);
    }
  } catch (error) {
    await media_default.streamErrorImage({
      fallback: req.query?.fallback,
      error,
      res,
      next
    });
  }
};
var stream_single_default = {
  schema: media_default2.streamSingle,
  controller: streamSingleController
};

// src/routes/v1/cdn.routes.ts
var router19 = Router19();
route_default(router19, {
  method: "get",
  path: "/:key",
  schema: stream_single_default.schema,
  controller: stream_single_default.controller
});
var cdn_routes_default = router19;

// src/routes/index.ts
var initRoutes = (app2) => {
  app2.use("/cdn/v1", cdn_routes_default);
  app2.use("/api/v1/auth", auth_routes_default);
  app2.use("/api/v1/health", health_routes_default);
  app2.use("/api/v1/categories", categories_routes_default);
  app2.use("/api/v1/pages", pages_routes_default);
  app2.use("/api/v1/single-page", single_pages_routes_default);
  app2.use("/api/v1/collections", collections_routes_default);
  app2.use("/api/v1/environments", environments_routes_default);
  app2.use("/api/v1/roles", roles_routes_default);
  app2.use("/api/v1/users", users_routes_default);
  app2.use("/api/v1/permissions", permissions_routes_default);
  app2.use("/api/v1/bricks", bricks_routes_default);
  app2.use("/api/v1/menus", menus_routes_default);
  app2.use("/api/v1/media", media_routes_default);
  app2.use("/api/v1/emails", emails_routes_default);
  app2.use("/api/v1/forms", forms_routes_default);
  app2.use("/api/v1/options", options_routes_default);
  app2.use("/api/v1/account", account_routes_default);
  app2.use("/api/v1/settings", settings_routes_default);
};
var routes_default = initRoutes;

// src/services/Initialise.ts
var Initialise = async (client) => {
  const users = await service_default(
    users_default.getMultiple,
    false,
    client
  )({
    query: {}
  });
  if (users.count === 0) {
    await service_default(
      users_default.registerSingle,
      false,
      client
    )({
      first_name: "Lucid",
      last_name: "Admin",
      email: "admin@lucid.com",
      username: "admin",
      password: "password",
      super_admin: true
    });
  }
};
var Initialise_default = Initialise;

// src/init.ts
import("dotenv/config.js");
var currentDir5 = get_dirname_default(import.meta.url);
var app = async (options) => {
  const app2 = options.express;
  await Config.cachedConfig();
  log.white("----------------------------------------------------");
  await initializePool();
  log.yellow("Database initialised");
  log.white("----------------------------------------------------");
  app2.use(express.json());
  app2.use(
    cors({
      origin: Config.origin,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "_csrf",
        "lucid-environment"
      ],
      credentials: true
    })
  );
  app2.use(morgan("dev"));
  app2.use(cookieParser(Config.secret));
  log.yellow("Middleware configured");
  log.white("----------------------------------------------------");
  await migration_default();
  log.white("----------------------------------------------------");
  await service_default(Initialise_default, true)();
  log.yellow("Start up tasks complete");
  log.white("----------------------------------------------------");
  if (options.public)
    app2.use("/public", express.static(options.public));
  routes_default(app2);
  app2.use("/", express.static(path6.join(currentDir5, "../cms")));
  app2.get("*", (req, res) => {
    res.sendFile(path6.resolve(currentDir5, "../cms", "index.html"));
  });
  log.yellow("Routes initialised");
  app2.use(errorLogger);
  app2.use(errorResponder);
  app2.use(invalidPathHandler);
  return app2;
};
var init_default = app;

// src/builders/collection-builder/index.ts
import z23 from "zod";
var CollectionOptionsSchema = z23.object({
  type: z23.enum(["pages", "singlepage"]),
  title: z23.string(),
  singular: z23.string(),
  description: z23.string().optional(),
  bricks: z23.array(
    z23.object({
      key: z23.string(),
      type: z23.enum(["builder", "fixed"]),
      position: z23.enum(["standard", "bottom", "top", "sidebar"]).optional()
    })
  )
});
var CollectionBuilder = class {
  key;
  config;
  constructor(key, options) {
    this.key = key;
    this.config = options;
    this.#validateOptions(options);
    this.#removeDuplicateBricks();
    this.#addBrickDefaults();
  }
  // ------------------------------------
  // Methods
  #removeDuplicateBricks = () => {
    const bricks = this.config.bricks;
    const builderBricks = bricks.filter((brick) => brick.type === "builder");
    const fixedBricks = bricks.filter((brick) => brick.type === "fixed");
    const uniqueBuilderBricks = builderBricks.filter(
      (brick, index) => builderBricks.findIndex((b) => b.key === brick.key) === index
    );
    const uniqueFixedBricks = fixedBricks.filter(
      (brick, index) => fixedBricks.findIndex(
        (b) => b.key === brick.key && b.position === brick.position
      ) === index
    );
    this.config.bricks = [...uniqueBuilderBricks, ...uniqueFixedBricks];
  };
  #addBrickDefaults = () => {
    this.config.bricks = this.config.bricks.map((brick) => {
      if (brick.type === "fixed" && !brick.position) {
        brick.position = "standard";
      }
      return brick;
    });
  };
  // ------------------------------------
  // Getters
  // ------------------------------------
  // External Methods
  // ------------------------------------
  // Private Methods
  #validateOptions = (options) => {
    try {
      CollectionOptionsSchema.parse(options);
    } catch (err) {
      console.error(err);
      throw new Error("Invalid Collection Config");
    }
  };
};

// src/builders/form-builder/index.ts
import z24 from "zod";
var FormBuilderOptionsSchema = z24.object({
  title: z24.string(),
  description: z24.string().optional(),
  fields: z24.array(
    z24.object({
      zod: z24.any().optional(),
      type: z24.enum([
        "text",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "textarea"
      ]),
      name: z24.string(),
      label: z24.string(),
      placeholder: z24.string().optional(),
      options: z24.array(
        z24.object({
          label: z24.string(),
          value: z24.string()
        })
      ).optional(),
      default_value: z24.union([z24.string(), z24.number(), z24.boolean()]).optional(),
      show_in_table: z24.boolean().optional()
    })
  )
});
var FormBuilder = class {
  key;
  options;
  constructor(key, options) {
    this.key = key;
    this.options = options;
    this.#validateOptions(options);
  }
  // ------------------------------------
  // External Functions
  validate = async (data) => {
    const errors = {};
    for (const key in data) {
      const field = this.options.fields.find((field2) => field2.name === key);
      if (field && field.zod) {
        const result = await field.zod.safeParseAsync(data[key]);
        if (!result.success) {
          const zerrors = result.error;
          const issues = zerrors.issues;
          errors[key] = issues.map((err) => err.message);
        }
      }
    }
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };
  // ------------------------------------
  // Private Methods
  #validateOptions = (options) => {
    try {
      FormBuilderOptionsSchema.parse(options);
    } catch (err) {
      console.error(err);
      throw new Error("Invalid Formm Builder Config");
    }
  };
};

// src/index.ts
import("dotenv/config.js");
var sendEmail = email_default.sendEmailExternal;
var submitForm2 = submitFormExternal;
var src_default = {
  init: init_default
};
export {
  BrickBuilder,
  CollectionBuilder,
  FormBuilder,
  buildConfig,
  src_default as default,
  init_default as init,
  sendEmail,
  submitForm2 as submitForm
};
//# sourceMappingURL=index.js.map