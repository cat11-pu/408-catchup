// catchup.js：缺口、要不要全量与抬水位（基线：一律给零与假与原表）
export function gapOf(lead, upto) {
  return 0;
}

export function bulkNeeded(gap, limit) {
  return false;
}

export function leveledInto(nodes, node, upto) {
  return nodes;
}
