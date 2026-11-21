// The Help topics the Guide's English pages answer (decision 97), one a line, sorted:
//   npm run topics
// A page answers its own path, `tools/processing/exposure`, and the topics its front
// matter lists. It fails on a topic two pages claim and on a topic that is another page's
// path. With a file of the topics the app uses, one a line (`apertrust --list-help-topics`,
// planned; the app has no Help yet, so CI checks the pages alone), it lists those no page
// answers and fails if there are any:
//   npm run topics -- --check app-topics.txt
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { slug } from "github-slugger";
import { parse } from "yaml";

const root = "src/content/docs/en";

// A page as Starlight's docs loader finds one: a Markdown file whose name does not start
// with `_`.
const pageFile = /^[^_].*\.(markdown|mdown|mkdn|mkd|mdwn|md|mdx)$/;

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pages(path);
    return pageFile.test(name) ? [path] : [];
  });
}

// A page's YAML front matter, found and parsed as Astro does, with its options: after a
// byte order mark or blank lines at most.
function frontOf(path) {
  const front = readFileSync(path, "utf8").match(/(?:^\uFEFF?|^\s*\n)---([\s\S]*?\n)---/);
  return (front && parse(front[1], { customTags: ["timestamp"], merge: true, schema: "core" })) || {};
}

// A page's path under its language, as Starlight serves it: `tools/processing/exposure`,
// and "" for the start page. Astro slugs each folder and file name with github-slugger
// (`Raw Files.md` is `raw-files`), unless the front matter's `slug` names the path, from
// `en/`; null for a slug outside it, which the build would not count as English.
function pathOf(path) {
  const named = frontOf(path).slug;
  if (named) return /^en(\/|$)/.test(String(named)) ? String(named).replace(/^en\/?/, "") : null;
  return relative(root, path)
    .split("\\")
    .join("/")
    .replace(/\.[^./]+$/, "")
    .split("/")
    .map((segment) => slug(segment))
    .join("/")
    .replace(/(^|\/)index$/, "");
}

// The topics a page's front matter lists, a heading after a `#` left out.
function topicsOf(path) {
  return (frontOf(path).topics ?? []).map((topic) => String(topic).split("#")[0]);
}

const all = pages(root);
let failed = false;
// Each page's own path, which two files may share: `concepts/example.md` and
// `concepts/example/index.md`.
const paths = new Map();
const pathOfPage = new Map(all.map((page) => [page, pathOf(page)]));
for (const [page, path] of pathOfPage) {
  if (path === null) {
    console.error(`${page}'s slug, ${frontOf(page).slug}, does not start with en/`);
    failed = true;
  } else if (paths.has(path)) {
    console.error(`path ${path || "/"} is both ${paths.get(path)} and ${page}`);
    failed = true;
  } else {
    paths.set(path, page);
  }
}
const claimed = new Map([...paths].filter(([path]) => path !== ""));
for (const page of all) {
  for (const topic of topicsOf(page)) {
    if (topic === pathOfPage.get(page)) continue;
    if (paths.has(topic)) {
      console.error(`topic ${topic}, claimed by ${page}, is the path of ${paths.get(topic)}`);
      failed = true;
    } else if (claimed.has(topic)) {
      console.error(`topic ${topic} is claimed by ${claimed.get(topic)} and ${page}`);
      failed = true;
    } else {
      claimed.set(topic, page);
    }
  }
}
if (failed) process.exit(1);

const check = process.argv.indexOf("--check");
if (check === -1) {
  for (const topic of [...claimed.keys()].sort()) console.log(topic);
} else {
  const used = readFileSync(process.argv[check + 1], "utf8").split("\n").map((t) => t.trim()).filter(Boolean);
  const missing = used.filter((topic) => !claimed.has(topic));
  for (const topic of missing) console.log(`no page claims ${topic}`);
  if (missing.length) process.exit(1);
  console.log(`every one of the app's ${used.length} topics has a page`);
}
