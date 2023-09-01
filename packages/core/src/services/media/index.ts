import createSingle from "./create-single";
import deleteSingle from "./delete-single";
import getMultiple from "./get-multiple";
import getSingle from "./get-single";
import updateSingle from "./update-single";
import streamMedia from "./stream-media";
import canStoreFiles from "./can-store-files";
import getStorageUsed from "./get-storage-used";
import setStorageUsed from "./set-storage-used";
import getSingleById from "./get-single-by-id";
import getMultipleByIds from "./get-multiple-by-ids";
import streamErrorImage from "./stream-error-image";
import processImage from "./process-image";
import getS3Object from "./get-s3-object";
import pipeRemoteURL from "./pipe-remote-url";

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
  getMultipleByIds,
  streamErrorImage,
  processImage,
  getS3Object,
  pipeRemoteURL,
};
