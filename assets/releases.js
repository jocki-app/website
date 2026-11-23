const status = document.querySelector("#release-status"),
  assets = document.querySelector("#release-assets");
const key = "jocki-releases-v1";
const publish = (release) => {
  if (!release?.assets?.length) return;
  status.textContent = `${release.name || release.tag_name} · published ${new Date(release.published_at).toLocaleDateString()}`;
  const links = release.assets
    .filter((asset) =>
      /\.(dmg|zip|exe|AppImage|deb|apk|ipa|gz|yml|yaml|txt)$/i.test(asset.name),
    )
    .map((asset) => {
      const a = document.createElement("a");
      a.className = "button";
      a.textContent = asset.name;
      a.href = asset.browser_download_url;
      return a;
    });
  if (links.length) assets.replaceChildren(...links);
};
try {
  const cached = JSON.parse(sessionStorage.getItem(key) || "null");
  if (cached && Date.now() - cached.time < 300000) publish(cached.release);
  else
    fetch("https://api.github.com/repos/jocki-app/jocki/releases", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => {
        if (!r.ok) throw Error("No published releases");
        return r.json();
      })
      .then((releases) => {
        const release = releases.find((r) => !r.draft && r.assets?.length);
        if (release) {
          sessionStorage.setItem(
            key,
            JSON.stringify({ time: Date.now(), release }),
          );
          publish(release);
        }
      })
      .catch(() => {});
} catch {}
