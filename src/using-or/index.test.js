import { disabilityAmount } from './index';

describe('disabilityAmount', () => {
  it('should return 0 if seniority level is less than 2', () => {
    expect(disabilityAmount({ seniority: 1 })).toBe(0);
  });

  it('should return 0 if months disabled is greater than 12', () => {
    expect(disabilityAmount({ seniority: 2, monthsDisabled: 13 })).toBe(0);
  });

  it('should return 0 if employee is part-time', () => {
    expect(disabilityAmount({ seniority: 2, monthsDisabled: 12, isPartTime: true })).toBe(0);
  });

  it('should return 1 if all conditions are met', () => {
    expect(disabilityAmount({ seniority: 2, monthsDisabled: 12, isPartTime: false })).toBe(1);
  });
});
