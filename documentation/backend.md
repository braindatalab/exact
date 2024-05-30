# Backend Docs

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

## Requirements

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

### *XAI Detail*

- **URL** `api/xai/<str:challenge_id>/`
- **Method** POST
- **Description** 
  - Endpoint to for XAI script upload
  - Endpoint triggers creation of a worker (runs and evaluates xai method) container 
- **Parameters**
  - `challenge_id`: String


### *Score Detail*

- **URL** `/api/score/<str:challenge_id>/`
- **Methods** GET, POST
- **Description** Endpoint to retrieve or update scores for a challenge.
- **Parameters**
  - `challenge_id`: String
- **Response** 
  - GET:
    - `score`: Number
  - POST:
    - Newly create or update score

### *Dataset Detail*

- **URL** `/api/dataset/<str:challenge_id>/`
- **Method** GET
- **Description** Endpoint to download dataset associated with a challenge. Redirects to the url containing the file. 
- **Parameters**
  - `challenge_id`: String
- **Response** 
  - Location: The URL of the dataset file associated with the challenge ID.

### *ML Model Detail*

- **URL** `/api/mlmodel/<str:challenge_id>/`
- **Method** GET
- **Description** Endpoint to download trained machine learning model associated with a challenge. Redirects to the url containing the file. 
- **Parameters**
  - `challenge_id`: String
- **Response** 
  - Location: The URL of the Mlmodel file associated with the challenge ID.

### *XAI Template*

- **URL** `/api/xaimethod/<str:challenge_id>/`
- **Method** GET
- **Description** Endpoint to download XAI Method file associated with a challenge. Redirects to the url containing the file. 
- **Parameters**
  - `challenge_id`: String
- **Response** 
  - Location: The URL of the XAI Method template file associated with the challenge ID.

## Create Challenge

- **URL:** `/api/challenge/create/`
- **Method:** POST
- **Description:** Endpoint for creating a new challenge. It takes a title, description and 3 files - xai method template, dataset and a machine learning model. The uploaded files are saved to Amazon S3 and their URLs are stored in the Postgresql database, where the challenge_id connects all the tables. 
- **Parameters:**
  - `title`: String (required) - The title of the challenge.
  - `description`: String (required) - Description of the challenge.
  - `xai_method`: File (required) - File containing the XAI method.
  - `dataset`: File (required) - File containing the dataset.
  - `mlmodel`: File (required) - File containing the ML model.
- **Response:**
  - Success (201): `{ "message": "Challenge created successfully" }`
  - Error (400): `{ "errors": { "<field_name>": ["<error_message>"] } }`
- **Sample Request:**
  ```json
  {
    "title": "Challenge Title",
    "description": "Description of the challenge",
    "xai_method": <XAI_Method_File>,
    "dataset": <Dataset_File>,
    "mlmodel": <ML_Model_File>
  }

**Notes:**
  - CSRF protection is temporarily disabled for testing.

## Challenge Creation Form View

- **URL:** `/challenge/form`
- **Method:** POST
- **Description:** Endpoint for submitting a challenge form. It does the same thing as /api/challenge/create/ but provides a visual interface in the backend for sending the POST request. It takes a title, description and 3 files - xai method template, dataset and machine learning model. The uploaded files are saved to Amazon S3 and their URLs are stored in the Postgresql database, where the challenge_id connects all the tables. 
- **Parameters:**
  - `title`: String (required) - The title of the challenge.
  - `description`: String (required) - Description of the challenge.
  - `xai_method`: File (required) - File containing the XAI method.
  - `dataset`: File (required) - File containing the dataset.
  - `mlmodel`: File (required) - File containing the ML model.
- **Response:**
  - Redirects to the success page upon successful submission.
- **Sample Request:**
  ```json
  {
    "title": "Challenge Title",
    "description": "Description of the challenge",
    "xai_method": <XAI_Method_File>,
    "dataset": <Dataset_File>,
    "mlmodel": <ML_Model_File>
  }
  ```
- **Notes:**
  - CSRF protection is temporarily disabled for testing.

## Get Challenge

- **URL:** `/challenge/<str:challenge_id>/`
- **Method:** GET
- **Description:** Endpoint for retrieving challenge details by ID of the challenge. Responds with a json with all the important information about the challenge.
- **Parameters:**
  - `challenge_id`: String (required) - ID of the challenge to retrieve.
- **Response:**
  - JSON object containing challenge details:
    - `challenge_id`: String - ID of the challenge.
    - `title`: String - Title of the challenge.
    - `description`: String - Description of the challenge.
    - `created_at`: String (DateTime) - Date and time when the challenge was created.
    - `xai_method_url`: String (Optional) - URL of the XAI method associated with the challenge.
    - `dataset_url`: String (Optional) - URL of the dataset associated with the challenge.
    - `mlmodel_url`: String (Optional) - URL of the ML model associated with the challenge.
- **Sample Response:**
  ```json
  {
    "challenge_id": "123abc",
    "title": "Challenge Title",
    "description": "Description of the challenge",
    "created_at": "2024-05-30T12:00:00Z",
    "xai_method_url": "https://example.com/xai_method",
    "dataset_url": "https://example.com/dataset",
    "mlmodel_url": "https://example.com/mlmodel"
  }
  ```
- **Notes:**
  - If the challenge with the provided ID is not found, an error message is returned.

## *Data Model*

### *XAI Method Model*
- **Description:** Model representing the XAI method associated with a challenge.
- **Fields:**
  - `challenge_id`: CharField (max_length=100, unique=True)
  - `xai_method_url`: URLField (default='')

### *Score Model*
- **Description:** Model representing the score associated with a challenge.
- **Fields:**
  - `challenge_id`: CharField (max_length=100, unique=True)
  - `score`: FloatField

### *Dataset Model*
- **Description:** Model representing the dataset associated with a challenge.
- **Fields:**
  - `challenge_id`: CharField (max_length=100, unique=True)
  - `dataset_url`: URLField (default='')

### *ML Model*
- **Description:** Model representing the machine learning model associated with a challenge.
- **Fields:**
  - `challenge_id`: CharField (max_length=100, unique=True)
  - `model_url`: URLField (default='')

### *Challenge Model*
- **Description:** Model representing a challenge.
- **Fields:**
  - `challenge_id`: CharField (max_length=100, unique=True)
  - `title`: CharField (max_length=100)
  - `description`: TextField
  - `created_at`: DateTimeField (auto_now_add=True)