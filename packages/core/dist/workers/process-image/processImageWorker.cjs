"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/workers/process-image/processImageWorker.ts
var processImageWorker_exports = {};
module.exports = __toCommonJS(processImageWorker_exports);
var import_sharp = __toESM(require("sharp"), 1);
var import_worker_threads = require("worker_threads");
var import_mime_types = __toESM(require("mime-types"), 1);
import_worker_threads.parentPort?.on("message", async (data) => {
  try {
    const transform = (0, import_sharp.default)(data.buffer);
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
    const meta = await (0, import_sharp.default)(outputBuffer).metadata();
    const mimeType = import_mime_types.default.lookup(data.options.format || "jpg") || "image/jpeg";
    const response = {
      success: true,
      data: {
        buffer: outputBuffer,
        mimeType,
        size: outputBuffer.length,
        width: meta.width || null,
        height: meta.height || null,
        extension: import_mime_types.default.extension(mimeType) || ""
      }
    };
    import_worker_threads.parentPort?.postMessage(response);
  } catch (error) {
    const response = {
      success: false,
      error: error.message
    };
    import_worker_threads.parentPort?.postMessage(response);
  }
});
//# sourceMappingURL=processImageWorker.cjs.map