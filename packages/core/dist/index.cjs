"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BrickBuilder: () => BrickBuilder,
  CollectionBuilder: () => CollectionBuilder,
  FormBuilder: () => FormBuilder,
  buildConfig: () => buildConfig,
  default: () => src_default,
  init: () => init_default,
  sendEmail: () => sendEmail2,
  submitForm: () => submitForm2
});
module.exports = __toCommonJS(src_exports);

// ../../node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/init.ts
var import_express20 = __toESM(require("express"), 1);
var import_morgan = __toESM(require("morgan"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path7 = __toESM(require("path"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_console_log_colors4 = require("console-log-colors");

// src/translations/en-gb.json
var en_gb_default = {
  db_connection_error: "Unexpected error on idle client",
  db_connection_pool_not_initialised: "Database connection pool is not initialised. Call initialisePool() before getDBClient().",
  error_creating_page: "Error creating page",
  error_creating_page_homepage_disabled: "The current pages collection does not allow creating a homepage",
  error_creating_page_parents_disabled: "The current pages collection does not allow creating a page with parents"
};

// src/translations/index.ts
var selectedLang = en_gb_default;
var T = (key, data) => {
  const translation = selectedLang[key];
  if (!translation) {
    return key;
  }
  if (!data) {
    return translation;
  }
  return translation.replace(
    /\{\{(\w+)\}\}/g,
    (match, p1) => data[p1]
  );
};
var translations_default = T;

// src/db/db.ts
var import_pg = __toESM(require("pg"), 1);

// src/services/Config.ts
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_path = __toESM(require("path"), 1);
var import_zod = __toESM(require("zod"), 1);

// src/utils/app/error-handler.ts
var import_console_log_colors = require("console-log-colors");
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
    console.error((0, import_console_log_colors.bgRed)(`[RUNTIME ERROR] ${message}`));
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
  console.error((0, import_console_log_colors.red)(`${status} - ${message}`));
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
var import_console_log_colors2 = require("console-log-colors");

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
var import_zod_validation_error = require("zod-validation-error");
var import_url = require("url");
var configSchema = import_zod.default.object({
  host: import_zod.default.string(),
  origin: import_zod.default.string(),
  mode: import_zod.default.enum(["development", "production"]),
  postgresURL: import_zod.default.string(),
  secret: import_zod.default.string(),
  forms: import_zod.default.array(import_zod.default.any()).optional(),
  collections: import_zod.default.array(import_zod.default.any()).optional(),
  bricks: import_zod.default.array(import_zod.default.any()).optional(),
  media: import_zod.default.object({
    storageLimit: import_zod.default.number().optional(),
    maxFileSize: import_zod.default.number().optional(),
    fallbackImage: import_zod.default.union([import_zod.default.string(), import_zod.default.boolean()]).optional(),
    processedImageLimit: import_zod.default.number().optional(),
    store: import_zod.default.object({
      service: import_zod.default.enum(["aws", "cloudflare"]),
      cloudflareAccountId: import_zod.default.string().optional(),
      region: import_zod.default.string(),
      bucket: import_zod.default.string(),
      accessKeyId: import_zod.default.string(),
      secretAccessKey: import_zod.default.string()
    })
  }),
  email: import_zod.default.object({
    from: import_zod.default.object({
      name: import_zod.default.string(),
      email: import_zod.default.string().email()
    }),
    templateDir: import_zod.default.string().optional(),
    smtp: import_zod.default.object({
      host: import_zod.default.string(),
      port: import_zod.default.number(),
      user: import_zod.default.string(),
      pass: import_zod.default.string(),
      secure: import_zod.default.boolean().optional()
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
      if (error instanceof import_zod.default.ZodError) {
        const validationError = (0, import_zod_validation_error.fromZodError)(error);
        const message = validationError.message.split("Validation error: ")[1];
        console.log((0, import_console_log_colors2.bgRed)(message));
        process.exit(1);
      } else {
        throw error;
      }
    }
  };
  static findPath = (cwd) => {
    if (process.env.LUCID_CONFIG_PATH) {
      if (import_path.default.isAbsolute(process.env.LUCID_CONFIG_PATH)) {
        return process.env.LUCID_CONFIG_PATH;
      }
      return import_path.default.resolve(process.cwd(), process.env.LUCID_CONFIG_PATH);
    }
    let configPath = void 0;
    const root = import_path.default.parse(cwd).root;
    const configFileName = "lucid.config";
    const configExtensions = [".ts", ".js"];
    const search = (cwd2) => {
      const files = import_fs_extra.default.readdirSync(cwd2);
      const configFiles = files.filter((file) => {
        const { name, ext } = import_path.default.parse(file);
        return name === configFileName && configExtensions.includes(ext);
      });
      if (configFiles.length > 0) {
        configPath = import_path.default.resolve(cwd2, configFiles[0]);
        return;
      }
      const parent = import_path.default.resolve(cwd2, "..");
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
    const configUrl = (0, import_url.pathToFileURL)(path7).href;
    const configModule = await import(configUrl);
    const config = configModule.default;
    return config;
  };
  static getConfigCJS = async (path7) => {
    const configModule = await require(path7);
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
var { Pool } = import_pg.default;
var poolVal;
var initialisePool = async () => {
  const config = await Config.getConfig();
  poolVal = new Pool({
    connectionString: config.postgresURL,
    max: 20,
    ssl: {
      rejectUnauthorized: false
    }
  });
  poolVal.on("error", (err) => {
    console.error(translations_default("db_connection_error"), err);
    process.exit(-1);
  });
};
var getDBClient = () => {
  if (!poolVal) {
    throw new Error(translations_default("db_connection_pool_not_initialised"));
  }
  return poolVal.connect();
};

// src/db/migration.ts
var import_fs_extra2 = __toESM(require("fs-extra"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_console_log_colors3 = require("console-log-colors");

// src/utils/app/get-dirname.ts
var import_url2 = require("url");
var import_path2 = require("path");
var getDirName = (metaUrl) => {
  return (0, import_path2.dirname)((0, import_url2.fileURLToPath)(metaUrl));
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
var currentDir = get_dirname_default(importMetaUrl);
var getOutstandingMigrations = async (client) => {
  const migrationFiles = await import_fs_extra2.default.readdir(
    import_path3.default.join(currentDir, "./migrations")
  );
  const migrations = await Migration.all(client);
  const outstandingMigrations = migrationFiles.filter((migrationFile) => {
    if (!migrationFile.endsWith(".sql"))
      return false;
    return !migrations.find((migration) => migration.file === migrationFile);
  }).map((migrationFile) => ({
    file: migrationFile,
    sql: import_fs_extra2.default.readFileSync(
      import_path3.default.join(currentDir, "./migrations", migrationFile),
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
      console.log((0, import_console_log_colors3.green)("No outstanding migrations, database is up to date"));
      return;
    }
    console.log(
      (0, import_console_log_colors3.green)(
        `Found ${outstandingMigrations.length} outstanding migrations, running...`
      )
    );
    for (const migration of outstandingMigrations) {
      console.log((0, import_console_log_colors3.green)(`- running migration ${migration.file}`));
      await Migration.create(client, {
        file: migration.file,
        rawSql: migration.sql
      });
    }
  } catch (err) {
    new RuntimeError(err.message);
    process.exit(1);
  } finally {
    client.release();
  }
};
var migration_default = migrate;

// src/routes/v1/auth.routes.ts
var import_express = require("express");

// src/utils/app/route.ts
var import_zod3 = __toESM(require("zod"), 1);

// src/middleware/validate.ts
var import_zod2 = __toESM(require("zod"), 1);
var querySchema = import_zod2.default.object({
  include: import_zod2.default.string().optional(),
  exclude: import_zod2.default.string().optional(),
  filter: import_zod2.default.object({}).optional(),
  sort: import_zod2.default.string().optional(),
  page: import_zod2.default.string().optional(),
  per_page: import_zod2.default.string().optional()
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
      if (v !== "")
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
var import_crypto = __toESM(require("crypto"), 1);
var generateCSRFToken = (res) => {
  const token = import_crypto.default.randomBytes(32).toString("hex");
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
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var generateJWT = (res, user) => {
  const { id, email, username } = user;
  const payload = {
    id,
    email,
    username
  };
  const token = import_jsonwebtoken.default.sign(payload, Config.secret, {
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
    const decoded = import_jsonwebtoken.default.verify(_jwt, Config.secret);
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
    if (transaction) {
      await client.query("ROLLBACK");
    }
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
      text: `SELECT 
          lucid_user_roles.id AS id,
          lucid_user_roles.role_id AS role_id,
          lucid_roles.name AS name
      FROM 
          lucid_user_roles
      INNER JOIN 
          lucid_roles ON lucid_user_roles.role_id = lucid_roles.id
      WHERE 
          lucid_user_roles.user_id = $1;`,
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
var import_slug = __toESM(require("slug"), 1);
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
  const key = data.create ? (0, import_slug.default)(data.data.key, { lower: true }) : data.data.key;
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
var formatUserPermissions = (roles, permissionRes) => {
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
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name
    })),
    permissions: {
      global: permissions2,
      environments
    }
  };
};
var format_user_permissions_default = formatUserPermissions;

// src/services/users/get-permissions.ts
var getPermissions = async (client, data) => {
  const userRoles = UserRole.getAll(client, {
    user_id: data.user_id
  });
  const userPermissions = UserRole.getPermissions(client, {
    user_id: data.user_id
  });
  const [roles, permissions2] = await Promise.all([userRoles, userPermissions]);
  return format_user_permissions_default(roles, permissions2);
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
var import_argon2 = __toESM(require("argon2"), 1);

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
  const hashedPassword = await import_argon2.default.hash(data.password);
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
var import_argon22 = __toESM(require("argon2"), 1);
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
    hashedPassword = await import_argon22.default.hash(data.password);
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
  return void 0;
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
var import_argon23 = __toESM(require("argon2"), 1);
var validatePassword = async (data) => {
  return await import_argon23.default.verify(data.hashedPassword, data.password);
};
var validate_password_default = validatePassword;

// src/services/auth/send-reset-password.ts
var import_date_fns2 = require("date-fns");

// src/services/user-tokens/create-single.ts
var import_crypto2 = __toESM(require("crypto"), 1);

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
  const token = import_crypto2.default.randomBytes(32).toString("hex");
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
      data: templateData,
      type,
      email_hash,
      sent_count
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
        "delivery_status",
        "type",
        "email_hash",
        "sent_count"
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
        delivery_status,
        type,
        email_hash,
        sent_count
      ]
    });
    const email = await client.query({
      text: `INSERT INTO lucid_emails (${columns.formatted.insert})
        VALUES (${aliases.formatted.insert}) 
        ON CONFLICT (email_hash)
        DO UPDATE SET sent_count = lucid_emails.sent_count + 1
        RETURNING id`,
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
      columns: ["from_address", "from_name", "delivery_status", "sent_count"],
      values: [
        data.from_address,
        data.from_name,
        data.delivery_status,
        data.sent_count
      ],
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
        RETURNING id`,
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
  if (!email) {
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

// src/utils/format/format-emails.ts
var formatEmails = (email, html) => {
  return {
    id: email.id,
    mail_details: {
      from: {
        address: email.from_address,
        name: email.from_name
      },
      to: email.to_address,
      subject: email.subject,
      cc: email.cc,
      bcc: email.bcc,
      template: email.template
    },
    data: email.data,
    delivery_status: email.delivery_status,
    type: email.type,
    email_hash: email.email_hash,
    sent_count: email.sent_count,
    html,
    created_at: email.created_at,
    updated_at: email.updated_at
  };
};
var format_emails_default = formatEmails;

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
      "updated_at",
      "type",
      "email_hash",
      "sent_count"
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
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        type: {
          operator: "=",
          type: "text",
          columnType: "standard"
        },
        template: {
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
  const emails = await Email.getMultiple(client, SelectQuery);
  return {
    data: emails.data.map((email) => format_emails_default(email)),
    count: emails.count
  };
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
  if (!data.renderTemplate) {
    return format_emails_default(email);
  }
  const html = await email_default.renderTemplate(
    email.template,
    email.data || {}
  );
  return format_emails_default(email, html);
};
var get_single_default5 = getSingle5;

// src/services/email/resend-single.ts
var resendSingle = async (client, data) => {
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
  const status = await email_default.sendInternal(client, {
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
    email
  });
  return status;
};
var resend_single_default = resendSingle;

// src/services/email/create-single.ts
var import_date_fns = require("date-fns");
var import_crypto3 = __toESM(require("crypto"), 1);
var createSingle3 = async (client, data) => {
  const date = (0, import_date_fns.format)(/* @__PURE__ */ new Date(), "dd/MM/yyyy");
  const currentHour = (0, import_date_fns.getHours)(/* @__PURE__ */ new Date());
  const hashString = `${JSON.stringify(data)}${data.template}${date}${currentHour}`;
  const hash = import_crypto3.default.createHash("sha256").update(hashString).digest("hex");
  const email = await Email.createSingle(client, {
    from_address: data.from_address,
    from_name: data.from_name,
    to_address: data.to_address,
    subject: data.subject,
    cc: data.cc,
    bcc: data.bcc,
    template: data.template,
    data: data.data,
    delivery_status: data.delivery_status,
    type: data.type,
    email_hash: hash,
    sent_count: data.delivery_status === "sent" ? 1 : 0
  });
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
    delivery_status: data.data.delivery_status,
    sent_count: data.data.sent_count
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
var import_fs_extra3 = __toESM(require("fs-extra"), 1);
var import_handlebars = __toESM(require("handlebars"), 1);
var import_mjml = __toESM(require("mjml"), 1);
var import_path4 = __toESM(require("path"), 1);
var currentDir2 = get_dirname_default(importMetaUrl);
var getTemplateData = async (template) => {
  const templatePath = import_path4.default.join(currentDir2, `../templates/${template}.mjml`);
  if (await import_fs_extra3.default.pathExists(templatePath)) {
    return import_fs_extra3.default.readFile(templatePath, "utf-8");
  }
  if (Config.email?.templateDir) {
    const templatePath2 = `${Config.email.templateDir}/${template}.mjml`;
    if (await import_fs_extra3.default.pathExists(templatePath2)) {
      return import_fs_extra3.default.readFile(templatePath2, "utf-8");
    }
  }
  throw new Error(`Template ${template} not found`);
};
var renderTemplate = async (template, data) => {
  const mjmlFile = await getTemplateData(template);
  const mjmlTemplate = import_handlebars.default.compile(mjmlFile);
  const mjml = mjmlTemplate(data);
  const htmlOutput = (0, import_mjml.default)(mjml);
  return htmlOutput.html;
};
var render_template_default = renderTemplate;

// src/services/email/send-email.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var sendEmail = async (template, params) => {
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
    const transporter = import_nodemailer.default.createTransport({
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
var send_email_default = sendEmail;

// src/services/email/send-internal.ts
var sendInternal = async (client, data) => {
  const result = await email_default.sendEmail(data.template, data.params);
  if (data.email !== void 0) {
    await service_default(
      email_default.updateSingle,
      false,
      client
    )({
      id: data.email.id,
      data: {
        from_address: result.options.from,
        from_name: result.options.fromName,
        delivery_status: result.success ? "sent" : "failed",
        sent_count: result.success ? data.email.sent_count + 1 : data.email.sent_count
      }
    });
  } else {
    await service_default(
      email_default.createSingle,
      false,
      client
    )({
      from_address: result.options.from,
      from_name: result.options.fromName,
      to_address: result.options.to,
      subject: result.options.subject,
      cc: result.options.cc,
      bcc: result.options.bcc,
      template: data.template,
      data: data.params.data,
      delivery_status: result.success ? "sent" : "failed",
      type: "internal"
    });
  }
  return {
    success: result.success,
    message: result.message
  };
};
var send_internal_default = sendInternal;

// src/services/email/send-external.ts
var sendExternal = async (template, params) => {
  const result = await email_default.sendEmail(template, params);
  await service_default(
    email_default.createSingle,
    false
  )({
    from_address: result.options.from,
    from_name: result.options.fromName,
    to_address: result.options.to,
    subject: result.options.subject,
    cc: result.options.cc,
    bcc: result.options.bcc,
    template,
    data: params.data,
    delivery_status: result.success ? "sent" : "failed",
    type: "external"
  });
  return {
    success: result.success,
    message: result.message
  };
};
var send_external_default = sendExternal;

// src/services/email/index.ts
var email_default = {
  deleteSingle: delete_single_default5,
  getMultiple: get_multiple_default3,
  getSingle: get_single_default5,
  resendSingle: resend_single_default,
  createSingle: create_single_default3,
  updateSingle: update_single_default3,
  renderTemplate: render_template_default,
  sendExternal: send_external_default,
  sendEmail: send_email_default,
  sendInternal: send_internal_default
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
  const expiryDate = (0, import_date_fns2.add)(/* @__PURE__ */ new Date(), { hours: 1 }).toISOString();
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
    email_default.sendInternal,
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
    email_default.sendInternal,
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
var import_express_fileupload = __toESM(require("express-fileupload"), 1);
var fileUpload = async (req, res, next) => {
  const options = {
    debug: Config.mode === "development"
  };
  (0, import_express_fileupload.default)(options)(req, res, next);
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
        import_zod3.default.object({
          params: props.schema?.params ?? import_zod3.default.object({}),
          query: props.schema?.query ?? import_zod3.default.object({}),
          body: props.schema?.body ?? import_zod3.default.object({})
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
var import_zod4 = __toESM(require("zod"), 1);
var getAuthenticatedUserBody = import_zod4.default.object({});
var getAuthenticatedUserQuery = import_zod4.default.object({});
var getAuthenticatedUserParams = import_zod4.default.object({});
var getCSRFBody = import_zod4.default.object({});
var getCSRFQuery = import_zod4.default.object({});
var getCSRFParams = import_zod4.default.object({});
var loginBody = import_zod4.default.object({
  username: import_zod4.default.string().min(3),
  password: import_zod4.default.string().min(8)
});
var loginQuery = import_zod4.default.object({});
var loginParams = import_zod4.default.object({});
var logoutBody = import_zod4.default.object({});
var logoutQuery = import_zod4.default.object({});
var logoutParams = import_zod4.default.object({});
var sendResetPasswordBody = import_zod4.default.object({
  email: import_zod4.default.string().email()
});
var sendResetPasswordQuery = import_zod4.default.object({});
var sendResetPasswordParams = import_zod4.default.object({});
var verifyResetPasswordBody = import_zod4.default.object({});
var verifyResetPasswordQuery = import_zod4.default.object({});
var verifyResetPasswordParams = import_zod4.default.object({
  token: import_zod4.default.string()
});
var resetPasswordBody = import_zod4.default.object({
  password: import_zod4.default.string().min(8),
  password_confirmation: import_zod4.default.string().min(8)
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords must match",
  path: ["password_confirmation"]
});
var resetPasswordQuery = import_zod4.default.object({});
var resetPasswordParams = import_zod4.default.object({
  token: import_zod4.default.string()
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
      false
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
var router = (0, import_express.Router)();
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
var import_express2 = require("express");

// src/schemas/health.ts
var import_zod5 = __toESM(require("zod"), 1);
var getHealthBody = import_zod5.default.object({});
var getHealthQuery = import_zod5.default.object({});
var getHealthParams = import_zod5.default.object({});
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
var router2 = (0, import_express2.Router)();
route_default(router2, {
  method: "get",
  path: "/",
  schema: get_health_default2.schema,
  controller: get_health_default2.controller
});
var health_routes_default = router2;

// src/routes/v1/categories.routes.ts
var import_express3 = require("express");

// src/schemas/categories.ts
var import_zod6 = __toESM(require("zod"), 1);
var createSingleBody = import_zod6.default.object({
  collection_key: import_zod6.default.string(),
  title: import_zod6.default.string(),
  slug: import_zod6.default.string().min(2).toLowerCase(),
  description: import_zod6.default.string().optional()
});
var createSingleQuery = import_zod6.default.object({});
var createSingleParams = import_zod6.default.object({});
var deleteSingleBody = import_zod6.default.object({});
var deleteSingleQuery = import_zod6.default.object({});
var deleteSingleParams = import_zod6.default.object({
  id: import_zod6.default.string()
});
var getMultipleBody = import_zod6.default.object({});
var getMultipleQuery = import_zod6.default.object({
  filter: import_zod6.default.object({
    collection_key: import_zod6.default.union([import_zod6.default.string(), import_zod6.default.array(import_zod6.default.string())]).optional(),
    title: import_zod6.default.string().optional()
  }).optional(),
  sort: import_zod6.default.array(
    import_zod6.default.object({
      key: import_zod6.default.enum(["title", "created_at"]),
      value: import_zod6.default.enum(["asc", "desc"])
    })
  ).optional(),
  page: import_zod6.default.string().optional(),
  per_page: import_zod6.default.string().optional()
});
var getMultipleParams = import_zod6.default.object({});
var getSingleBody = import_zod6.default.object({});
var getSingleQuery2 = import_zod6.default.object({});
var getSingleParams = import_zod6.default.object({
  id: import_zod6.default.string()
});
var updateSingleBody = import_zod6.default.object({
  title: import_zod6.default.string().optional(),
  slug: import_zod6.default.string().min(2).toLowerCase().optional(),
  description: import_zod6.default.string().optional()
});
var updateSingleQuery = import_zod6.default.object({});
var updateSingleParams = import_zod6.default.object({
  id: import_zod6.default.string()
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
      text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING id`,
      values: values.value
    });
    return res.rows[0];
  };
  static updateSingle = async (client, data) => {
    const category = await client.query({
      name: "update-category",
      text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING id`,
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
      text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING id`,
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
    ...instance.config
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
      ...collection,
      bricks: []
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
  return void 0;
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
  return void 0;
};
var delete_single_default6 = deleteSingle6;

// src/utils/format/format-category.ts
var formatCategory = (category) => {
  return category;
};
var format_category_default = formatCategory;

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
  const categories = await Category.getMultiple(client, SelectQuery);
  return {
    data: categories.data.map((cat) => format_category_default(cat)),
    count: categories.count
  };
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
  return format_category_default(category);
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
  const category = await Category.updateSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
    title: data.data.title,
    slug: data.data.slug,
    description: data.data.description
  });
  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Updated",
      message: "There was an error updating the category.",
      status: 500
    });
  }
  return void 0;
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
      false
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
      false
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
var router3 = (0, import_express3.Router)();
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
var import_express4 = require("express");

// src/schemas/pages.ts
var import_zod9 = __toESM(require("zod"), 1);

// src/schemas/bricks.ts
var import_zod8 = __toESM(require("zod"), 1);

// src/builders/brick-builder/index.ts
var import_zod7 = __toESM(require("zod"), 1);
var import_sanitize_html = __toESM(require("sanitize-html"), 1);

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
var baseCustomFieldSchema = import_zod7.default.object({
  type: import_zod7.default.string(),
  key: import_zod7.default.string(),
  title: import_zod7.default.string(),
  description: import_zod7.default.string().optional(),
  placeholder: import_zod7.default.string().optional(),
  // boolean or string
  default: import_zod7.default.union([import_zod7.default.boolean(), import_zod7.default.string()]).optional(),
  options: import_zod7.default.array(
    import_zod7.default.object({
      label: import_zod7.default.string(),
      value: import_zod7.default.string()
    })
  ).optional(),
  validation: import_zod7.default.object({
    zod: import_zod7.default.any().optional(),
    required: import_zod7.default.boolean().optional(),
    extensions: import_zod7.default.array(import_zod7.default.string()).optional(),
    width: import_zod7.default.object({
      min: import_zod7.default.number().optional(),
      max: import_zod7.default.number().optional()
    }).optional(),
    height: import_zod7.default.object({
      min: import_zod7.default.number().optional(),
      max: import_zod7.default.number().optional()
    }).optional()
  }).optional()
});
var customFieldSchemaObject = baseCustomFieldSchema.extend(
  {
    fields: import_zod7.default.lazy(() => customFieldSchemaObject.array().optional())
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
    const sanitizedValue = (0, import_sanitize_html.default)(value, {
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
var FieldTypesSchema = import_zod8.default.nativeEnum(FieldTypesEnum);
var baseFieldSchema = import_zod8.default.object({
  fields_id: import_zod8.default.number().optional(),
  parent_repeater: import_zod8.default.number().optional(),
  group_position: import_zod8.default.number().optional(),
  key: import_zod8.default.string(),
  type: FieldTypesSchema,
  value: import_zod8.default.any(),
  target: import_zod8.default.any().optional()
});
var FieldSchema = baseFieldSchema.extend({
  items: import_zod8.default.lazy(() => FieldSchema.array().optional())
});
var BrickSchema = import_zod8.default.object({
  id: import_zod8.default.number().optional(),
  key: import_zod8.default.string(),
  fields: import_zod8.default.array(FieldSchema).optional()
});
var getAllConfigBody = import_zod8.default.object({});
var getAllConfigQuery = import_zod8.default.object({
  include: import_zod8.default.array(import_zod8.default.enum(["fields"])).optional(),
  filter: import_zod8.default.object({
    collection_key: import_zod8.default.string().optional(),
    environment_key: import_zod8.default.string().optional()
  }).optional().refine(
    (data) => data?.collection_key && data?.environment_key || !data?.collection_key && !data?.environment_key,
    {
      message: "Both collection_key and environment_key should be set or neither.",
      path: []
    }
  )
});
var getAllConfigParams = import_zod8.default.object({});
var getSingleConfigBody = import_zod8.default.object({});
var getSingleConfigQuery = import_zod8.default.object({});
var getSingleConfigParams = import_zod8.default.object({
  brick_key: import_zod8.default.string().nonempty()
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
var getMultipleBody2 = import_zod9.default.object({});
var getMultipleQuery2 = import_zod9.default.object({
  filter: import_zod9.default.object({
    collection_key: import_zod9.default.union([import_zod9.default.string(), import_zod9.default.array(import_zod9.default.string())]).optional(),
    title: import_zod9.default.string().optional(),
    slug: import_zod9.default.string().optional(),
    category_id: import_zod9.default.union([import_zod9.default.string(), import_zod9.default.array(import_zod9.default.string())]).optional()
  }).optional(),
  sort: import_zod9.default.array(
    import_zod9.default.object({
      key: import_zod9.default.enum(["created_at"]),
      value: import_zod9.default.enum(["asc", "desc"])
    })
  ).optional(),
  page: import_zod9.default.string().optional(),
  per_page: import_zod9.default.string().optional()
});
var getMultipleParams2 = import_zod9.default.object({});
var createSingleBody2 = import_zod9.default.object({
  title: import_zod9.default.string().min(2),
  slug: import_zod9.default.string().min(2).toLowerCase(),
  collection_key: import_zod9.default.string(),
  homepage: import_zod9.default.boolean().optional(),
  excerpt: import_zod9.default.string().optional(),
  published: import_zod9.default.boolean().optional(),
  parent_id: import_zod9.default.number().optional(),
  category_ids: import_zod9.default.array(import_zod9.default.number()).optional()
});
var createSingleQuery2 = import_zod9.default.object({});
var createSingleParams2 = import_zod9.default.object({});
var getSingleBody2 = import_zod9.default.object({});
var getSingleQuery3 = import_zod9.default.object({
  include: import_zod9.default.array(import_zod9.default.enum(["bricks"])).optional()
});
var getSingleParams2 = import_zod9.default.object({
  id: import_zod9.default.string()
});
var updateSingleBody2 = import_zod9.default.object({
  title: import_zod9.default.string().optional(),
  slug: import_zod9.default.string().optional(),
  homepage: import_zod9.default.boolean().optional(),
  parent_id: import_zod9.default.number().nullable().optional(),
  category_ids: import_zod9.default.array(import_zod9.default.number()).optional(),
  published: import_zod9.default.boolean().optional(),
  excerpt: import_zod9.default.string().optional(),
  builder_bricks: import_zod9.default.array(BrickSchema).optional(),
  fixed_bricks: import_zod9.default.array(BrickSchema).optional()
});
var updateSingleQuery2 = import_zod9.default.object({});
var updateSingleParams2 = import_zod9.default.object({
  id: import_zod9.default.string()
});
var deleteSingleBody2 = import_zod9.default.object({});
var deleteSingleQuery2 = import_zod9.default.object({});
var deleteSingleParams2 = import_zod9.default.object({
  id: import_zod9.default.string()
});
var deleteMultipleBody = import_zod9.default.object({
  ids: import_zod9.default.array(import_zod9.default.number())
});
var deleteMultipleQuery = import_zod9.default.object({});
var deleteMultipleParams = import_zod9.default.object({});
var getAllValidParentsBody = import_zod9.default.object({});
var getAllValidParentsQuery = import_zod9.default.object({});
var getAllValidParentsParams = import_zod9.default.object({
  id: import_zod9.default.string(),
  collection_key: import_zod9.default.string()
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
  },
  deleteMultiple: {
    body: deleteMultipleBody,
    query: deleteMultipleQuery,
    params: deleteMultipleParams
  },
  getAllValidParents: {
    body: getAllValidParentsBody,
    query: getAllValidParentsQuery,
    params: getAllValidParentsParams
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
      text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
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
      text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING id`,
      values: [...values.value, data.id]
    });
    return page.rows[0];
  };
  static deleteSingle = async (client, data) => {
    const page = await client.query({
      text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING id`,
      values: [data.id]
    });
    return page.rows[0];
  };
  static deleteMultiple = async (client, data) => {
    const pages = await client.query({
      text: `DELETE FROM lucid_pages WHERE id = ANY($1) RETURNING id`,
      values: [data.ids]
    });
    return pages.rows;
  };
  static getMultipleByIds = async (client, data) => {
    const pages = await client.query({
      text: `SELECT id FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
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
  static checkParentAncestry = async (client, data) => {
    const page = await client.query({
      text: `WITH RECURSIVE ancestry AS (
          SELECT id, parent_id
          FROM lucid_pages
          WHERE id = $1
    
          UNION ALL
    
          SELECT p.id, p.parent_id
          FROM lucid_pages p
          JOIN ancestry a ON p.id = a.parent_id
        )
        SELECT id
        FROM ancestry
        WHERE id = $2`,
      values: [data.parent_id, data.page_id]
    });
    return page.rows;
  };
  static getValidParents = async (client, data) => {
    const page = await client.query({
      text: `WITH RECURSIVE descendants AS (
            SELECT id, parent_id 
            FROM lucid_pages 
            WHERE parent_id = $1

            UNION ALL

            SELECT lp.id, lp.parent_id 
            FROM lucid_pages lp
            JOIN descendants d ON lp.parent_id = d.id
        )

        SELECT id, title, slug, full_slug 
        FROM lucid_pages 
        WHERE id NOT IN (SELECT id FROM descendants)
        AND id != $1
        AND homepage = FALSE
        AND environment_key = $2
        AND collection_key = $3`,
      values: [data.page_id, data.environment_key, data.collection_key]
    });
    return page.rows;
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

// src/services/pages/create-single.ts
var createSingle5 = async (client, data) => {
  const parentId = data.homepage ? void 0 : data.parent_id;
  const checkPageCollectionPromise = service_default(
    pages_default2.checkPageCollection,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    homepage: data.homepage,
    parent_id: parentId
  });
  const parentCheckPromise = parentId ? service_default(
    pages_default2.parentChecks,
    false,
    client
  )({
    parent_id: parentId,
    environment_key: data.environment_key,
    collection_key: data.collection_key
  }) : Promise.resolve();
  const buildUniqueSlugPromise = service_default(
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
  const [_, __, slug5] = await Promise.all([
    checkPageCollectionPromise,
    parentCheckPromise,
    buildUniqueSlugPromise
  ]);
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
  const pageCategoryServicePromise = data.category_ids ? service_default(
    page_categories_default.createMultiple,
    false,
    client
  )({
    page_id: page.id,
    category_ids: data.category_ids,
    collection_key: data.collection_key
  }) : Promise.resolve();
  const resetHomepagesPromise = data.homepage ? service_default(
    pages_default2.resetHomepages,
    false,
    client
  )({
    current: page.id,
    environment_key: data.environment_key
  }) : Promise.resolve();
  await Promise.all([pageCategoryServicePromise, resetHomepagesPromise]);
  return void 0;
};
var create_single_default6 = createSingle5;

// src/services/pages/delete-single.ts
var deleteSingle7 = async (client, data) => {
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
  return void 0;
};
var delete_single_default8 = deleteSingle7;

// src/utils/format/format-page.ts
var formatPage = (data, collections) => {
  const res = {
    id: data.id,
    environment_key: data.environment_key,
    parent_id: data.parent_id,
    collection_key: data.collection_key,
    title: data.title,
    slug: data.slug,
    full_slug: data.full_slug,
    homepage: data.homepage,
    excerpt: data.excerpt,
    created_by: data.created_by,
    created_at: data.created_at,
    updated_at: data.updated_at,
    published: data.published,
    published_at: data.published_at,
    published_by: data.published_by,
    categories: data.categories,
    builder_bricks: data.builder_bricks,
    fixed_bricks: data.fixed_bricks
  };
  if (res.categories) {
    res.categories = res.categories[0] === null ? [] : res.categories;
  }
  if (res.full_slug && !res.homepage) {
    const collection = collections.find(
      (collection2) => collection2.key === res.collection_key
    );
    if (collection && collection.path) {
      res.full_slug = `${collection.path}/${res.full_slug}`;
    }
    if (!res.full_slug.startsWith("/")) {
      res.full_slug = "/" + res.full_slug;
    }
    res.full_slug = res.full_slug.replace(/\/+/g, "/");
  }
  return res;
};
var format_page_default = formatPage;

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
  const response = await Promise.all([
    Page.getMultiple(client, SelectQuery),
    service_default(
      collections_default.getAll,
      false,
      client
    )({
      query: {}
    })
  ]);
  return {
    data: response[0].data.map((page2) => format_page_default(page2, response[1])),
    count: response[0].count
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
    const mediasRes = await Media.getMultipleByIds(client, {
      ids
    });
    if (!mediasRes) {
      return [];
    }
    return mediasRes.map((media) => format_media_default(media));
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
    const pages = await Page.getMultipleByIds(client, {
      ids,
      environment_key
    });
    if (!pages) {
      return [];
    }
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
var getSingle9 = async (client, data) => {
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
  const collection = await service_default(
    collections_default.getSingle,
    false,
    client
  )({
    collection_key: page.collection_key,
    environment_key: page.environment_key,
    type: "pages"
  });
  if (include && include.includes("bricks")) {
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
  return format_page_default(page, [collection]);
};
var get_single_default10 = getSingle9;

// src/services/pages/update-single.ts
var updateSingle4 = async (client, data) => {
  const currentPage = await service_default(
    pages_default2.checkPageExists,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key
  });
  if (currentPage.id === data.parent_id) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Updated",
      message: "A page cannot be its own parent",
      status: 400,
      errors: modelErrors({
        parent_id: {
          code: "invalid",
          message: `A page cannot be its own parent`
        }
      })
    });
  }
  const [environment, collection] = await Promise.all([
    service_default(
      environments_default.getSingle,
      false,
      client
    )({
      key: data.environment_key
    }),
    service_default(
      pages_default2.checkPageCollection,
      false,
      client
    )({
      collection_key: currentPage.collection_key,
      environment_key: data.environment_key,
      homepage: data.homepage,
      parent_id: data.parent_id || void 0
    })
  ]);
  const parentId = data.homepage ? void 0 : data.parent_id;
  if (parentId) {
    const parentChecks2 = service_default(
      pages_default2.parentChecks,
      false,
      client
    )({
      parent_id: parentId,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key
    });
    const ancestryChecks = service_default(
      pages_default2.checkParentAncestry,
      false,
      client
    )({
      page_id: data.id,
      parent_id: parentId
    });
    await Promise.all([parentChecks2, ancestryChecks]);
  }
  if (data.builder_bricks && data.builder_bricks.length > 0 || data.fixed_bricks && data.fixed_bricks.length > 0) {
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
  }
  let newSlug = void 0;
  if (data.slug) {
    newSlug = await service_default(
      pages_default2.buildUniqueSlug,
      false,
      client
    )({
      slug: data.slug,
      homepage: data.homepage || currentPage.homepage,
      environment_key: data.environment_key,
      collection_key: currentPage.collection_key,
      parent_id: parentId || void 0
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
  return void 0;
};
var update_single_default6 = updateSingle4;

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
var import_slug2 = __toESM(require("slug"), 1);
var buildUniqueSlug = async (client, data) => {
  if (data.homepage) {
    return "/";
  }
  data.slug = (0, import_slug2.default)(data.slug, { lower: true });
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
var import_slug3 = __toESM(require("slug"), 1);
var resetHomepages = async (client, data) => {
  const homepages = await Page.getNonCurrentHomepages(client, {
    current_id: data.current,
    environment_key: data.environment_key
  });
  const updatePromises = homepages.map(async (homepage) => {
    let newSlug = (0, import_slug3.default)(homepage.title, { lower: true });
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

// src/services/pages/check-page-collection.ts
var checkPageCollection = async (client, data) => {
  const collection = await service_default(
    collections_default.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    type: "pages"
  });
  if (collection.disableHomepage === true && data.homepage === true) {
    throw new LucidError({
      type: "basic",
      name: translations_default("error_creating_page"),
      message: translations_default("error_creating_page_homepage_disabled"),
      status: 500
    });
  }
  if (collection.disableParent === true && data.parent_id !== void 0) {
    throw new LucidError({
      type: "basic",
      name: translations_default("error_creating_page"),
      message: translations_default("error_creating_page_parents_disabled"),
      status: 500
    });
  }
  return collection;
};
var check_page_collection_default = checkPageCollection;

// src/services/pages/check-parent-ancestry.ts
var checkParentAncestry = async (client, data) => {
  const results = await Page.checkParentAncestry(client, data);
  if (results.length > 0) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Updated",
      message: "An error occurred while updating the page.",
      status: 400,
      errors: modelErrors({
        parent_id: {
          code: "invalid",
          message: "The page you are trying to set as the parent is currently a child of this page."
        }
      })
    });
  }
  return;
};
var check_parent_ancestry_default = checkParentAncestry;

// src/services/pages/delete-multiple.ts
var deleteMultiple3 = async (client, data) => {
  const page = await Page.deleteMultiple(client, {
    ids: data.ids
  });
  if (page.length !== data.ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Pages Not Deleted",
      message: "There was an error deleting some or all of the pages",
      status: 500
    });
  }
  return void 0;
};
var delete_multiple_default3 = deleteMultiple3;

// src/services/pages/get-all-valid-parents.ts
var getAllValidParents = async (client, data) => {
  const results = await Page.getValidParents(client, {
    page_id: data.page_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key
  });
  return results;
};
var get_all_valid_parents_default = getAllValidParents;

// src/services/pages/index.ts
var pages_default2 = {
  createSingle: create_single_default6,
  deleteSingle: delete_single_default8,
  getMultiple: get_multiple_default6,
  getSingle: get_single_default10,
  updateSingle: update_single_default6,
  checkPageExists: check_page_exists_default,
  buildUniqueSlug: build_unique_slug_default,
  parentChecks: parent_checks_default,
  resetHomepages: reset_homepages_default,
  checkPageCollection: check_page_collection_default,
  checkParentAncestry: check_parent_ancestry_default,
  deleteMultiple: delete_multiple_default3,
  getAllValidParents: get_all_valid_parents_default
};

// src/controllers/pages/create-single.ts
var createSingleController = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.createSingle,
      false
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
var create_single_default7 = {
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
var get_multiple_default7 = {
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
var get_single_default11 = {
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
var update_single_default7 = {
  schema: pages_default.updateSingle,
  controller: updateSingleController2
};

// src/controllers/pages/delete-single.ts
var deleteSingleController2 = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.deleteSingle,
      false
    )({
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
var delete_single_default9 = {
  schema: pages_default.deleteSingle,
  controller: deleteSingleController2
};

// src/controllers/pages/delete-multiple.ts
var deleteMultipleController = async (req, res, next) => {
  try {
    const page = await service_default(
      pages_default2.deleteMultiple,
      false
    )({
      ids: req.body.ids
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
var delete_multiple_default4 = {
  schema: pages_default.deleteMultiple,
  controller: deleteMultipleController
};

// src/controllers/pages/get-all-valid-parents.ts
var getAllValidParentsController = async (req, res, next) => {
  try {
    const pages = await service_default(
      pages_default2.getAllValidParents,
      false
    )({
      page_id: Number(req.params.id),
      environment_key: req.headers["lucid-environment"],
      collection_key: req.params.collection_key
    });
    res.status(200).json(
      build_response_default(req, {
        data: pages
      })
    );
  } catch (error) {
    next(error);
  }
};
var get_all_valid_parents_default2 = {
  schema: pages_default.getAllValidParents,
  controller: getAllValidParentsController
};

// src/routes/v1/pages.routes.ts
var router4 = (0, import_express4.Router)();
route_default(router4, {
  method: "get",
  path: "/:collection_key/:id/valid-parents",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_all_valid_parents_default2.schema,
  controller: get_all_valid_parents_default2.controller
});
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
  schema: create_single_default7.schema,
  controller: create_single_default7.controller
});
route_default(router4, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
    validateEnvironment: true
  },
  schema: get_multiple_default7.schema,
  controller: get_multiple_default7.controller
});
route_default(router4, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default11.schema,
  controller: get_single_default11.controller
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
  schema: update_single_default7.schema,
  controller: update_single_default7.controller
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
  schema: delete_single_default9.schema,
  controller: delete_single_default9.controller
});
route_default(router4, {
  method: "delete",
  path: "/",
  permissions: {
    environments: ["delete_content"]
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true
  },
  schema: delete_multiple_default4.schema,
  controller: delete_multiple_default4.controller
});
var pages_routes_default = router4;

// src/routes/v1/single-pages.routes.ts
var import_express5 = require("express");

// src/schemas/single-page.ts
var import_zod10 = __toESM(require("zod"), 1);
var updateSingleBody3 = import_zod10.default.object({
  builder_bricks: import_zod10.default.array(BrickSchema).optional(),
  fixed_bricks: import_zod10.default.array(BrickSchema).optional()
});
var updateSingleQuery3 = import_zod10.default.object({});
var updateSingleParams3 = import_zod10.default.object({
  collection_key: import_zod10.default.string()
});
var getSingleBody3 = import_zod10.default.object({});
var getSingleQuery4 = import_zod10.default.object({});
var getSingleParams3 = import_zod10.default.object({
  collection_key: import_zod10.default.string()
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
var getSingle10 = async (client, data) => {
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
var get_single_default12 = getSingle10;

// src/services/single-pages/update-single.ts
var updateSingle5 = async (client, data) => {
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
var update_single_default8 = updateSingle5;

// src/services/single-pages/index.ts
var single_pages_default = {
  getSingle: get_single_default12,
  updateSingle: update_single_default8
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
var update_single_default9 = {
  schema: single_page_default.updateSingle,
  controller: updateSingleController3
};

// src/controllers/single-pages/get-single.ts
var getSingleController3 = async (req, res, next) => {
  try {
    const singlepage = await service_default(
      single_pages_default.getSingle,
      false
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
var get_single_default13 = {
  schema: single_page_default.getSingle,
  controller: getSingleController3
};

// src/routes/v1/single-pages.routes.ts
var router5 = (0, import_express5.Router)();
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
  schema: update_single_default9.schema,
  controller: update_single_default9.controller
});
route_default(router5, {
  method: "get",
  path: "/:collection_key",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default13.schema,
  controller: get_single_default13.controller
});
var single_pages_routes_default = router5;

// src/routes/v1/collections.routes.ts
var import_express6 = require("express");

// src/schemas/collections.ts
var import_zod11 = __toESM(require("zod"), 1);
var getAllBody = import_zod11.default.object({});
var getAllQuery = import_zod11.default.object({
  filter: import_zod11.default.object({
    type: import_zod11.default.enum(["pages", "singlepage"]).optional(),
    environment_key: import_zod11.default.string().optional()
  }).optional(),
  include: import_zod11.default.array(import_zod11.default.enum(["bricks"])).optional()
});
var getAllParams = import_zod11.default.object({});
var getSingleBody4 = import_zod11.default.object({});
var getSingleQuery5 = import_zod11.default.object({});
var getSingleParams4 = import_zod11.default.object({
  collection_key: import_zod11.default.string()
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
var get_single_default14 = {
  schema: collections_default2.getSingle,
  controller: getSingleController4
};

// src/routes/v1/collections.routes.ts
var router6 = (0, import_express6.Router)();
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
  schema: get_single_default14.schema,
  controller: get_single_default14.controller
});
var collections_routes_default = router6;

// src/routes/v1/environments.routes.ts
var import_express7 = require("express");

// src/schemas/environments.ts
var import_zod12 = __toESM(require("zod"), 1);
var getAllBody2 = import_zod12.default.object({});
var getAllQuery2 = import_zod12.default.object({});
var getAllParams2 = import_zod12.default.object({});
var getSingleBody5 = import_zod12.default.object({});
var getSingleQuery6 = import_zod12.default.object({});
var getSingleParams5 = import_zod12.default.object({
  key: import_zod12.default.string()
});
var migrateEnvironmentBody = import_zod12.default.object({});
var migrateEnvironmentQuery = import_zod12.default.object({});
var migrateEnvironmentParams = import_zod12.default.object({
  key: import_zod12.default.string()
});
var updateSingleBody4 = import_zod12.default.object({
  title: import_zod12.default.string().optional(),
  assigned_bricks: import_zod12.default.array(import_zod12.default.string()).optional(),
  assigned_collections: import_zod12.default.array(import_zod12.default.string()).optional(),
  assigned_forms: import_zod12.default.array(import_zod12.default.string()).optional()
});
var updateSingleQuery4 = import_zod12.default.object({});
var updateSingleParams4 = import_zod12.default.object({
  key: import_zod12.default.string()
});
var createSingleBody3 = import_zod12.default.object({
  key: import_zod12.default.string().min(4).max(64).refine((value) => /^[a-z-]+$/.test(value), {
    message: "Invalid key format. Only lowercase letters and dashes are allowed."
  }),
  title: import_zod12.default.string(),
  assigned_bricks: import_zod12.default.array(import_zod12.default.string()).optional(),
  assigned_collections: import_zod12.default.array(import_zod12.default.string()).optional(),
  assigned_forms: import_zod12.default.array(import_zod12.default.string()).optional()
});
var createSingleQuery3 = import_zod12.default.object({});
var createSingleParams3 = import_zod12.default.object({});
var deleteSingleBody3 = import_zod12.default.object({});
var deleteSingleQuery3 = import_zod12.default.object({});
var deleteSingleParams3 = import_zod12.default.object({
  key: import_zod12.default.string()
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
var get_single_default15 = {
  schema: environments_default2.getSingle,
  controller: getSingleController5
};

// src/controllers/environments/update-single.ts
var updateSingleController4 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.upsertSingle,
      false
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
var update_single_default10 = {
  schema: environments_default2.updateSingle,
  controller: updateSingleController4
};

// src/controllers/environments/create-single.ts
var createSingleController2 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.upsertSingle,
      false
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
var create_single_default8 = {
  schema: environments_default2.createSingle,
  controller: createSingleController2
};

// src/controllers/environments/delete-single.ts
var deleteSingleController3 = async (req, res, next) => {
  try {
    const environment = await service_default(
      environments_default.deleteSingle,
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
var delete_single_default10 = {
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
var router7 = (0, import_express7.Router)();
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
  schema: delete_single_default10.schema,
  controller: delete_single_default10.controller
});
route_default(router7, {
  method: "get",
  path: "/:key",
  middleware: {
    authenticate: true
  },
  schema: get_single_default15.schema,
  controller: get_single_default15.controller
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
  schema: update_single_default10.schema,
  controller: update_single_default10.controller
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
  schema: create_single_default8.schema,
  controller: create_single_default8.controller
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
var import_express8 = require("express");

// src/schemas/roles.ts
var import_zod13 = __toESM(require("zod"), 1);
var createSingleBody4 = import_zod13.default.object({
  name: import_zod13.default.string().min(2),
  permission_groups: import_zod13.default.array(
    import_zod13.default.object({
      environment_key: import_zod13.default.string().optional(),
      permissions: import_zod13.default.array(import_zod13.default.string())
    })
  )
});
var createSingleQuery4 = import_zod13.default.object({});
var createSingleParams4 = import_zod13.default.object({});
var updateSingleBody5 = import_zod13.default.object({
  name: import_zod13.default.string().min(2).optional(),
  permission_groups: import_zod13.default.array(
    import_zod13.default.object({
      environment_key: import_zod13.default.string().optional(),
      permissions: import_zod13.default.array(import_zod13.default.string())
    })
  ).optional()
});
var updateSingleQuery5 = import_zod13.default.object({});
var updateSingleParams5 = import_zod13.default.object({
  id: import_zod13.default.string()
});
var deleteSingleBody4 = import_zod13.default.object({});
var deleteSingleQuery4 = import_zod13.default.object({});
var deleteSingleParams4 = import_zod13.default.object({
  id: import_zod13.default.string()
});
var getMultipleQuery3 = import_zod13.default.object({
  filter: import_zod13.default.object({
    name: import_zod13.default.string().optional(),
    role_ids: import_zod13.default.union([import_zod13.default.string(), import_zod13.default.array(import_zod13.default.string())]).optional()
  }).optional(),
  sort: import_zod13.default.array(
    import_zod13.default.object({
      key: import_zod13.default.enum(["created_at", "name"]),
      value: import_zod13.default.enum(["asc", "desc"])
    })
  ).optional(),
  include: import_zod13.default.array(import_zod13.default.enum(["permissions"])).optional(),
  page: import_zod13.default.string().optional(),
  per_page: import_zod13.default.string().optional()
});
var getMultipleParams3 = import_zod13.default.object({});
var getMultipleBody3 = import_zod13.default.object({});
var getSingleQuery7 = import_zod13.default.object({});
var getSingleParams6 = import_zod13.default.object({
  id: import_zod13.default.string()
});
var getSingleBody6 = import_zod13.default.object({});
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
      false
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
var create_single_default9 = {
  schema: roles_default2.createSingle,
  controller: createSingleController3
};

// src/controllers/roles/delete-single.ts
var deleteSingleController4 = async (req, res, next) => {
  try {
    const role = await service_default(
      roles_default.deleteSingle,
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
var delete_single_default11 = {
  schema: roles_default2.deleteSingle,
  controller: deleteSingleController4
};

// src/controllers/roles/update-single.ts
var updateSingleController5 = async (req, res, next) => {
  try {
    const role = await service_default(
      roles_default.updateSingle,
      false
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
var update_single_default11 = {
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
var get_multiple_default8 = {
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
var get_single_default16 = {
  schema: roles_default2.getSingle,
  controller: getSingleController6
};

// src/routes/v1/roles.routes.ts
var router8 = (0, import_express8.Router)();
route_default(router8, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true
  },
  schema: get_multiple_default8.schema,
  controller: get_multiple_default8.controller
});
route_default(router8, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true
  },
  schema: get_single_default16.schema,
  controller: get_single_default16.controller
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
  schema: create_single_default9.schema,
  controller: create_single_default9.controller
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
  schema: delete_single_default11.schema,
  controller: delete_single_default11.controller
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
  schema: update_single_default11.schema,
  controller: update_single_default11.controller
});
var roles_routes_default = router8;

// src/routes/v1/users.routes.ts
var import_express9 = require("express");

// src/schemas/users.ts
var import_zod14 = __toESM(require("zod"), 1);
var updateSingleBody6 = import_zod14.default.object({
  role_ids: import_zod14.default.array(import_zod14.default.number()).optional(),
  super_admin: import_zod14.default.boolean().optional()
});
var updateSingleQuery6 = import_zod14.default.object({});
var updateSingleParams6 = import_zod14.default.object({
  id: import_zod14.default.string()
});
var createSingleBody5 = import_zod14.default.object({
  email: import_zod14.default.string().email(),
  username: import_zod14.default.string(),
  password: import_zod14.default.string().min(8),
  password_confirmation: import_zod14.default.string().min(8),
  role_ids: import_zod14.default.array(import_zod14.default.number()),
  first_name: import_zod14.default.string().optional(),
  last_name: import_zod14.default.string().optional(),
  super_admin: import_zod14.default.boolean().optional()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords must match",
  path: ["password_confirmation"]
});
var createSingleQuery5 = import_zod14.default.object({});
var createSingleParams5 = import_zod14.default.object({});
var deleteSingleBody5 = import_zod14.default.object({});
var deleteSingleQuery5 = import_zod14.default.object({});
var deleteSingleParams5 = import_zod14.default.object({
  id: import_zod14.default.string()
});
var getMultipleBody4 = import_zod14.default.object({});
var getMultipleQuery4 = import_zod14.default.object({
  filter: import_zod14.default.object({
    first_name: import_zod14.default.string().optional(),
    last_name: import_zod14.default.string().optional(),
    email: import_zod14.default.string().optional(),
    username: import_zod14.default.string().optional()
  }).optional(),
  sort: import_zod14.default.array(
    import_zod14.default.object({
      key: import_zod14.default.enum(["created_at"]),
      value: import_zod14.default.enum(["asc", "desc"])
    })
  ).optional(),
  page: import_zod14.default.string().optional(),
  per_page: import_zod14.default.string().optional()
});
var getMultipleParams4 = import_zod14.default.object({});
var getSingleBody7 = import_zod14.default.object({});
var getSingleQuery8 = import_zod14.default.object({});
var getSingleParams7 = import_zod14.default.object({
  id: import_zod14.default.string()
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
    const userRoles = await service_default(users_default.updateSingle, false)(
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
var update_single_default12 = {
  schema: users_default2.updateSingle,
  controller: updateSingleController6
};

// src/controllers/users/create-single.ts
var createSingleController4 = async (req, res, next) => {
  try {
    const user = await service_default(users_default.registerSingle, false)(
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
var create_single_default10 = {
  schema: users_default2.createSingle,
  controller: createSingleController4
};

// src/controllers/users/delete-single.ts
var deleteSingleController5 = async (req, res, next) => {
  try {
    const user = await service_default(
      users_default.deleteSingle,
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
var delete_single_default12 = {
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
var get_multiple_default9 = {
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
var get_single_default17 = {
  schema: users_default2.getSingle,
  controller: getSingleController7
};

// src/routes/v1/users.routes.ts
var router9 = (0, import_express9.Router)();
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
  schema: update_single_default12.schema,
  controller: update_single_default12.controller
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
  schema: create_single_default10.schema,
  controller: create_single_default10.controller
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
  schema: delete_single_default12.schema,
  controller: delete_single_default12.controller
});
route_default(router9, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true
  },
  schema: get_multiple_default9.schema,
  controller: get_multiple_default9.controller
});
route_default(router9, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true
  },
  schema: get_single_default17.schema,
  controller: get_single_default17.controller
});
var users_routes_default = router9;

// src/routes/v1/permissions.routes.ts
var import_express10 = require("express");

// src/schemas/permissions.ts
var import_zod15 = __toESM(require("zod"), 1);
var getAllBody3 = import_zod15.default.object({});
var getAllQuery3 = import_zod15.default.object({});
var getAllParams3 = import_zod15.default.object({});
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
var router10 = (0, import_express10.Router)();
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
var import_express11 = require("express");

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
var get_single_default18 = {
  schema: bricks_default.config.getSingle,
  controller: getSingleController8
};

// src/routes/v1/bricks.routes.ts
var router11 = (0, import_express11.Router)();
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
  schema: get_single_default18.schema,
  controller: get_single_default18.controller
});
var bricks_routes_default = router11;

// src/routes/v1/menus.routes.ts
var import_express12 = require("express");

// src/schemas/menus.ts
var import_zod16 = __toESM(require("zod"), 1);
var BaseMenuItemSchema = import_zod16.default.object({
  id: import_zod16.default.number().optional(),
  url: import_zod16.default.string().optional(),
  page_id: import_zod16.default.number().optional(),
  name: import_zod16.default.string().nonempty(),
  target: import_zod16.default.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  meta: import_zod16.default.any().optional()
});
var BaseMenuItemSchemaUpdate = import_zod16.default.object({
  id: import_zod16.default.number().optional(),
  url: import_zod16.default.string().optional(),
  page_id: import_zod16.default.number().optional(),
  name: import_zod16.default.string().optional(),
  target: import_zod16.default.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  meta: import_zod16.default.any().optional()
});
var MenuItem = BaseMenuItemSchema.extend({
  children: import_zod16.default.lazy(() => MenuItem.array().optional())
});
var MenuItemUpdate = BaseMenuItemSchemaUpdate.extend({
  children: import_zod16.default.lazy(() => MenuItem.array().optional())
});
var createSingleBody6 = import_zod16.default.object({
  key: import_zod16.default.string().nonempty(),
  name: import_zod16.default.string().nonempty(),
  description: import_zod16.default.string().optional(),
  items: import_zod16.default.array(MenuItem).optional()
});
var createSingleQuery6 = import_zod16.default.object({});
var createSingleParams6 = import_zod16.default.object({});
var deleteSingleBody6 = import_zod16.default.object({});
var deleteSingleQuery6 = import_zod16.default.object({});
var deleteSingleParams6 = import_zod16.default.object({
  id: import_zod16.default.string()
});
var getSingleBody8 = import_zod16.default.object({});
var getSingleQuery9 = import_zod16.default.object({});
var getSingleParams8 = import_zod16.default.object({
  id: import_zod16.default.string()
});
var getMultipleBody5 = import_zod16.default.object({});
var getMultipleQuery5 = import_zod16.default.object({
  filter: import_zod16.default.object({
    name: import_zod16.default.string().optional()
  }).optional(),
  sort: import_zod16.default.array(
    import_zod16.default.object({
      key: import_zod16.default.enum(["created_at"]),
      value: import_zod16.default.enum(["asc", "desc"])
    })
  ).optional(),
  include: import_zod16.default.array(import_zod16.default.enum(["items"])).optional(),
  page: import_zod16.default.string().optional(),
  per_page: import_zod16.default.string().optional()
});
var getMultipleParams5 = import_zod16.default.object({});
var updateSingleBody7 = import_zod16.default.object({
  key: import_zod16.default.string().optional(),
  name: import_zod16.default.string().optional(),
  description: import_zod16.default.string().optional(),
  items: import_zod16.default.array(MenuItemUpdate).optional()
});
var updateSingleQuery7 = import_zod16.default.object({});
var updateSingleParams7 = import_zod16.default.object({
  id: import_zod16.default.string()
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
var createSingle6 = async (client, data) => {
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
var create_single_default11 = createSingle6;

// src/services/menu/delete-single.ts
var deleteSingle8 = async (client, data) => {
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
var delete_single_default13 = deleteSingle8;

// src/services/menu/get-multiple.ts
var getMultiple6 = async (client, data) => {
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
var get_multiple_default10 = getMultiple6;

// src/services/menu/get-single.ts
var getSingle11 = async (client, data) => {
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
var get_single_default19 = getSingle11;

// src/services/menu/update-single.ts
var updateSingle6 = async (client, data) => {
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
var update_single_default13 = updateSingle6;

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
  createSingle: create_single_default11,
  deleteSingle: delete_single_default13,
  getMultiple: get_multiple_default10,
  getSingle: get_single_default19,
  updateSingle: update_single_default13,
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
      false
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
var create_single_default12 = {
  schema: menus_default.createSingle,
  controller: createSingleController5
};

// src/controllers/menu/delete-single.ts
var deleteSingleController6 = async (req, res, next) => {
  try {
    const menu = await service_default(
      menu_default.deleteSingle,
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
var delete_single_default14 = {
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
var get_single_default20 = {
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
var get_multiple_default11 = {
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
var update_single_default14 = {
  schema: menus_default.updateSingle,
  controller: updateSingleController7
};

// src/routes/v1/menus.routes.ts
var router12 = (0, import_express12.Router)();
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
  schema: create_single_default12.schema,
  controller: create_single_default12.controller
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
  schema: delete_single_default14.schema,
  controller: delete_single_default14.controller
});
route_default(router12, {
  method: "get",
  path: "/:id",
  middleware: {
    authenticate: true,
    validateEnvironment: true
  },
  schema: get_single_default20.schema,
  controller: get_single_default20.controller
});
route_default(router12, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
    paginated: true,
    validateEnvironment: true
  },
  schema: get_multiple_default11.schema,
  controller: get_multiple_default11.controller
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
  schema: update_single_default14.schema,
  controller: update_single_default14.controller
});
var menus_routes_default = router12;

// src/routes/v1/media.routes.ts
var import_express13 = require("express");

// src/schemas/media.ts
var import_zod17 = __toESM(require("zod"), 1);
var createSingleBody7 = import_zod17.default.object({
  name: import_zod17.default.string().optional(),
  alt: import_zod17.default.string().optional()
});
var createSingleQuery7 = import_zod17.default.object({});
var createSingleParams7 = import_zod17.default.object({});
var streamSingleBody = import_zod17.default.object({});
var streamSingleQuery = import_zod17.default.object({
  width: import_zod17.default.string().optional(),
  height: import_zod17.default.string().optional(),
  format: import_zod17.default.enum(["jpeg", "png", "webp", "avif"]).optional(),
  quality: import_zod17.default.string().optional(),
  fallback: import_zod17.default.enum(["1", "0"]).optional()
});
var streamSingleParams = import_zod17.default.object({
  key: import_zod17.default.string()
});
var getMultipleBody6 = import_zod17.default.object({});
var getMultipleQuery6 = import_zod17.default.object({
  filter: import_zod17.default.object({
    name: import_zod17.default.string().optional(),
    key: import_zod17.default.string().optional(),
    mime_type: import_zod17.default.union([import_zod17.default.string(), import_zod17.default.array(import_zod17.default.string())]).optional(),
    type: import_zod17.default.union([import_zod17.default.string(), import_zod17.default.array(import_zod17.default.string())]).optional(),
    file_extension: import_zod17.default.union([import_zod17.default.string(), import_zod17.default.array(import_zod17.default.string())]).optional()
  }).optional(),
  sort: import_zod17.default.array(
    import_zod17.default.object({
      key: import_zod17.default.enum([
        "created_at",
        "updated_at",
        "name",
        "file_size",
        "width",
        "height",
        "mime_type",
        "file_extension"
      ]),
      value: import_zod17.default.enum(["asc", "desc"])
    })
  ).optional(),
  page: import_zod17.default.string().optional(),
  per_page: import_zod17.default.string().optional()
});
var getMultipleParams6 = import_zod17.default.object({});
var getSingleBody9 = import_zod17.default.object({});
var getSingleQuery10 = import_zod17.default.object({});
var getSingleParams9 = import_zod17.default.object({
  id: import_zod17.default.string()
});
var deleteSingleBody7 = import_zod17.default.object({});
var deleteSingleQuery7 = import_zod17.default.object({});
var deleteSingleParams7 = import_zod17.default.object({
  id: import_zod17.default.string()
});
var updateSingleBody8 = import_zod17.default.object({
  name: import_zod17.default.string().optional(),
  alt: import_zod17.default.string().optional()
});
var updateSingleQuery8 = import_zod17.default.object({});
var updateSingleParams8 = import_zod17.default.object({
  id: import_zod17.default.string()
});
var clearSingleProcessedBody = import_zod17.default.object({});
var clearSingleProcessedQuery = import_zod17.default.object({});
var clearSingleProcessedParams = import_zod17.default.object({
  id: import_zod17.default.string()
});
var clearAllProcessedBody = import_zod17.default.object({});
var clearAllProcessedQuery = import_zod17.default.object({});
var clearAllProcessedParams = import_zod17.default.object({});
var media_default = {
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

// src/utils/media/helpers.ts
var import_slug4 = __toESM(require("slug"), 1);
var import_mime_types = __toESM(require("mime-types"), 1);
var import_sharp = __toESM(require("sharp"), 1);
var uniqueKey = (name) => {
  const slugVal = (0, import_slug4.default)(name, {
    lower: true
  });
  return `${slugVal}-${Date.now()}`;
};
var getMetaData = async (file) => {
  const fileExtension = import_mime_types.default.extension(file.mimetype);
  const mimeType = file.mimetype;
  const size = file.size;
  let width = null;
  let height = null;
  try {
    const metaData = await (0, import_sharp.default)(file.data).metadata();
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

// src/services/s3/save-object.ts
var import_client_s32 = require("@aws-sdk/client-s3");

// src/utils/app/s3-client.ts
var import_client_s3 = require("@aws-sdk/client-s3");
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
  return new import_client_s3.S3Client(s3Config);
};
var s3_client_default = getS3Client();

// src/services/s3/save-object.ts
var saveObject = async (data) => {
  const S3 = await s3_client_default;
  const command = new import_client_s32.PutObjectCommand({
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
var import_client_s33 = require("@aws-sdk/client-s3");
var deleteObject = async (data) => {
  const S3 = await s3_client_default;
  const command = new import_client_s33.DeleteObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key
  });
  return S3.send(command);
};
var delete_object_default = deleteObject;

// src/services/s3/delete-objects.ts
var import_client_s34 = require("@aws-sdk/client-s3");
var deleteObjects = async (data) => {
  const S3 = await s3_client_default;
  const command = new import_client_s34.DeleteObjectsCommand({
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
var import_client_s35 = require("@aws-sdk/client-s3");
var updateObjectKey = async (data) => {
  const S3 = await s3_client_default;
  const copyCommand = new import_client_s35.CopyObjectCommand({
    Bucket: Config.media.store.bucket,
    CopySource: `${Config.media.store.bucket}/${data.oldKey}`,
    Key: data.newKey
  });
  const res = await S3.send(copyCommand);
  const command = new import_client_s35.DeleteObjectCommand({
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

// src/services/media/create-single.ts
var createSingle7 = async (client, data) => {
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
    media_default2.canStoreFiles,
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
    media_default2.setStorageUsed,
    false,
    client
  )({
    add: meta.size
  });
  return format_media_default(media);
};
var create_single_default13 = createSingle7;

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
    media_default2.getSingle,
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
var import_stream = require("stream");

// src/workers/process-image/useProcessImage.ts
var import_worker_threads = require("worker_threads");
var import_path5 = __toESM(require("path"), 1);
var currentDir3 = get_dirname_default(importMetaUrl);
var useProcessImage = async (data) => {
  const worker = new import_worker_threads.Worker(
    import_path5.default.join(currentDir3, "workers/process-image/processImageWorker.cjs")
  );
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
var useProcessImage_default = useProcessImage;

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
  const s3Response = await media_default2.getS3Object({
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
  const processRes = await useProcessImage_default({
    buffer: await helpers_default.streamToBuffer(s3Response.body),
    options: data.options
  });
  const stream = new import_stream.PassThrough();
  stream.end(Buffer.from(processRes.buffer));
  saveAndRegister(client, data, processRes);
  return {
    contentLength: processRes.size,
    contentType: processRes.mimeType,
    body: stream
  };
};
var process_image_default = processImage;

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
  processImage: process_image_default,
  getSingleCount: get_single_count_default
};

// src/services/media/delete-single.ts
var deleteSingle9 = async (client, data) => {
  const media = await service_default(
    media_default2.getSingle,
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
    media_default2.setStorageUsed,
    false,
    client
  )({
    add: 0,
    minus: media.meta.file_size
  });
  return void 0;
};
var delete_single_default15 = deleteSingle9;

// src/services/media/get-multiple.ts
var getMultiple7 = async (client, data) => {
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
var get_multiple_default12 = getMultiple7;

// src/services/media/get-single.ts
var getSingle12 = async (client, data) => {
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
var get_single_default21 = getSingle12;

// src/services/media/update-single.ts
var updateSingle7 = async (client, data) => {
  const media = await service_default(
    media_default2.getSingle,
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
      media_default2.canStoreFiles,
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
      media_default2.setStorageUsed,
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
var update_single_default15 = updateSingle7;

// src/services/media/stream-media.ts
var streamMedia = async (data) => {
  if (data.query?.format === void 0 && data.query?.width === void 0 && data.query?.height === void 0) {
    return await media_default2.getS3Object({
      key: data.key
    });
  }
  const processKey = helpers_default.createProcessKey({
    key: data.key,
    query: data.query
  });
  try {
    return await media_default2.getS3Object({
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
    media_default2.getStorageUsed,
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
    media_default2.getStorageUsed,
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

// src/services/media/stream-error-image.ts
var import_fs_extra4 = __toESM(require("fs-extra"), 1);
var import_path6 = __toESM(require("path"), 1);
var currentDir4 = get_dirname_default(importMetaUrl);
var pipeLocalImage = (res) => {
  let pathVal = import_path6.default.join(currentDir4, "./assets/404.jpg");
  let contentType = "image/jpeg";
  const steam = import_fs_extra4.default.createReadStream(pathVal);
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
    const { buffer, contentType } = await media_default2.pipeRemoteURL({
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
var import_client_s36 = require("@aws-sdk/client-s3");
var getS3Object = async (data) => {
  try {
    const S3 = await s3_client_default;
    const command = new import_client_s36.GetObjectCommand({
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
var import_https = __toESM(require("https"), 1);
var pipeRemoteURL = (data) => {
  return new Promise((resolve, reject) => {
    import_https.default.get(data.url, (response) => {
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
var media_default2 = {
  createSingle: create_single_default13,
  deleteSingle: delete_single_default15,
  getMultiple: get_multiple_default12,
  getSingle: get_single_default21,
  updateSingle: update_single_default15,
  streamMedia: stream_media_default,
  canStoreFiles: can_store_files_default,
  getStorageUsed: get_storage_used_default,
  setStorageUsed: set_storage_used_default,
  getSingleById: get_single_by_id_default,
  streamErrorImage: stream_error_image_default,
  getS3Object: get_s3_object_default,
  pipeRemoteURL: pipe_remote_url_default
};

// src/controllers/media/create-single.ts
var createSingleController6 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default2.createSingle,
      false
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
  schema: media_default.createSingle,
  controller: createSingleController6
};

// src/controllers/media/get-multiple.ts
var getMultipleController6 = async (req, res, next) => {
  try {
    const mediasRes = await service_default(
      media_default2.getMultiple,
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
  schema: media_default.getMultiple,
  controller: getMultipleController6
};

// src/controllers/media/get-single.ts
var getSingleController10 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default2.getSingle,
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
  schema: media_default.getSingle,
  controller: getSingleController10
};

// src/controllers/media/delete-single.ts
var deleteSingleController7 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default2.deleteSingle,
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
var delete_single_default16 = {
  schema: media_default.deleteSingle,
  controller: deleteSingleController7
};

// src/controllers/media/update-single.ts
var updateSingleController8 = async (req, res, next) => {
  try {
    const media = await service_default(
      media_default2.updateSingle,
      false
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
  schema: media_default.updateSingle,
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
  schema: media_default.clearSingleProcessed,
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
  schema: media_default.clearAllProcessed,
  controller: clearAllProcessedController
};

// src/routes/v1/media.routes.ts
var router13 = (0, import_express13.Router)();
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
var import_express14 = require("express");

// src/schemas/email.ts
var import_zod18 = __toESM(require("zod"), 1);
var getMultipleBody7 = import_zod18.default.object({});
var getMultipleQuery7 = import_zod18.default.object({
  filter: import_zod18.default.object({
    to_address: import_zod18.default.string().optional(),
    subject: import_zod18.default.string().optional(),
    delivery_status: import_zod18.default.union([import_zod18.default.string(), import_zod18.default.array(import_zod18.default.string())]).optional(),
    type: import_zod18.default.union([import_zod18.default.string(), import_zod18.default.array(import_zod18.default.string())]).optional(),
    // internal | external
    template: import_zod18.default.string().optional()
  }).optional(),
  sort: import_zod18.default.array(
    import_zod18.default.object({
      key: import_zod18.default.enum(["created_at", "updated_at", "sent_count"]),
      value: import_zod18.default.enum(["asc", "desc"])
    })
  ).optional(),
  page: import_zod18.default.string().optional(),
  per_page: import_zod18.default.string().optional()
});
var getMultipleParams7 = import_zod18.default.object({});
var getSingleBody10 = import_zod18.default.object({});
var getSingleQuery11 = import_zod18.default.object({});
var getSingleParams10 = import_zod18.default.object({
  id: import_zod18.default.string()
});
var deleteSingleBody8 = import_zod18.default.object({});
var deleteSingleQuery8 = import_zod18.default.object({});
var deleteSingleParams8 = import_zod18.default.object({
  id: import_zod18.default.string()
});
var resendSingleBody = import_zod18.default.object({});
var resendSingleQuery = import_zod18.default.object({});
var resendSingleParams = import_zod18.default.object({
  id: import_zod18.default.string()
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
      id: parseInt(req.params.id),
      renderTemplate: true
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
var delete_single_default17 = {
  schema: email_default2.deleteSingle,
  controller: deleteSingleController8
};

// src/controllers/email/resend-single.ts
var resendSingleController = async (req, res, next) => {
  try {
    const email = await service_default(
      email_default.resendSingle,
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
var resend_single_default2 = {
  schema: email_default2.resendSingle,
  controller: resendSingleController
};

// src/routes/v1/emails.routes.ts
var router14 = (0, import_express14.Router)();
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
var import_express15 = require("express");

// src/schemas/forms.ts
var import_zod19 = __toESM(require("zod"), 1);
var getSingleBody11 = import_zod19.default.object({});
var getSingleQuery12 = import_zod19.default.object({});
var getSingleParams11 = import_zod19.default.object({
  form_key: import_zod19.default.string()
});
var getAllBody4 = import_zod19.default.object({});
var getAllQuery4 = import_zod19.default.object({
  include: import_zod19.default.array(import_zod19.default.enum(["fields"])).optional(),
  filter: import_zod19.default.object({
    environment_key: import_zod19.default.string().optional()
  }).optional()
});
var getAllParams4 = import_zod19.default.object({});
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
var import_zod20 = __toESM(require("zod"), 1);
var getSingleBody12 = import_zod20.default.object({});
var getSingleQuery13 = import_zod20.default.object({});
var getSingleParams12 = import_zod20.default.object({
  id: import_zod20.default.string(),
  form_key: import_zod20.default.string()
});
var deleteSingleBody9 = import_zod20.default.object({});
var deleteSingleQuery9 = import_zod20.default.object({});
var deleteSingleParams9 = import_zod20.default.object({
  id: import_zod20.default.string(),
  form_key: import_zod20.default.string()
});
var getMultipleBody8 = import_zod20.default.object({});
var getMultipleQuery8 = import_zod20.default.object({
  sort: import_zod20.default.array(
    import_zod20.default.object({
      key: import_zod20.default.enum(["created_at", "updated_at", "read_at"]),
      value: import_zod20.default.enum(["asc", "desc"])
    })
  ).optional(),
  include: import_zod20.default.array(import_zod20.default.enum(["fields"])).optional(),
  page: import_zod20.default.string().optional(),
  per_page: import_zod20.default.string().optional()
});
var getMultipleParams8 = import_zod20.default.object({
  form_key: import_zod20.default.string()
});
var toggleReadAtBody = import_zod20.default.object({});
var toggleReadAtQuery = import_zod20.default.object({});
var toggleReadAtParams = import_zod20.default.object({
  id: import_zod20.default.string(),
  form_key: import_zod20.default.string()
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
var toggle_read_at_default2 = {
  schema: form_submissions_default.toggleReadAt,
  controller: toggleReadAtController
};

// src/controllers/form-submissions/delete-single.ts
var deleteSingleController9 = async (req, res, next) => {
  try {
    const formSubmission = await service_default(
      form_submissions_default2.deleteSingle,
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
var delete_single_default19 = {
  schema: form_submissions_default.deleteSingle,
  controller: deleteSingleController9
};

// src/routes/v1/forms.routes.ts
var router15 = (0, import_express15.Router)();
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
var import_express16 = require("express");
var router16 = (0, import_express16.Router)();
var options_routes_default = router16;

// src/routes/v1/account.routes.ts
var import_express17 = require("express");

// src/schemas/account.ts
var import_zod21 = __toESM(require("zod"), 1);
var updateMeBody = import_zod21.default.object({
  first_name: import_zod21.default.string().optional(),
  last_name: import_zod21.default.string().optional(),
  username: import_zod21.default.string().min(3).optional(),
  email: import_zod21.default.string().email().optional(),
  role_ids: import_zod21.default.array(import_zod21.default.number()).optional()
});
var updateMeQuery = import_zod21.default.object({});
var updateMeParams = import_zod21.default.object({});
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
    const userRoles = await service_default(users_default.updateSingle, false)(
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
var router17 = (0, import_express17.Router)();
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
var import_express18 = require("express");

// src/schemas/settings.ts
var import_zod22 = __toESM(require("zod"), 1);
var getSettingsQuery = import_zod22.default.object({});
var getSettingsParams = import_zod22.default.object({});
var getSettingsBody = import_zod22.default.object({});
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
var router18 = (0, import_express18.Router)();
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
var import_express19 = require("express");

// src/controllers/media/stream-single.ts
var streamSingleController = async (req, res, next) => {
  try {
    const response = await media_default2.streamMedia({
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
    await media_default2.streamErrorImage({
      fallback: req.query?.fallback,
      error,
      res,
      next
    });
  }
};
var stream_single_default = {
  schema: media_default.streamSingle,
  controller: streamSingleController
};

// src/routes/v1/cdn.routes.ts
var router19 = (0, import_express19.Router)();
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
var currentDir5 = get_dirname_default(importMetaUrl);
var app = async (options) => {
  const app2 = options.express;
  await Config.cachedConfig();
  import_console_log_colors4.log.white("----------------------------------------------------");
  await initialisePool();
  import_console_log_colors4.log.yellow("Database initialised");
  import_console_log_colors4.log.white("----------------------------------------------------");
  app2.use(import_express20.default.json());
  app2.use(
    (0, import_cors.default)({
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
  app2.use((0, import_morgan.default)("dev"));
  app2.use((0, import_cookie_parser.default)(Config.secret));
  import_console_log_colors4.log.yellow("Middleware configured");
  import_console_log_colors4.log.white("----------------------------------------------------");
  await migration_default();
  import_console_log_colors4.log.white("----------------------------------------------------");
  await service_default(Initialise_default, true)();
  import_console_log_colors4.log.yellow("Start up tasks complete");
  import_console_log_colors4.log.white("----------------------------------------------------");
  if (options.public)
    app2.use("/public", import_express20.default.static(options.public));
  routes_default(app2);
  app2.use("/", import_express20.default.static(import_path7.default.join(currentDir5, "../cms")));
  app2.get("*", (req, res) => {
    res.sendFile(import_path7.default.resolve(currentDir5, "../cms", "index.html"));
  });
  import_console_log_colors4.log.yellow("Routes initialised");
  app2.use(errorLogger);
  app2.use(errorResponder);
  app2.use(invalidPathHandler);
  return app2;
};
var init_default = app;

// src/builders/collection-builder/index.ts
var import_zod23 = __toESM(require("zod"), 1);
var CollectionOptionsSchema = import_zod23.default.object({
  type: import_zod23.default.enum(["pages", "singlepage"]),
  title: import_zod23.default.string(),
  singular: import_zod23.default.string(),
  description: import_zod23.default.string().optional(),
  path: import_zod23.default.string().optional(),
  disableHomepage: import_zod23.default.boolean().optional(),
  disableParent: import_zod23.default.boolean().optional(),
  bricks: import_zod23.default.array(
    import_zod23.default.object({
      key: import_zod23.default.string(),
      type: import_zod23.default.enum(["builder", "fixed"]),
      position: import_zod23.default.enum(["standard", "bottom", "top", "sidebar"]).optional()
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
var import_zod24 = __toESM(require("zod"), 1);
var FormBuilderOptionsSchema = import_zod24.default.object({
  title: import_zod24.default.string(),
  description: import_zod24.default.string().optional(),
  fields: import_zod24.default.array(
    import_zod24.default.object({
      zod: import_zod24.default.any().optional(),
      type: import_zod24.default.enum([
        "text",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "textarea"
      ]),
      name: import_zod24.default.string(),
      label: import_zod24.default.string(),
      placeholder: import_zod24.default.string().optional(),
      options: import_zod24.default.array(
        import_zod24.default.object({
          label: import_zod24.default.string(),
          value: import_zod24.default.string()
        })
      ).optional(),
      default_value: import_zod24.default.union([import_zod24.default.string(), import_zod24.default.number(), import_zod24.default.boolean()]).optional(),
      show_in_table: import_zod24.default.boolean().optional()
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
var sendEmail2 = email_default.sendExternal;
var submitForm2 = submitFormExternal;
var src_default = {
  init: init_default
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrickBuilder,
  CollectionBuilder,
  FormBuilder,
  buildConfig,
  init,
  sendEmail,
  submitForm
});
//# sourceMappingURL=index.cjs.map