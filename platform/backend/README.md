<style>
  h2 {
    font-weight: 100; /* Adjust the value to achieve the desired level of lightness */
  }
</style>

# Backend

- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [XAI Detail](#xai-detail)
  - [Score Detail](#score-detail)
  - [Dataset Detail](#dataset-detail)
  - [AI Detail](#ai-detail)
  - [XAI Template](#xai-template)
- [Data Model](#data-model)
  - [XAI Method Model](#xai-method-model)
  - [Score Model](#score-model)
  - [Dataset Model](#dataset-model)
  - [ML Model](#ml-model)

<h2>Requirements</h2>

- Django==3.2.23 
- asgiref==3.7.2
- sqlparse==0.4.4
- psycopg2-binary==2.9.9
- djangorestframework==3.14.0
- docker==6.1.3

## Project Structure
│ `Dockerfile`
│ `manage.py`
│ `requirements.txt`
│ `__init__.py`
│
│ **``api``**
│ │ `__init__.py`
│ │ `apps.py`
│ │ `models.py`
│ │ `serializers.py`
│ │ `tests.py`
│ │ `views.py`
│ │ `worker_utils.py`
│ │
│ │ **``migrations``**
│ │ │ `0001_initial.py`
│ │ │ `__init__.py`
│  
│ **``backend``**
│
│ **``dataset``**
│ │ `train_data.pt`
│
│ **``ml_model``**
│ │ `linear_1d1p_0.18_uncorrelated_LLR_1_0.pt`
│
│ **``mysite``**
│ │ `settings.py`
│ │ `urls.py`
│ │ `wsgi.py`
│ │ `init.py`
│
│ **``template``**
│ │ `xai_template.py`

## *API Endpoints*

### *Score Detail*

- **URL** `/api/score/<int:challenge_id>/`
- **Methods** GET, POST
- **Description** Endpoint to retrieve or update scores for a challenge.
- **Parameters**
  - `challenge_id`: Number
- **Response** 
  - GET:
    - `score`: Number
  - POST:
    - Newly create or update score

### *XAI Detail*

- **URL** `/api/xai/<int:challenge_id>/`
- **Method** POST
- **Description** 
  - Endpoint to for XAI script upload
  - Endpoint triggers creation of a worker (runs and evaluates xai method) container 
- **Parameters**
  - `challenge_id`: Number

### *Dataset Detail*

- **URL** `/api/dataset/<int:challenge_id>/`
- **Method** GET
- **Description** Endpoint to download dataset associated with a challenge
- **Parameters**
  - `challenge_id`: Number
- **Response** 
  - Dataset file in binary format

### *AI Detail*

- **URL** `/api/mlmodel/<int:challenge_id>/`
- **Method** GET
- **Description** Endpoint to download trained machine learning model associated with a challenge
- **Parameters**
  - `challenge_id`: Number
- **Response** 
  - Trained machine learning model file in binary format

### *XAI Template*

- **URL** `/api/xai_template/<int:challenge_id>/`
- **Method** GET
- **Description** Endpoint to download XAI template file associated with a challenge.
- **Parameters**
  - `challenge_id`: Number
- **Response** 
  - XAI template file in binary format

