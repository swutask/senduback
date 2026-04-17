export function toKebabCase(str: string) {
  const decoded = decodeURIComponent(str);

  return decoded
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → dash
    .toLowerCase();
}

export function isUUID(str: string) {
  return /^[0-9a-f-]{36}$/i.test(str);
}

export function isObjectId(str: string) {
  return /^[0-9a-f]{24}$/i.test(str);
}
