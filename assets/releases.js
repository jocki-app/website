import {newestRelease, releaseAssets, assetLabel} from "./release-data.js";
const status = document.querySelector("#release-status"), assets = document.querySelector("#release-assets");
const key = "jocki-releases-v1";
function publish(release) {
  const files=releaseAssets(release);
  if (!files.length) return;
  status.textContent = `${release.name || release.tag_name} · published ${new Date(release.published_at).toLocaleDateString()}`;
  assets.replaceChildren(...files.map(asset=>{
    const a=document.createElement("a");
    a.className="button"; a.textContent=assetLabel(asset.name); a.title=asset.name;
    a.href=asset.browser_download_url; return a;
  }));
}
async function discover() {
  let cached;
  try { cached=JSON.parse(sessionStorage.getItem(key)||"null"); } catch {}
  if (cached && Date.now()-cached.time < 300000 && releaseAssets(cached.release).length) {publish(cached.release);return;}
  const response=await fetch("https://api.github.com/repos/jocki-app/jocki/releases",{headers:{Accept:"application/vnd.github+json"}});
  if (!response.ok) throw Error("Release discovery unavailable");
  const release=newestRelease(await response.json());
  if (!release) return;
  publish(release);
  try {sessionStorage.setItem(key,JSON.stringify({time:Date.now(),release}));} catch {}
}
// The static release/source links remain usable if GitHub is unavailable.
discover().catch(()=>{});
