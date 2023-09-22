import { Accessor } from "solid-js";
import equal from "fast-deep-equal";
// Types
import type { MediaResT } from "@lucid/types/src/media";
import type { CollectionResT } from "@lucid/types/src/collections";
import type { UserResT } from "@lucid/types/src/users";

// ---------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericObject = Record<string, any>;

const deepMerge = (obj1: GenericObject, obj2: GenericObject): GenericObject => {
  const result: GenericObject = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key]) &&
        obj1[key]
      ) {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
};

// ---------------------------------------------
// Returns any updated values in obj2 compared to obj1
const deepDiff = <T>(obj1: T, obj2: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (Array.isArray(obj1[key])) {
        if (!equal(obj1[key], obj2[key])) {
          result[key] = obj2[key];
        }
      } else if (typeof obj1[key] === "object" && obj1[key] !== null) {
        const diff = deepDiff(obj1[key], obj2[key]);
        if (Object.keys(diff).length > 0) {
          // @ts-ignore
          result[key] = diff;
        }
      } else {
        if (obj1[key] !== obj2[key]) {
          result[key] = obj2[key];
        }
      }
    }
  }

  // go through obj2 and find keys that are not in obj1
  for (const key in obj2) {
    if (
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      !Object.prototype.hasOwnProperty.call(obj1, key)
    ) {
      result[key] = obj2[key];
    }
  }

  return result;
};
const updateData = <T>(obj1: T, obj2: T) => {
  const result = deepDiff(obj1, obj2);

  return {
    changed: Object.keys(result).length > 0,
    data: result,
  };
};

// ---------------------------------------------
// Resolve signals and return the value
const resolveValue = <T>(value: Accessor<T> | T): T =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof value === "function" ? (value as any)() : value;

// ---------------------------------------------
// Bytes to human readable format
const bytesToSize = (bytes?: number | null): string => {
  if (!bytes) return "0 Byte";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

// ---------------------------------------------
// Get media type from mime type
const getMediaType = (mimeType?: string): MediaResT["type"] => {
  if (!mimeType) return "unknown";
  const normalizedMimeType = mimeType.toLowerCase();

  if (normalizedMimeType.includes("image")) return "image";
  if (normalizedMimeType.includes("video")) return "video";
  if (normalizedMimeType.includes("audio")) return "audio";
  if (
    normalizedMimeType.includes("pdf") ||
    normalizedMimeType.startsWith("application/vnd")
  )
    return "document";
  if (normalizedMimeType.includes("zip") || normalizedMimeType.includes("tar"))
    return "archive";

  return "unknown";
};

// ---------------------------------------------
// Get first env link
const getFirstEnvLink = (data: {
  collections: CollectionResT[];
  canCreate: boolean;
  environment?: string;
}) => {
  // work out the first link based on collections, forms, menus, etc. in the environment.
  // If no envrionemtn, take the to the create environment route.

  if (!data.environment) {
    if (data.canCreate) return "/env/create";
    return "/";
  }

  let url = `/env/${data.environment}/`;

  const pagesCollections = data.collections.filter(
    (collection) => collection.type === "pages"
  );
  const singlePagesCollections = data.collections.filter(
    (collection) => collection.type === "singlepage"
  );

  if (pagesCollections.length) {
    url += `collection/${data.collections[0].key}`;
    return url;
  }

  if (singlePagesCollections.length) {
    url += `${data.collections[0].key}`;
    return url;
  }

  return url;
};

// ---------------------------------------------
// Format user name
const formatUserName = (user: {
  username: UserResT["username"];
  first_name?: UserResT["first_name"];
  last_name?: UserResT["last_name"];
}): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name} - (${user.username})`;
  } else if (user.first_name) {
    return `${user.first_name} - (${user.username})`;
  } else {
    return user.username;
  }
};

// ---------------------------------------------
// Format User Initials
const formatUserInitials = (user: {
  first_name?: UserResT["first_name"];
  last_name?: UserResT["last_name"];
  username: UserResT["username"];
}): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`;
  } else if (user.first_name) {
    return `${user.first_name[0]}${user.first_name[1]}`;
  } else {
    return `${user.username[0]}${user.username[1]}`;
  }
};

// ---------------------------------------------
// Exports
const helpers = {
  deepMerge,
  deepDiff,
  updateData,
  resolveValue,
  bytesToSize,
  getMediaType,
  getFirstEnvLink,
  formatUserName,
  formatUserInitials,
};

export default helpers;
