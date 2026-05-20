---
alwaysApply: true
scene: git_message
---

## Git Commit Message Rules

Commit message use English.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Rules

1. **Subject line** (required)
   - Maximum 50 characters.
   - Use imperative, present tense ("add" not "added").
   - No period at the end.
   - First letter lowercase.

2. **Type** (required)
   - `feat` – new feature
   - `fix` – bug fix
   - `docs` – documentation only
   - `style` – code style (formatting, missing semi-colons, etc.)
   - `refactor` – code change that neither fixes a bug nor adds a feature
   - `perf` – performance improvement
   - `test` – adding missing tests
   - `chore` – maintenance tasks (build, deps, config)

3. **Scope** (optional)
   - A noun describing the section of the codebase (e.g., `api`, `ui`, `db`).
   - Enclosed in parentheses: `feat(auth): ...`

4. **Body** (optional)
   - Wrap at 72 characters.
   - Explain **what** and **why**, not how.
   - Separate from subject with a blank line.

5. **Footer** (optional)
   - Break changes: start with `BREAKING CHANGE:` followed by space or newline.
   - Reference issues: `Closes #123, #456`

### Examples

#### Good

```
feat(parser): add ability to parse arrays
```

```
fix(ui): correct button alignment on mobile

The button was misaligned on screens smaller than 320px.
Added a responsive media query to fix this.

Closes #78
```

```
perf(db): index user email column

Reduces lookup time from O(n) to O(log n).

BREAKING CHANGE: The database migration must be applied.
```

#### Bad

```
Update file
```

(No type, too vague)

```
feat: added new feature.
```

(Subject line uses past tense, ends with period, no scope when helpful)
