const fs = require("fs");
const s = fs.readFileSync("src/lib/tools.ts", "utf8");
const m = s.match(/\{ slug: /g);
console.log("tools:", m ? m.length : 0);
