interface QueryHook<T> {
  queryParams: T;
  key?: () => any;
  enabled?: () => boolean;
}
