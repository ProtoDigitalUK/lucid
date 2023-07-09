import slugify from "slugify";
import fileUpload from "express-fileupload";
import mime from "mime-types";
import sharp from "sharp";

// -------------------------------------------
// Types
export interface MediaMetaDataT {
  mimeType: string;
  fileExtension: string;
  size: number;
  width: number | null;
  height: number | null;
}

// -------------------------------------------
// Functions

// Generate a unique key for a media item
const uniqueKey = (name: string) => {
  const slug = slugify(name, {
    lower: true,
    strict: true,
  });
  return `${slug}-${Date.now()}`;
};

// Get meta data from a file
const getMetaData = async (
  file: fileUpload.UploadedFile
): Promise<MediaMetaDataT> => {
  const fileExtension = mime.extension(file.mimetype);
  const mimeType = file.mimetype;
  const size = file.size;
  let width = null;
  let height = null;

  try {
    const metaData = await sharp(file.data).metadata();
    width = metaData.width;
    height = metaData.height;
  } catch (error) {}

  return {
    mimeType: mimeType,
    fileExtension: fileExtension || "",
    size: size,
    width: width || null,
    height: height || null,
  };
};

// formats files from request into an array
const formatReqFiles = (files: fileUpload.FileArray) => {
  // Check if files exist

  const file = files["file"];
  if (Array.isArray(file)) {
    return file;
  } else {
    return [file];
  }
};

// -------------------------------------------
const helpers = {
  uniqueKey,
  getMetaData,
  formatReqFiles,
};

export default helpers;
