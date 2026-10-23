const fs = require("fs");
const t = fs.readFileSync("src/components/tools/ImageTools.tsx", "utf8");
const lines = t.split("\n");
const l = lines[443];
const i = l.indexOf('save(c, name, "rotated"');
for (let k = i + 20; k < i + 36; k++) {
  console.log((k - i), JSON.stringify(l[k]), l[k].charCodeAt(0));
}
