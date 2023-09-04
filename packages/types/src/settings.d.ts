export interface SettingsResT {
  media: {
    storage_used: number | null;
    storage_limit: number | null;
    storage_remaining: number | null;
    processed_images: {
      per_image_limit: number | null;
      total: number | null;
    };
  };
}
