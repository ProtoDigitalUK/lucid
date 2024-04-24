import T from "@/translations";
import { type Component, type JSXElement, Switch, Match, Show } from "solid-js";
// Components
import Layout from "@/components/Groups/Layout";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";
import ErrorBlock from "@/components/Partials/ErrorBlock";
// Assets
import notifySvg from "@/assets/illustrations/notify.svg";
// Types
import type { ErrorResponse } from "@protoheadless/core/types";

interface FormProps {
	type: "standard" | "page-layout";
	queryState?: {
		isError?: boolean;
	};
	state: {
		isLoading: boolean;
		isDisabled?: boolean;
		errors: ErrorResponse | undefined;
	};
	content: {
		submit: string;
	};
	permission?: boolean;
	onSubmit?: () => void;
	children: JSXElement;
}

export const Form: Component<FormProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<Switch>
			<Match when={props.queryState?.isError}>
				<ErrorBlock
					type={"page-layout"}
					content={{
						image: notifySvg,
						title: T("error_title"),
						description: T("error_message"),
					}}
				/>
			</Match>
			<Match when={!props.queryState?.isError}>
				<form
					class="w-full"
					onSubmit={(e) => {
						e.preventDefault();
						if (props.onSubmit) props.onSubmit();
					}}
				>
					<Switch>
						{/* Standard Submit */}
						<Match when={props.type === "standard"}>
							{props.children}
							<div class="mt-10 w-full">
								<Show when={props.state.errors?.message}>
									<ErrorMessage
										theme="container"
										message={props.state.errors?.message}
									/>
								</Show>

								<Button
									size="medium"
									classes="w-full"
									type="submit"
									theme="primary"
									loading={props.state.isLoading}
									disabled={props.state.isDisabled}
									permission={props.permission}
								>
									{props.content.submit}
								</Button>
							</div>
						</Match>
						{/* Page Layout Submit */}
						<Match when={props.type === "page-layout"}>
							<Layout.PageContent>
								{props.children}
							</Layout.PageContent>
							<Layout.PageFooter>
								<Show when={props.state.errors?.message}>
									<ErrorMessage
										theme="background"
										message={props.state.errors?.message}
									/>
								</Show>
								<Button
									type="submit"
									theme="primary"
									size="medium"
									loading={props.state.isLoading}
									disabled={props.state.isDisabled}
									permission={props.permission}
								>
									{props.content.submit}
								</Button>
							</Layout.PageFooter>
						</Match>
					</Switch>
				</form>
			</Match>
		</Switch>
	);
};
