const downloads = /\.(dmg|zip|exe|AppImage|deb|apk|ipa|tar\.gz)$/i;
export function releaseAssets(release) {
  return (release?.assets ?? []).filter(asset => {
    if (!downloads.test(asset.name ?? "")) return false;
    try {
      const url = new URL(asset.browser_download_url);
      return url.protocol === "https:" && url.hostname === "github.com" && url.pathname.startsWith("/jocki-app/jocki/releases/download/");
    } catch { return false; }
  });
}
export function newestRelease(releases) {
  if (!Array.isArray(releases)) return undefined;
  return releases.filter(r => !r.draft && Number.isFinite(Date.parse(r.published_at)) && releaseAssets(r).length)
    .sort((a,b) => Date.parse(b.published_at)-Date.parse(a.published_at))[0];
}
export function assetLabel(name) {
  const platform = /android|\.apk$/i.test(name) ? "Android" : /ios|\.ipa$/i.test(name) ? "iOS" : /mac|darwin|\.dmg$/i.test(name) ? "macOS" : /win|\.exe$/i.test(name) ? "Windows" : /linux|AppImage|\.deb$/i.test(name) ? "Linux" : /web/i.test(name) ? "Web" : "Download";
  const arch = /arm64|aarch64/i.test(name) ? "ARM64" : /x64|x86_64|amd64/i.test(name) ? "x64" : "";
  const format = name.match(/\.(tar\.gz|[^.]+)$/)?.[1] ?? "";
  return [platform,arch,format].filter(Boolean).join(" · ");
}
