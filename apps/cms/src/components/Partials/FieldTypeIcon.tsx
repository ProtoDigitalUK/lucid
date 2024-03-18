import { Component, Match, Switch } from "solid-js";
// Types
import { FieldTypesT } from "@headless/types/src/bricks";
import classNames from "classnames";

interface FieldTypeIconProps {
	type: FieldTypesT;
}

const FieldTypeIcon: Component<FieldTypeIconProps> = (props) => {
	// -------------------------------
	// Render
	return (
		<div
			class={classNames(
				"absolute top-0 left-0 w-7 h-7 min-w-[28px] mr-2.5 flex items-center justify-center bg-opacity-30 border-opacity-40 rounded-md text-black text-opacity-50 text-sm",
				{
					"bg-[#4DD64D] border-[#4DD64D]":
						props.type === "text" ||
						props.type === "wysiwyg" ||
						props.type === "textarea",
					"bg-[#4E93E3] border-[#4E93E3]":
						props.type === "number" ||
						props.type === "select" ||
						props.type === "datetime" ||
						props.type === "checkbox",
					"bg-[#E8962A] border-[#E8962A]": props.type === "repeater",
					"bg-[#CF40C9] border-[#CF40C9]":
						props.type === "pagelink" || props.type === "link",
					"bg-[#D64F8C] border-[#D64F8C]": props.type === "json",
					"bg-[#5955DB] border-[#5955DB]": props.type === "media",
					"bg-[#2FDBBB] border-[#2FDBBB]": props.type === "colour",
				},
			)}
		>
			<Switch>
				<Match when={props.type === "text"}>Aa</Match>
				<Match when={props.type === "wysiwyg"}>W</Match>
				<Match when={props.type === "textarea"}>T</Match>
				<Match when={props.type === "number"}>#</Match>
				<Match when={props.type === "select"}>S</Match>
				<Match when={props.type === "datetime"}>D</Match>
				<Match when={props.type === "checkbox"}>C</Match>
				<Match when={props.type === "repeater"}>R</Match>
				<Match when={props.type === "pagelink"}>P</Match>
				<Match when={props.type === "link"}>L</Match>
				<Match when={props.type === "json"}>J</Match>
				<Match when={props.type === "media"}>M</Match>
				<Match when={props.type === "colour"}>C</Match>
			</Switch>
		</div>
	);
};

export default FieldTypeIcon;
