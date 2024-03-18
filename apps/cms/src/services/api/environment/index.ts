import useGetSingle from "./useGetSingle";
import useGetAll from "./useGetAll";
import useCreateSingle from "./useCreateSingle";
import useUpdateSingle from "./useUpdateSingle";
import useDeleteSingle from "./useDeleteSingle";
// Children
import collections from "./collections";
import forms from "./forms";

const exportObject = {
	useGetAll,
	useGetSingle,
	useCreateSingle,
	useUpdateSingle,
	useDeleteSingle,
	collections,
	forms,
};

export default exportObject;
