import useGetMultiple from "./useGetMultiple";
import useGetSingle from "./useGetSingle";
import useUpdateSingle from "./useUpdateSingle";
import useCreateSingle from "./useCreateSingle";
import useDeleteSingle from "./useDeleteSingle";
import useDeleteAllProcessedImages from "./useDeleteAllProcessedImages";
import useDeleteProcessedImages from "./useDeleteProcessedImages";

const exportObject = {
  useGetMultiple,
  useGetSingle,
  useUpdateSingle,
  useCreateSingle,
  useDeleteSingle,
  useDeleteAllProcessedImages,
  useDeleteProcessedImages,
};

export default exportObject;
