export interface MediaResT {
  id: number;
  key: string;
  url: string;
  name: string;
  alt: string | null;
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
