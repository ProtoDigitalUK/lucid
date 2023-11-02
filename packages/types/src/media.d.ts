export interface MediaResT {
  id: number;
  key: string;
  url: string;
  name_translation_key_id: number | null;
  alt_translation_key_id: number | null;
  type: "image" | "video" | "audio" | "document" | "archive" | "unknown";
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
