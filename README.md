[![Continuous Integration](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Consolidate Conditional Expression

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
if (anEmployee.seniority < 2) return 0;
if (anEmployee.monthsDisabled > 12) return 0;
if (anEmployee.isPartTime) return 0;
```

</td>

<td>

```javascript
if (isNotEligibleForDisability()) return 0;

function isNotEligibleForDisability() {
  return anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12 || anEmployee.isPartTime;
}
```

</td>
</tr>
</tbody>
</table>

Oftentimes we see conditions that evolve in the form of new rules being added to an already existing chain of validations. Sometimes, though, these conditions are only extensions to the already stated conditions. In these cases, consolidating them into a single condition helps with readability and sets the stage for other refactorings.

## Working examples

The book brings two simple examples: one that requires OR operators, and another that requires AND operators.

### Using OR

In this example, we're checking three properties of an `employee` object and returning the same value if any of them satisfies a condition. The initial code looks like this:

```javascript
export function disabilityAmount(anEmployee) {
  if (anEmployee.seniority < 2) return 0;
  if (anEmployee.monthsDisabled > 12) return 0;
  if (anEmployee.isPartTime) return 0;
  return 1;
}
```

Our goal is to consolidate these two separate `if` statements into a single one.

#### Test suite

The test suite for this code covers all the possible conditions and their respective return values:

```javascript
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
```

With this in place, we can safely proceed with the refactoring steps.

#### Steps

We can start by merging the `seniority` and `monthsDisabled` conditions:

```diff
+++ b/src/using-or/index.js
@@ -1,6 +1,5 @@
 export function disabilityAmount(anEmployee) {
-  if (anEmployee.seniority < 2) return 0;
-  if (anEmployee.monthsDisabled > 12) return 0;
+  if (anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12) return 0;
   if (anEmployee.isPartTime) return 0;
   return 1;
 }
```

Then, we move forward and also merge `isPartTime` into the other two:

```diff
+++ b/src/using-or/index.js
@@ -1,5 +1,4 @@
 export function disabilityAmount(anEmployee) {
-  if (anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12) return 0;
-  if (anEmployee.isPartTime) return 0;
+  if (anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12 || anEmployee.isPartTime) return 0;
   return 1;
 }
```

And that's essentially it, now the conditionals are consolidated, but the result looks long and somewhat hard to read. To address that, we can [extract a function](https://github.com/kaiosilveira/extract-function-refactoring) off of the `if` statement:

```diff
+++ b/src/using-or/index.js
@@ -1,4 +1,8 @@
 export function disabilityAmount(anEmployee) {
-  if (anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12 || anEmployee.isPartTime) return 0;
+  if (isNotEligibleForDisability()) return 0;
   return 1;
+
+  function isNotEligibleForDisability() {
+    return anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12 || anEmployee.isPartTime;
+  }
 }
```

And now we're done. The code is now compact and easy to read.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                                | Message                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [b8204f6](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/commit/b8204f6a47ffe4e683ceee8b285689f20803c328) | merge seniority level and monthsDisabled conditions |
| [557b25d](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/commit/557b25d83eeab94715ccaeb0e250c4725435ded6) | merge isPartTime condition into the other two       |
| [fa3f6dc](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/commit/fa3f6dc47987bd9304429bfda0dd813e47d3c223) | extract function on large condition group           |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/commits/main).

### Using AND

The second example is short: a function with a nested `if` statement:

```javascript
export function employeeRate(anEmployee) {
  if (anEmployee.onVacation) {
    if (anEmployee.seniority > 10) return 1;
  }

  return 0.5;
}
```

Our goal is to remove the nesting by merging the two statements into a single one.

#### Test suite

The test suite for `employeeRate` is straightforward:

```javascript
describe('employeeRate', () => {
  it('should return 1 if the employee is on vacation and their seniority level is gr eater than 10', () => {
    expect(employeeRate({ onVacation: true, seniority: 11 })).toBe(1);
  });

  it('should return 0.5 if the employee is on vacation and their seniority level is less than 10', () => {
    expect(employeeRate({ onVacation: true, seniority: 10 })).toBe(0.5);
  });

  it('should return 0.5 if the employee is not on vacation', () => {
    expect(employeeRate({ onVacation: false, seniority: 11 })).toBe(0.5);
  });
});
```

And this is the safety we need to start refactoring.

#### Steps

Given the simplicity, there's only one step needed, and that's to extract the condition inside the nested `if` statement and put it together with its parent:

```diff
+++ b/src/using-and/index.js
@@ -1,7 +1,4 @@
 export function employeeRate(anEmployee) {
-  if (anEmployee.onVacation) {
-    if (anEmployee.seniority > 10) return 1;
-  }
-
+  if (anEmployee.onVacation && anEmployee.seniority > 10) return 1;
   return 0.5;
 }
```

And that's it!

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                                | Message                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [bc4e123](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/commit/bc4e123817b3850d4b5b66f4f7873ab7ded21dd7) | merge nested condition into top-level condition |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring/commits/main).
