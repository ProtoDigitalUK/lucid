import getSingle from "./get-single";
import getAll from "./get-all";
import createSingle from "./create-single";
import updateSingle from "./update-single";
// Children
import collections from "./collections";
import forms from "./forms";

const exportObject = {
  getAll,
  createSingle,
  getSingle,
  updateSingle,
  collections,
  forms,
};

export default exportObject;
