import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const js = fs.readFileSync("app.js", "utf8");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const idSet = new Set(ids);
const screens = ["home", "story", "theory", "tools", "experiment", "reflection"];

test("all IDs are unique", () => assert.equal(idSet.size, ids.length));
test("all six site sections and nav destinations exist", () => {
  for (const name of screens) {
    assert.ok(idSet.has("page-" + name), "missing page " + name);
    assert.ok(html.includes('data-page="' + name + '"'), "missing nav " + name);
  }
  for (const [, target] of html.matchAll(/data-go="([^"]+)"/g)) {
    assert.ok(screens.includes(target), "broken route: " + target);
  }
});
test("JavaScript's static DOM IDs all exist", () => {
  for (const [, id] of js.matchAll(/\$\("#([^"]+)"\)/g)) {
    assert.ok(idSet.has(id), "missing DOM id " + id);
  }
});
test("static resources use relative paths for GitHub Pages", () => {
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/app\.js"/);
  assert.match(html, /lang="zh-Hant"/);
});
test("study activities are real controls rather than placeholders", () => {
  for (const id of ["timer-toggle", "flash-flip", "quiz-next", "mistake-form", "journal-form", "export-data"]) {
    assert.ok(idSet.has(id), id);
  }
  assert.match(js, /localStorage\.setItem/);
  assert.match(js, /Date\.now\(\)/);
  assert.match(js, /URL\.createObjectURL/);
  assert.match(js, /new Blob/);
});
test("the work distinguishes plans from completed results", () => {
  assert.match(html, /不是已經完成的成果報告/);
  assert.match(html, /不宣稱已完成七天/);
  assert.match(html, /瀏覽器本機儲存/);
});
test("styles are balanced and have mobile layouts", () => {
  assert.equal((css.match(/{/g)||[]).length,(css.match(/}/g)||[]).length);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
