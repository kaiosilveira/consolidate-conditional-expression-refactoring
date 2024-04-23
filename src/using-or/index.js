export function disabilityAmount(anEmployee) {
  if (anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12) return 0;
  if (anEmployee.isPartTime) return 0;
  return 1;
}
