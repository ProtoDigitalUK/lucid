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
