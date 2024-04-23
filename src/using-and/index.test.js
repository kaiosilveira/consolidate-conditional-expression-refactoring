import { employeeRate } from './index';

describe('employeeRate', () => {
  it('should return 1 if the employee is on vacation and their seniority level is greater than 10', () => {
    expect(employeeRate({ onVacation: true, seniority: 11 })).toBe(1);
  });

  it('should return 0.5 if the employee is on vacation and their seniority level is less than 10', () => {
    expect(employeeRate({ onVacation: true, seniority: 10 })).toBe(0.5);
  });

  it('should return 0.5 if the employee is not on vacation', () => {
    expect(employeeRate({ onVacation: false, seniority: 11 })).toBe(0.5);
  });
});
