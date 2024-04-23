export function disabilityAmount(anEmployee) {
  if (isNotEligibleForDisability()) return 0;
  return 1;

  function isNotEligibleForDisability() {
    return anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12 || anEmployee.isPartTime;
  }
}
