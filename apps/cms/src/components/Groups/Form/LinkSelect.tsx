import T from "@/translations";
import { type Component, Match, Switch } from "solid-js";
import classNames from "classnames";
import { FaSolidPen } from "solid-icons/fa";
import type { ErrorResult, FieldErrors, LinkValue } from "@lucidcms/core/types";
import linkFieldStore from "@/store/forms/linkFieldStore";
import Button from "@/components/Partials/Button";
import Form from "@/components/Groups/Form";

interface LinkSelectProps {
	id: string;
	value: LinkValue | undefined | null;
	onChange: (_value: LinkValue | null) => void;
	copy?: {
		label?: string;
		describedBy?: string;
	};
	disabled?: boolean;
	noMargin?: boolean;
	required?: boolean;
	errors?: ErrorResult | FieldErrors;
	altLocaleError?: boolean;
}

export const LinkSelect: Component<LinkSelectProps> = (props) => {
	// -------------------------------
	// Functions
	const openLinkModal = () => {
		linkFieldStore.set({
			onSelectCallback: (link) => {
				props.onChange(link);
			},
			open: true,
			selectedLink: props.value as LinkValue,
		});
	};

	// -------------------------------
	// Memos
	const linkLabel = () => {
		const value = props.value as LinkValue;
		return value?.label || value?.url;
	};

	// -------------------------------
	// Render
	return (
		<div
			class={classNames("w-full", {
				"mb-0": props.noMargin,
				"mb-2.5 last:mb-0": !props.noMargin,
			})}
		>
			<Form.Label
				id={props.id}
				label={props.copy?.label}
				required={props.required}
				theme={"basic"}
				altLocaleError={props.altLocaleError}
			/>
			<div class="mt-2.5 w-full flex flex-wrap gap-2.5">
				<Switch>
					<Match when={!linkLabel()}>
						<Button
							type="button"
							theme="border-outline"
							size="x-small"
							onClick={openLinkModal}
						>
							{T()("select_link")}
						</Button>
					</Match>
					<Match when={props.value}>
						<button
							type="button"
							onClick={openLinkModal}
							class="flex cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 font-base items-center py-2 px-2.5 border-border text-body border text-sm rounded-md hover:bg-primary-hover hover:text-primary-contrast transition-colors duration-200 ease-in-out"
							disabled={props.disabled}
						>
							<span class="line-clamp-1">{linkLabel()}</span>
							<span class="ml-2.5 flex items-center border-l border-current pl-2.5">
								<FaSolidPen size={12} class="text-current" />
							</span>
						</button>
						<button
							type="button"
							class="hover:text-error-base disabled:cursor-not-allowed disabled:opacity-80 text-body flex items-center text-sm lowercase"
							onClick={() => {
								props.onChange(null);
							}}
							disabled={props.disabled}
						>
							{T()("clear")}
						</button>
					</Match>
				</Switch>
			</div>
			<Form.DescribedBy
				id={props.id}
				describedBy={props.copy?.describedBy}
			/>
			<Form.ErrorMessage id={props.id} errors={props.errors} />
		</div>
	);
};
