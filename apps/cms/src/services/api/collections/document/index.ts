import useGetMultiple from "./useGetMultiple";
import useDeleteSingle from "./useDeleteSingle";
import useDeleteMultiple from "./useDeleteMultiple";
import useUpdateSingle from "./useUpdateSingle";
import useGetSingle from "./useGetSingle";
import useCreateSingle from "./useCreateSingle";
import usePromoteSingle from "./usePromoteSingle";
import useGetSingleVersion from "./useGetSingleVersion";
import useGetMultipleRevisions from "./useGetMultipleRevisions";

const exportObject = {
	useGetMultiple,
	useDeleteSingle,
	useDeleteMultiple,
	useUpdateSingle,
	useCreateSingle,
	useGetSingle,
	usePromoteSingle,
	useGetSingleVersion,
	useGetMultipleRevisions,
};

export default exportObject;
