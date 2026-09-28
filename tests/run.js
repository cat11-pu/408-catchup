import assert from "node:assert";
import { gapOf, bulkNeeded, leveledInto } from "../catchup.js";
import { step, close } from "../catchrun.js";
import { render } from "../app.js";

const base = {
  budget: 1, gap: 2,
  state: { lead: [], nodes: [], catch: [], bulks: 0, ledger: [], applied: [] },
  events: [{ id: 1, kind: "lead", item: "a" }],
  bad_item_code: "E_BAD_ITEM", bad_node_code: "E_BAD_NODE",
  bad_upto_code: "E_BAD_UPTO", over_code: "E_OVER",
  back_code: "E_BACK", no_node_code: "E_NO_NODE",
  event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("gapOf returns a number", () => {
  assert.strictEqual(typeof gapOf(["a"], 0), "number");
});

check("bulkNeeded returns a boolean", () => {
  assert.strictEqual(typeof bulkNeeded(3, 2), "boolean");
});

check("leveledInto returns a list", () => {
  assert.ok(Array.isArray(leveledInto([["n1", 1]], "n1", 2)));
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
