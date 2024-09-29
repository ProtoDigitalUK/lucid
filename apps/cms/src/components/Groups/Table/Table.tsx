import {
	type Component,
	type JSXElement,
	Show,
	createSignal,
	Index,
	createMemo,
	createEffect,
	Switch,
	Match,
} from "solid-js";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import Table from "@/components/Groups/Table";
import SelectCol from "@/components/Tables/Columns/SelectCol";
import LoadingRow from "@/components/Tables/Rows/LoadingRow";

interface TableRootProps {
	key: string;
	rows: number;
	caption?: string;
	searchParams: ReturnType<typeof useSearchParamsLocation>;
	head: {
		label: string;
		key: string;
		icon?: JSXElement;
		sortable?: boolean;
	}[];
	state: {
		isLoading: boolean;
		isSuccess: boolean;
	};
	options?: {
		isSelectable?: boolean;
	};
	callbacks?: {
		deleteRows?: (_selected: boolean[]) => Promise<void>;
	};
	children: (_props: {
		include: boolean[];
		isSelectable: boolean;
		selected: boolean[];
		setSelected: (_i: number) => void;
	}) => JSXElement;
}

export const TableRoot: Component<TableRootProps> = (props) => {
	let overflowRef: HTMLDivElement | undefined;

	const [include, setInclude] = createSignal<boolean[]>([]);
	const [selected, setSelected] = createSignal<boolean[]>([]);

	// ----------------------------------------
	// Functions
	const toggleInclude = (index: number) => {
		const isOnlyOne = include().filter((i) => i).length === 1;
		if (isOnlyOne && include()[index]) {
			return;
		}

		setInclude((prev) => {
			const newInclude = [...prev];
			newInclude[index] = !newInclude[index];
			return newInclude;
		});

		setIncludeLS(include());
	};
	const setSelectedIndex = (index: number) => {
		setSelected((prev) => {
			const newSelected = [...prev];
			newSelected[index] = !newSelected[index];
			return newSelected;
		});
	};

	// ----------------------------------------
	// Local Storage
	const getIncludeLS = () => {
		const include = localStorage.getItem(`${props.key}-include`);
		if (include) {
			return JSON.parse(include);
		}
		return props.head.map(() => true);
	};
	const setIncludeLS = (include: boolean[]) => {
		localStorage.setItem(`${props.key}-include`, JSON.stringify(include));
	};

	// ----------------------------------------
	// Callbacks
	const onSelectChange = () => {
		if (props.state.isLoading) return;

		if (allSelected()) {
			setSelected((prev) => {
				return prev.map(() => false);
			});
		} else {
			setSelected((prev) => {
				return prev.map(() => true);
			});
		}
	};

	// ----------------------------------------
	// Memos
	const isSelectable = createMemo(() => {
		return props.options?.isSelectable ?? false;
	});
	const allSelected = createMemo(() => {
		if (!selected()) return false;
		if (selected().length === 0) return false;
		return selected().every((s) => s);
	});
	const selectedCount = createMemo(() => {
		return selected().filter((s) => s).length;
	});
	const includeRows = createMemo(() => {
		return props.head.map((h, i) => {
			return {
				index: i,
				label: h.label,
				include: include()[i],
			};
		});
	});

	// ----------------------------------------
	// Effects
	createEffect(() => {
		const handleResize = () => {
			if (overflowRef && overflowRef.scrollWidth > overflowRef.clientWidth) {
				overflowRef.setAttribute("data-overflowing", "true");
			} else {
				overflowRef?.setAttribute("data-overflowing", "false");
			}
		};

		handleResize();
		setInclude(getIncludeLS());

		const selectedValues = [];
		for (let i = 0; i < props.rows; i++) {
			selectedValues.push(false);
		}
		setSelected(selectedValues);

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	});

	// ----------------------------------------
	// Render
	return (
		<>
			{/* Table */}
			<div class="w-full overflow-x-auto scrollbar" ref={overflowRef}>
				<table class="w-full table h-auto border-collapse">
					<Show when={props?.caption}>
						<caption class="caption-bottom border-t-primary-base border-t-2 border-b border-b-border bg-container-4 text-title py-2 text-sm">
							{props?.caption}
						</caption>
					</Show>
					<thead>
						<tr class="h-10">
							<Show when={isSelectable()}>
								<SelectCol
									type="th"
									value={allSelected()}
									onChange={onSelectChange}
								/>
							</Show>
							<Index each={props.head}>
								{(head, index) => (
									<Table.Th
										key={head().key}
										index={index}
										label={head().label}
										icon={head().icon}
										searchParams={props.searchParams}
										options={{
											include: include()[index],
											sortable: head().sortable,
										}}
									/>
								)}
							</Index>
							<Table.Th classes={"text-right right-0 hover:bg-container-3"}>
								<Table.ColumnToggle
									columns={includeRows() || []}
									callbacks={{
										toggle: toggleInclude,
									}}
								/>
							</Table.Th>
						</tr>
					</thead>
					<tbody>
						<Switch>
							<Match when={props.state.isLoading}>
								<LoadingRow
									columns={props.head.length}
									isSelectable={isSelectable()}
									includes={include()}
								/>
								<LoadingRow
									columns={props.head.length}
									isSelectable={isSelectable()}
									includes={include()}
								/>
								<LoadingRow
									columns={props.head.length}
									isSelectable={isSelectable()}
									includes={include()}
								/>
								<LoadingRow
									columns={props.head.length}
									isSelectable={isSelectable()}
									includes={include()}
								/>
								<LoadingRow
									columns={props.head.length}
									isSelectable={isSelectable()}
									includes={include()}
								/>
								<LoadingRow
									columns={props.head.length}
									isSelectable={isSelectable()}
									includes={include()}
								/>
							</Match>
							<Match when={props.state.isSuccess}>
								{props.children({
									include: include(),
									isSelectable: isSelectable(),
									selected: selected(),
									setSelected: setSelectedIndex,
								})}
							</Match>
						</Switch>
					</tbody>
				</table>
			</div>
			{/* Select Action */}
			<Show
				when={selectedCount() > 0 && props.callbacks?.deleteRows !== undefined}
			>
				<Table.SelectAction
					data={{
						selected: selectedCount(),
					}}
					callbacks={{
						reset: () => setSelected((prev) => prev.map(() => false)),
						delete: async () => {
							if (props.callbacks?.deleteRows) {
								await props.callbacks.deleteRows(selected());
								setSelected((prev) => prev.map(() => false));
							}
						},
					}}
				/>
			</Show>
		</>
	);
};
