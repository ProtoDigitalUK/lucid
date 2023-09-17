import createSingle from "./create-single.js";
import deleteSingle from "./delete-single.js";
import getMultiple from "./get-multiple.js";
import getSingle from "./get-single.js";
import updateSingle from "./update-single.js";
import streamMedia from "./stream-media.js";
import canStoreFiles from "./can-store-files.js";
import getStorageUsed from "./get-storage-used.js";
import setStorageUsed from "./set-storage-used.js";
import getSingleById from "./get-single-by-id.js";
import streamErrorImage from "./stream-error-image.js";
import getS3Object from "./get-s3-object.js";
import pipeRemoteURL from "./pipe-remote-url.js";

export default {
  createSingle,
  deleteSingle,
  getMultiple,
  getSingle,
  updateSingle,
  streamMedia,
  canStoreFiles,
  getStorageUsed,
  setStorageUsed,
  getSingleById,
  streamErrorImage,
  getS3Object,
  pipeRemoteURL,
};
