export const MY_NAMES_QUERY_KEY = "my-names" as const;

export function myNamesQueryKey(address: string | undefined) {
  return [MY_NAMES_QUERY_KEY, address?.toLowerCase() ?? ""] as const;
}
