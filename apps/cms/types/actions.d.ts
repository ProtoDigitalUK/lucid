import type { JSXElement } from "solid-js";

type MutationFunction<T> = (props: T) => void;

interface ActionChildren<MutationProps> {
  children: (props: {
    mutation: {
      action:
        | MutationFunction<MutationProps>
        | {
            [key: string]: MutationFunction<MutationProps>;
          };

      isLoading: boolean;
      isError: boolean;
    };
    // Used if the mutation requires data - used in child component for loading/error state
    query?: {
      isLoading: boolean;
      isError: boolean;
    };
    errors: APIErrorResponse | undefined;
  }) => JSXElement;
}
