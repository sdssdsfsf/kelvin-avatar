const fs = require("fs");
const t = fs.readFileSync("src/components/tools/ImageTools.tsx", "utf8");
const lines = t.split("\n");
for (let i = 443; i <= 444; i++) {
  console.log("LINE " + (i+1) + " LEN " + lines[i].length);
  console.log(JSON.stringify(lines[i].slice(-60)));
}
