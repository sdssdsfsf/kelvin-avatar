const fs = require("fs");
const t = fs.readFileSync("src/components/tools/ImageTools.tsx", "utf8");
const lines = t.split("\n");
const l = lines[443];
const i = l.indexOf('save(c, name, "rotated"');
console.log(JSON.stringify(l.slice(i, i + 40)));
