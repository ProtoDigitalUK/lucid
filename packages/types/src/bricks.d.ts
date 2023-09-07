import {
  CustomField,
  BrickConfigOptionsT,
} from "../../core/src/builders/brick-builder/index.js";

export interface BrickConfigT {
  key: string;
  title: string;
  fields?: CustomField[];
  preview?: BrickConfigOptionsT["preview"];
}
