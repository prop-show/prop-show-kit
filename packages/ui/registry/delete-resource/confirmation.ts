export function matchesResourceName(input: string, resourceName: string, caseSensitive = true) {
  if (!resourceName) return false;
  return caseSensitive
    ? input === resourceName
    : input.toLowerCase() === resourceName.toLowerCase();
}
