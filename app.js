// app.js：渲染结果
import { gapOf, bulkNeeded, leveledInto } from "./catchup.js";
import { step, close } from "./catchrun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const countWays = function (state, way) {
    let sum = 0;
    for (const row of state.catch) {
      if (row[1] === way) {
        sum += 1;
      }
    }
    return sum;
  };
  const fingerprint = function (state) {
    return JSON.stringify({
      lead: state.lead, nodes: state.nodes, catch: state.catch, bulks: state.bulks,
      ledger: state.ledger, applied: state.applied.length
    });
  };
  return { lead: closed.state.lead.slice(),
           nodes: closed.state.nodes.map(function (row) { return [row[0], row[1]]; }),
           catch: closed.state.catch.map(function (row) { return [row[0], row[1], row[2]]; }),
           bulks: closed.state.bulks, steps: countWays(closed.state, "逐条"),
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before, ledger: first.ledger,
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: gapOf(["a", "b", "c"], 1) + (bulkNeeded(3, 2) ? 1 : 0)
             + leveledInto([["n1", 1]], "n1", 4).length };
}
