export function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value == null) return undefined;
    value = value[key];
  }
  return value;
}
