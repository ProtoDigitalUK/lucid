import useGetSingle from "./useGetSingle";
import useGetAll from "./useGetAll";
import createSingle from "./create-single";
import updateSingle from "./update-single";
import deleteSingle from "./delete-single";
// Children
import collections from "./collections";
import forms from "./forms";

const exportObject = {
  useGetAll,
  useGetSingle,
  createSingle,
  updateSingle,
  deleteSingle,
  collections,
  forms,
};

export default exportObject;
