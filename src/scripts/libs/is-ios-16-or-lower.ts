export function isIos16orLower(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (!/iP(hone|od|ad)/.test(ua)) return false;
  const m = ua.match(/OS (\d+)_/);
  return m ? parseInt(m[1], 10) <= 16 : false;
}
