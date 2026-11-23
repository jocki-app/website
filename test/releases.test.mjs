import {test} from "node:test";
import assert from "node:assert/strict";
import {newestRelease, releaseAssets, assetLabel} from "../assets/release-data.js";
const asset=name=>({name,browser_download_url:`https://github.com/jocki-app/jocki/releases/download/v0.1.0/${name}`});
test("chooses the latest published installable release, regardless of creation order",()=>{
 const stable={tag_name:"v0.1.0",published_at:"2026-11-20T00:00:00Z",assets:[asset("Jocki-macos-arm64.dmg")]};
 const draft={...stable,published_at:"2026-11-22T00:00:00Z",draft:true};
 const dev={...stable,tag_name:"v0.2.0-dev.1",prerelease:true,published_at:"2026-11-21T00:00:00Z"};
 assert.equal(newestRelease([stable,draft,{...draft,draft:false,assets:[]},dev]),dev);
 assert.equal(newestRelease([]),undefined);
 assert.equal(newestRelease({}),undefined);
});
test("offers actual GitHub binaries with readable platform labels",()=>{
 const files=[asset("Jocki-linux-arm64.AppImage"),asset("SHA256SUMS.txt"),{...asset("unsafe.exe"),browser_download_url:"javascript:alert(1)"}];
 assert.deepEqual(releaseAssets({assets:files}),[files[0]]);
 assert.equal(assetLabel(files[0].name),"Linux · ARM64 · AppImage");
 assert.equal(assetLabel("Jocki-android.apk"),"Android · apk");
 assert.equal(assetLabel("Jocki-macos-x64.dmg"),"macOS · x64 · dmg");
});
