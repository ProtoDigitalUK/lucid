import { CustomField, BrickConfigOptionsT } from "@lucid/brick-builder";

export interface BrickConfigT {
  key: string;
  title: string;
  fields?: CustomField[];
  preview?: BrickConfigOptionsT["preview"];
}
