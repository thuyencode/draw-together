export function getRedirect(searchStr: string) {
  const urlParams = new URLSearchParams(searchStr);
  return urlParams.get("redirect");
}
