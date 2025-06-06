# evalXAI: Project Overview

## 1. Platform (`platform/`)

### Backend (Django + DRF)
- **api app**  
  - Challenge and Score models (file-backed via `FileField`)
  - Endpoints for:
    - Creating/listing challenges
    - Uploading XAI scripts
    - Downloading datasets and ML model files
    - Fetching/updating scores
  - Spawns a Docker “worker” container on each submission to execute the XAI method and parse the final score.

- **user_api app**
  - Handles session-based register/login/logout/user endpoints.

- **Settings**
  - Local file storage
  - CORS configured from `localhost:3000`
  - PostgreSQL via environment variables
  - Basic Django HTML form for challenge creation

### Frontend (Next.js + Tailwind)
- Uses the `app/` directory
- Routes include:
  - Competition listing and creation
  - Solution upload
  - Dataset and profile views
  - Leaderboard
  - User authentication
- Uses React Context for session management
- File upload components
- Dynamic routing per challenge

## 2. Worker (`worker/`)
- Python-based Docker service
- Loads PyTorch models from `hubconf.py`
- Loads test/train data (pickled tensors, GT masks)
- Executes Captum-based XAI methods (LRP, IG, SHAP, etc.)
- Computes EMD-based score using `emd.py` / `continuous_emd`
- Includes a training pipeline (`training/…`) for model re-training
- Small test suite under `worker/tests/`

## 3. Documentation (`documentation/`)
- Markdown files: `backend.md`, `frontend.md`, `worker.md`
- Project journal (PDF)
- Mostly mirrors individual component READMEs