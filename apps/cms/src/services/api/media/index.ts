import useGetMultiple from "./useGetMultiple";
import useGetSingle from "./useGetSingle";
import useUpdateSingle from "./useUpdateSingle";
import useDeleteSingle from "./useDeleteSingle";
import useDeleteAllProcessedImages from "./useDeleteAllProcessedImages";
import useDeleteProcessedImages from "./useDeleteProcessedImages";
import useCreateSingle from "./useCreateSingle";

const exportObject = {
	useGetMultiple,
	useGetSingle,
	useUpdateSingle,
	useDeleteSingle,
	useDeleteAllProcessedImages,
	useDeleteProcessedImages,
	useCreateSingle,
};

export default exportObject;
