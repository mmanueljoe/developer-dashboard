export function getFaviconUrl(url) {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (error) {
    const match = url.match(/https?:\/\/([^\/]+)/);
    if (match) {
      return `https://www.google.com/s2/favicons?domain=${match[1]}&sz=64`;
    }
    return null;
  }
}
