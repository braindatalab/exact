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
  - [ML Model Detail](#ml-model-detail)
  - [Challenge Form View](#challenge-form-view)
  - [Success View](#success-view)
  - [Get Challenge](#get-challenge)
  - [Get Challenges](#get-challenges)
  - [Get Scores](#get-scores)


<h2>Requirements</h2>

- Django==3.2.23 
- asgiref==3.7.2
- sqlparse==0.4.4
- psycopg2-binary==2.9.9
- djangorestframework==3.14.0
- docker==6.1.3

## Backend directory tree structure (simplified)
├── Dockerfile
├── README.md
├── api
│   ├── apps.py
│   ├── forms.py
│   ├── migrations
│   ├── models.py
│   ├── serializers.py
│   ├── templates
│   │   └── api
│   │       ├── challenge_form.html
│   │       └── success.html
│   ├── tests.py
│   ├── utils
│   ├── views.py
│   └── worker_utils.py
├── dataset
├── manage.py
├── media
├── ml_model
├── mysite
│   ├── media
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── requirements.txt
├── template
└── user_api
    ├── admin.py
    ├── apps.py
    ├── migrations
    ├── models.py
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py

## *API Endpoints*


### XAI Detail

- **URL** `/api/xai/<str:challenge_id>/`
- **Methods** POST
- **Description** Endpoint to submit a XAI-method for a challenge and get an evaluation score. 
- **Parameters**
  - `challenge_id` (string): Identifier for the challenge.
  - **Request Body**:
    - `file` (file): The XAI method file to be submitted.
    - `username` (string): The username of the person submitting the file.
- **Response** 
  - **POST**:
    - **Success**:
      - `message` (string): Status message.
      - `score` (object): 
        - `score` (number): The computed score.
        - `challenge_id` (string): The challenge identifier.
        - `username` (string): The username of the person who submitted the file.

**Example Request:**

```json
POST /api/xai/challenge123/
Content-Type: multipart/form-data
{
   "file": "<XAI method file>",
   "username": "john_doe"
}
```

### Score Detail

- **URL** `/api/score/<str:challenge_id>/`
- **Methods** GET, POST
- **Description** Endpoint to retrieve or update scores for a challenge.
- **Parameters**
  - `challenge_id` (string): Identifier for the challenge.
- **Response** 
  - **GET**:
    - **Success**:
      - `score` (object): 
        - `score` (number): The score for the challenge.
        - `challenge_id` (string): The challenge identifier.
        - `username` (string): The username of the person who submitted the score.
  - **POST**:
    - **Success**:
      - `score` (object): 
        - `score` (number): The updated or newly created score.
        - `challenge_id` (string): The challenge identifier.
        - `username` (string): The username of the person who submitted the score.

**Example Request:**

```json
GET /api/score/challenge123/

POST /api/score/challenge123/
Content-Type: application/json
{
    "score": 98,
    "username": "john_doe"
}
```

### Dataset Detail

- **URL** `/api/dataset/<str:challenge_id>/`
- **Methods** GET
- **Description** Endpoint to download the dataset file associated with a specific challenge.
- **Parameters**
  - `challenge_id` (string): Identifier for the challenge.
- **Response** 
  - **GET**:
    - **Success**:
      - The dataset file will be served as an attachment.

**Example Request:**

```json
GET /api/dataset/challenge123/
```

### ML Model Detail

- **URL** `/api/mlmodel/<str:challenge_id>/`
- **Methods** GET
- **Description** Endpoint to download the ML model file associated with a specific challenge.
- **Parameters**
  - `challenge_id` (string): Identifier for the challenge.
- **Response** 
  - **GET**:
    - **Success**:
      - The ML model file will be served as an attachment.

**Example Request:**

```json
GET /api/mlmodel/challenge123/
```

### XAI Method Detail

- **URL** `/api/xaimethod/<str:challenge_id>/`
- **Methods** GET
- **Description** Endpoint to download the XAI method file associated with a specific challenge.
- **Parameters**
  - `challenge_id` (string): Identifier for the challenge.
- **Response** 
  - **GET**:
    - **Success**:
      - The XAI method file will be served as an attachment.

**Example Request:**

```json
GET /api/xaimethod/challenge123/
```

### Create Challenge

- **URL** `/api/challenge/create/`
- **Methods** POST
- **Description** Endpoint for creating a new challenge.
- **Request Body**:
  - `title` (string): Title of the challenge.
  - `description` (string): Description of the challenge.
  - `xai_method` (file): XAI method file for the challenge.
  - `dataset` (file): Dataset file for the challenge.
  - `mlmodel` (file): ML model file for the challenge.
- **Response** 
  - **POST**:
    - **Success**:
      - `message` (string): Success message.

**Example Request:**

```json
POST /api/challenge/create/
Content-Type: multipart/form-data

{
    "title": "Example Challenge",
    "description": "Description of the challenge.",
    "xai_method": "<XAI method file>",
    "dataset": "<Dataset file>",
    "mlmodel": "<ML model file>"
}
```

### Challenge Form View

- **URL** `/challenge/form`
- **Methods** POST
- **Description** Endpoint for submitting a form to create a new challenge with a UI webpage. 
- **Request Body**:
  - `title` (string): Title of the challenge.
  - `description` (string): Description of the challenge.
  - `xai_method` (file): XAI method file for the challenge.
  - `dataset` (file): Dataset file for the challenge.
  - `mlmodel` (file): ML model file for the challenge.
- **Response** 
  - **POST**:
    - **Success**:
      - Redirects to a success page upon successful creation of the challenge.

**Example Request:**

```json
POST /challenge/form
Content-Type: multipart/form-data

{
    "title": "Example Challenge",
    "description": "Description of the challenge.",
    "xai_method": "<XAI method file>",
    "dataset": "<Dataset file>",
    "mlmodel": "<ML model file>"
}
```

### Success View

- **URL** `/success/`
- **Methods** GET
- **Description** Endpoint for displaying a success page after successfully creating a challenge.

### Get Challenge

- **URL** `/api/challenge/<str:challenge_id>/`
- **Methods** GET
- **Description** Endpoint to retrieve details of a specific challenge.
- **Parameters**
  - `challenge_id` (string): Identifier for the challenge.
- **Response** 
  - **GET**:
    - **Success**:
      - Returns details of the challenge as serialized data.

**Example Request:**

```json
GET /api/challenge/challenge123/
``` 

### Get Challenges

- **URL** `/api/challenges/`
- **Methods** GET
- **Description** Endpoint to retrieve a list of all challenges.
- **Response** 
  - **GET**:
    - **Success**:
      - Returns a list of challenges as serialized data.

**Example Request:**

```json
GET /api/challenges/
``` 

### Get Scores

- **URL** `/api/scores/`
- **Methods** GET
- **Description** Endpoint to retrieve a list of all scores.
- **Response** 
  - **GET**:
    - **Success**:
      - Returns a list of scores as serialized data.

**Example Request:**

```json
GET /api/scores/
```
