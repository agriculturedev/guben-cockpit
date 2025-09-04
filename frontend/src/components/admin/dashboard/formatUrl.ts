export function formatUrl(url?: string, max = 48) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const display = `${u.hostname}${u.pathname}`.replace(/\/$/, "");
    return display.length > max ? display.slice(0, max - 1) + "…" : display;
  } catch {
    return url.length > max ? url.slice(0, max - 1) + "…" : url;
  }
}
