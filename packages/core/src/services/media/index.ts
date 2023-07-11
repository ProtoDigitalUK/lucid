// Services
import createSingle from "./create-single";
import deleteSingle from "./delete-single";
import getMultiple from "./get-multiple";
import getSingle from "./get-single";
import updateSingle from "./update-single";
import streamMedia from "./stream-media";
import canStoreFiles from "./can-store-files";
import getStorageUsed from "./get-storage-used";
import setStorageUsed from "./set-storage-used";
import format from "./format";
import getSingleById from "./get-single-by-id";
import getMultipleByIds from "./get-multiple-by-ids";

// -------------------------------------------
// Types
export interface MediaResT {
  id: number;
  key: string;
  url: string;
  name: string;
  alt: string | null;
  meta: {
    mime_type: string;
    file_extension: string;
    file_size: number;
    width: number | null;
    height: number | null;
  };
  created_at: string;
  updated_at: string;
}

// -------------------------------------------
// Export
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
  format,
  getSingleById,
  getMultipleByIds,
};
