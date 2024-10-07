import useGetMultiple from "./useGetMultiple";
import useDeleteSingle from "./useDeleteSingle";
import useDeleteMultiple from "./useDeleteMultiple";
import useUpdateSingle from "./useUpdateSingle";
import useGetSingle from "./useGetSingle";
import useCreateSingle from "./useCreateSingle";
import usePromoteSingle from "./usePromoteSingle";
import useGetSingleVersion from "./useGetSingleVersion";

const exportObject = {
	useGetMultiple,
	useDeleteSingle,
	useDeleteMultiple,
	useUpdateSingle,
	useCreateSingle,
	useGetSingle,
	usePromoteSingle,
	useGetSingleVersion,
};

export default exportObject;
