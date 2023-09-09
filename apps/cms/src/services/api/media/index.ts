import useGetMultiple from "./useGetMultiple";
import useGetSingle from "./useGetSingle";
import useUpdateSingle from "./useUpdateSingle";
import useCreateSingle from "./useCreateSingle";
import useDeleteAllProcessedImages from "./useDeleteAllProcessedImages";

const exportObject = {
  useGetMultiple,
  useDeleteAllProcessedImages,
  useGetSingle,
  useUpdateSingle,
  useCreateSingle,
};

export default exportObject;
