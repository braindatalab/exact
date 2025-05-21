# evalXAI – Getting Started Guide

## 1. Prerequisites

- Docker (with Compose v2)
- ~10 GB free disk space

---

## 2. Clone & Configure

```bash
git clone <this-repo-url>
cd evalXai
```

Ensure you have:

- `.env` in the repo root with your Postgres settings
- `db/password.txt` containing the same password as in `.env`

---

## 3. Build & Start All Services

```bash
docker compose build
docker compose up -d
```

This will spin up:

- `db` (PostgreSQL)
- `backend` (Django + DRF on port 8000)
- `frontend` (Next.js on port 3000)
- `worker` image (used on-demand by the backend)

---

## 4. Initialize the Database

Wait ~30 s for Postgres and Django to come up, then:

```bash
docker ps  # to find your backend container
docker exec -it exact-backend-1 python manage.py makemigrations
docker exec -it exact-backend-1 python manage.py migrate
```

(Optional) Create a Django superuser:

```bash
docker exec -it exact-backend-1 python manage.py createsuperuser
```

---

## 5. Verify the UI & Admin

- Frontend: http://localhost:3000  
- Admin Panel: http://localhost:8000/admin  
- Log in using your superuser account

---

## Basic API Smoke Tests

Use `curl`, Postman, or [httpie](https://httpie.io/) (`pip install httpie`):

### 1. List all challenges

```bash
curl http://localhost:8000/api/challenges/
```

### 2. Create a new challenge

```bash
curl -v -X POST http://localhost:8000/api/challenge/create/ \
  -F title="My Test" \
  -F description="Demo challenge" \
  -F xai_method=@worker/upload.py \
  -F dataset=@platform/backend/dataset/train_data.pt \
  -F mlmodel=@platform/backend/ml_model/linear_1d1p_0.18_uncorrelated_LLR_1_0.pt
```

### 3. Get the challenge ID

```bash
curl http://localhost:8000/api/challenges/ | jq .
```

### 4. Download dataset & model

```bash
curl -OJ http://localhost:8000/api/dataset/<challenge_id>/
curl -OJ http://localhost:8000/api/mlmodel/<challenge_id>/
```

### 5. Submit an XAI method

```bash
echo "def XAI_Method(data, target, model): return data*0" > dummy_xai.py

curl -v -X POST http://localhost:8000/api/xai/<challenge_id>/ \
  -F username="alice" \
  -F file=@dummy_xai.py
```

### 6. Retrieve the score

```bash
curl http://localhost:8000/api/score/<challenge_id>/
```

### 7. Test user registration & login

```bash
http POST http://localhost:8000/register username=bob email=bob@example.com password=secret
http POST http://localhost:8000/login username=bob password=secret
http GET http://localhost:8000/user
```

---

## Running the Worker's Unit Tests Locally

(Requires Python ≥3.10 and a virtualenv)

```bash
cd worker
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install pytest
pytest tests/
```

This will test:

- Model loading via `hubconf.py`
- EMD score routines (`emd.py`) on known mask data

---

## If All Pass, Then:

✅ Database is working  
✅ Django APIs function  
✅ Frontend renders content  
✅ Worker runs models + scores  
✅ End-to-end method upload + scoring works

---

Happy hacking! 🚀