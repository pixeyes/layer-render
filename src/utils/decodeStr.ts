export function decodeStr(str: string) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}
