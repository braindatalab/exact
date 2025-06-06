# evalXAI: Opportunities for Improvement

## Backend & API
- `Score` model uses `CharField` for `challenge_id` but `__str__` references `self.challenge` (undefined). Should be a `ForeignKey`.
- Worker image `"exact-worker"` is hard-coded. Move to settings or env var.
- Logging setup repeats on each call. Centralize it during Django startup.
- Error message uses `"error: {e}"` (literal). Use `f"error: {e}"`.
- **Security concerns**:
  - `exec()`/`eval()` is used on user code. High risk. Sandbox or validate (AST, subclassing).
  - CSRF is disabled on the form view. Re-enable or move to React with token auth.
- **Modeling enhancements**:
  - Use S3 for file URLs (stubbed but unused).
  - Add `updated_at`, `created_by` fields for `Challenge` and `Score`.
- **Testing**:
  - No DRF API tests. Add `APITestCase`s.

## Frontend
- Raw `fetch`/`axios` calls — use wrapper or `React-Query`/`SWR` for caching/retries.
- Basic form validation and progress UI. Improve with drag-and-drop + upload indicators.
- Show clear error messages for issues (e.g., worker limit).
- Folder structure growing — extract shared logic (e.g., auth context) to `core/` or `common/`.
- No tests/types. Add:
  - React Testing Library tests
  - TypeScript interfaces for API payloads

## Worker
- Refactor monolithic training pipeline into:
  - data prep
  - model init
  - training loop
  - evaluation
  - Add CLI flags (`--dry-run`, `--resume`)
- Remove commented-out code and TODOs.
- Move hard-coded constants (e.g. `MAX_ITER`, `SEED`) to config file or CLI args.
- Lock GitHub model versions or use checksums.
- Worker output is unstructured; switch to JSON logging for robust parsing.

## Cross-Cutting Concerns
- No CI pipeline. Add GitHub Actions to:
  - Run lint/format (pre-commit)
  - Run unit tests (backend, worker, frontend)
- No lint/format enforcement. Add:
  - `black`, `isort`, `flake8` for Python
  - `eslint`, `prettier` for JS/TS
- No Python type hints. Add `mypy` annotations or VSCode stubs.
- Docs mirror code but lack big-picture overview. Add:
  - Diagram: Django → Worker → Captum → EMD → DB → Frontend

## Quick Wins
- Fix `Score.__str__`
- Clean up logging and error handling in worker spawning
- Lock down `exec()`/`eval()` exposure