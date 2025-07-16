# Unit Testing Guide for EXACT Project

This guide is for future developers and students working on the EXACT project. It outlines which methods and components should be covered by unit tests, and gives a brief idea of how to approach testing for each part of the codebase.

---

## Table of Contents
- [Backend (Django)](#backend-django)
- [Worker (Python)](#worker-python)
- [Frontend (React/Next.js)](#frontend-reactnextjs)
- [General Tips](#general-tips)

---

## Backend (Django)

**Location:** `platform/backend/api/` and `platform/backend/user_api/`

### Key Methods and Views to Test

- **API Views (in `api/views.py`):**
  - `xai_detail`, `score_detail`, `get_leaderboard`, `dataset_detail`, `mlmodel_detail`, `xaimethod_detail`, `create_challenge`, `challenge_form_view`, `success_view`, `get_challenge`, `get_challenges`, `get_scores`, `get_challenge_metadata`, `delete_challenge`
  - *How to test:* Use Django's `APITestCase` or `APIClient` to simulate HTTP requests (GET, POST, DELETE, etc.) and check responses, status codes, and side effects (e.g., database changes).

- **Models (in `api/models.py`):**
  - `Score.primary_score` (property), `Score.save`, `Challenge.participant_count` (property), `Challenge.save`
  - *How to test:* Create model instances, call methods/properties, and assert expected values or database state.

- **Serializers (in `api/serializers.py`):**
  - `ScoreSerializer.validate`
  - *How to test:* Instantiate the serializer with various data, call `.is_valid()`, and check for correct validation behavior.

- **Forms (in `api/forms.py`):**
  - `ChallengeForm`, `ScoreForm`
  - *How to test:* Instantiate forms with valid/invalid data and check `.is_valid()` and error messages.

- **User API Views (in `user_api/views.py`):**
  - `UserRegister.post`, `UserLogin.post`, `UserLogout.post`, `UserView.get`
  - *How to test:* Use `APITestCase` to simulate user registration, login, logout, and profile retrieval.

- **User API Serializers (in `user_api/serializers.py`):**
  - `UserRegisterSerializer.validate`, `UserRegisterSerializer.create`, `UserLoginSerializer.check_user`
  - *How to test:* Similar to above, test with valid/invalid data and check for correct user creation/authentication.

---

## Worker (Python)

**Location:** `worker/`

### Key Functions and Utilities to Test

- **EMD and IMA Scripts:**
  - `create_cost_matrix`, `sum_to_1`, `continuous_emd` (in `emd.py`)
  - `importance_mass_accuracy` (in `ima.py`)
  - *How to test:* Use `unittest` to check output shapes, normalization, and correctness for known inputs.

- **Utility Functions:**
  - `precision` (in `precision.py`)
  - *How to test:* Provide small arrays and check that the precision score matches expectations.

- **Upload Methods:**
  - `XAI_Method`, `apply_gradient_shap`, `apply_lime` (in `upload.py`)
  - *How to test:* Use dummy tensors and models to check that the output has the expected shape/type.

- **Training Functions:**
  - `train` (in `training/train_models.py` and `train_models_clean.py`)
  - *How to test:* Use small mock datasets and configs to check that training runs without error and produces expected outputs.

- **Model Classes:**
  - `CNN`, `LLR`, `MLP`, etc. (in `training/models.py`)
  - *How to test:* Instantiate models, run a forward pass with dummy data, and check output shape.

---

## Frontend (React/Next.js)

**Location:** `platform/frontend/app/components/` and `platform/frontend/app/utils/`

### Key Components and Utilities to Test

- **React Components:**
  - `FileUpload`, `SubmissionUpload`, `UploadSection`, `Header`, `Footer`, `Leaderboard`, `SingleCompetition`, `TemporaryDrawer`, `CookieConsent`, etc.
  - *How to test:* Use Jest and React Testing Library to render components, simulate user interactions (click, drag-and-drop, etc.), and check for correct rendering and callback calls.

- **Context and Hooks:**
  - `UserContext` (`useUser`, `useClient`, `useUserUpdate`), `SessionContext`
  - *How to test:* Render components within the context provider and check that context values and updates work as expected.

- **Utility Functions:**
  - `Storage` class (in `utils/storage.ts`): `setCookie`, `getCookie`, `setLocalStorage`, etc.
  - `fetcher` (in `utils.ts`)
  - *How to test:* Mock browser APIs (Cookies, localStorage, sessionStorage) and check that methods behave as expected.

---

## General Tips
- **Write at least one test for each method or component that is actually used in the app.**
- **Use mocks and fixtures to isolate units of code and avoid side effects.**
- **Run tests regularly, especially before merging or deploying changes.**
- **Keep tests up to date as you add new features or refactor code.**

---

*Happy testing!* 