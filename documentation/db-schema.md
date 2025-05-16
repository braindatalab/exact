# Exact Application – Database Schema (PostgreSQL)

*Last updated: 2025‑05‑16*

## How to use this document

This markdown file is meant to be **self‑contained**: copy it into the repo (e.g. `docs/db-schema.md`) and keep it up to date whenever the models or migrations change. Each table section lists its columns, constraints, indexes and foreign‑key relationships. All metadata was captured via `psql \d+ <table>` on 2025‑05‑16.


## File uploads & storage

In **Exact** no binary payloads (datasets, model artifacts, result bundles, etc.) are kept inside PostgreSQL. When a user uploads a file through the web UI or REST API the backend saves that file to the **media volume** mounted into the `backend` container (see `docker-compose.yaml`). The database then stores **only a reference** – usually the relative path or an S3/MinIO URL – inside character‑varying columns such as `mlmodel`, `dataset`, or any future FileField.

## Table overview

| #  | Table name                        | Brief purpose                             |
| -- | --------------------------------- | ----------------------------------------- |
| 1  | **api\_challenge**                | Meta‑data for each coding challenge       |
| 2  | **api\_score**                    | Submitted scores/results for challenges   |
| 3  | **auth\_group**                   | Django built‑in RBAC groups               |
| 4  | **auth\_group\_permissions**      | Many‑to‑many join for group←→permission   |
| 5  | **auth\_permission**              | Canonical list of Django permissions      |
| 6  | **auth\_user**                    | User accounts                             |
| 7  | **auth\_user\_groups**            | Join table: user←→group                   |
| 8  | **auth\_user\_user\_permissions** | Join table: user←→permission              |
| 9  | **django\_admin\_log**            | Admin‑site audit log                      |
| 10 | **django\_content\_type**         | Content‑type registry (generic relations) |
| 11 | **django\_migrations**            | Applied migration records                 |
| 12 | **django\_session**               | Session store                             |

---

## Detailed schema

### 1. api\_challenge

| Column        | Data type    | Constraints                                             | Notes                     |
| ------------- | ------------ | ------------------------------------------------------- | ------------------------- |
| id            | bigint       | PK; not null; default `nextval('api_challenge_id_seq')` | surrogate key             |
| challenge\_id | varchar(100) | UNIQUE; not null                                        | business identifier       |
| title         | varchar(100) | not null                                                |                           |
| description   | text         | not null                                                |                           |
| created\_at   | timestamptz  | not null                                                | record creation timestamp |
| mlmodel       | varchar(100) | not null                                                | model identifier          |
| dataset       | varchar(100) | not null                                                |                           |
| xaimethod     | varchar(100) | not null                                                |                           |

**Indexes**

* `api_challenge_pkey` — primary key (`id`)
* `api_challenge_challenge_id_key` — unique (`challenge_id`)
* `api_challenge_challenge_id_a0909479_like` — pattern‑ops helper on `challenge_id`

**Foreign keys** – *none*

---

### 2. api\_score

| Column        | Data type        | Constraints                                         | Notes                                                    |
| ------------- | ---------------- | --------------------------------------------------- | -------------------------------------------------------- |
| id            | bigint           | PK; not null; default `nextval('api_score_id_seq')` |                                                          |
| username      | varchar(150)     | not null                                            | submitter                                                |
| challenge\_id | varchar(100)     | not null                                            | relates to `api_challenge.challenge_id` |
| score         | double precision | not null                                            | higher = better                                          |
| created\_at   | timestamptz      | not null                                            | submission time                                          |

**Indexes**

* `api_score_pkey` — primary key (`id`)

**Foreign keys** – *none defined* (application‑level link via `challenge_id`)

---

### 3. auth\_group

| Column | Data type    | Constraints                                          | Notes      |
| ------ | ------------ | ---------------------------------------------------- | ---------- |
| id     | integer      | PK; not null; default `nextval('auth_group_id_seq')` |            |
| name   | varchar(150) | UNIQUE; not null                                     | group name |

**Indexes**

* `auth_group_pkey` — primary key (`id`)
* `auth_group_name_key` — unique (`name`)
* `auth_group_name_a6ea08ec_like` — pattern‑ops helper on `name`

**Foreign keys** – *none*

---

### 4. auth\_group\_permissions

| Column         | Data type | Constraints                                                      | Notes |
| -------------- | --------- | ---------------------------------------------------------------- | ----- |
| id             | integer   | PK; not null; default `nextval('auth_group_permissions_id_seq')` |       |
| group\_id      | integer   | FK → `auth_group.id`; not null                                   |       |
| permission\_id | integer   | FK → `auth_permission.id`; not null                              |       |

**Indexes**

* `auth_group_permissions_pkey` — primary key (`id`)
* `auth_group_permissions_group_id_b120cbf9` — btree (`group_id`)
* `auth_group_permissions_permission_id_84c5c92e` — btree (`permission_id`)
* `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` — unique (`group_id`, `permission_id`)

**Foreign keys**

* `group_id` → `auth_group.id`
* `permission_id` → `auth_permission.id`

---

### 5. auth\_permission

| Column            | Data type    | Constraints                                               | Notes                          |
| ----------------- | ------------ | --------------------------------------------------------- | ------------------------------ |
| id                | integer      | PK; not null; default `nextval('auth_permission_id_seq')` |                                |
| name              | varchar(255) | not null                                                  | human‑readable label           |
| content\_type\_id | integer      | FK → `django_content_type.id`; not null                   | model that owns the permission |
| codename          | varchar(100) | UNIQUE per content type; not null                         | machine code                   |

**Indexes**

* `auth_permission_pkey` — primary key (`id`)
* `auth_permission_content_type_id_2f476e4b` — btree (`content_type_id`)
* `auth_permission_content_type_id_codename_01ab375a_uniq` — unique (`content_type_id`, `codename`)

**Foreign keys**

* `content_type_id` → `django_content_type.id`

---

### 6. auth\_user

| Column        | Data type    | Constraints                                         | Notes              |
| ------------- | ------------ | --------------------------------------------------- | ------------------ |
| id            | integer      | PK; not null; default `nextval('auth_user_id_seq')` |                    |
| password      | varchar(128) | not null                                            | hashed password    |
| last\_login   | timestamptz  | nullable                                            |                    |
| is\_superuser | boolean      | not null                                            | admin flag         |
| username      | varchar(150) | UNIQUE; not null                                    | login name         |
| first\_name   | varchar(150) | not null                                            |                    |
| last\_name    | varchar(150) | not null                                            |                    |
| email         | varchar(254) | not null                                            |                    |
| is\_staff     | boolean      | not null                                            | can log into admin |
| is\_active    | boolean      | not null                                            | account enabled    |
| date\_joined  | timestamptz  | not null                                            |                    |

**Indexes**

* `auth_user_pkey` — primary key (`id`)
* `auth_user_username_key` — unique (`username`)
* `auth_user_username_6821ab7c_like` — pattern‑ops helper on `username`

**Foreign keys** – *none*

---

### 7. auth\_user\_groups

| Column    | Data type | Constraints                                                | Notes |
| --------- | --------- | ---------------------------------------------------------- | ----- |
| id        | integer   | PK; not null; default `nextval('auth_user_groups_id_seq')` |       |
| user\_id  | integer   | FK → `auth_user.id`; not null                              |       |
| group\_id | integer   | FK → `auth_group.id`; not null                             |       |

**Indexes**

* `auth_user_groups_pkey` — primary key (`id`)
* `auth_user_groups_user_id_6a12ed8b` — btree (`user_id`)
* `auth_user_groups_group_id_97559544` — btree (`group_id`)
* `auth_user_groups_user_id_group_id_94350c0c_uniq` — unique (`user_id`, `group_id`)

**Foreign keys**

* `user_id` → `auth_user.id`
* `group_id` → `auth_group.id`

---

### 8. auth\_user\_user\_permissions

| Column         | Data type | Constraints                                                          | Notes |
| -------------- | --------- | -------------------------------------------------------------------- | ----- |
| id             | integer   | PK; not null; default `nextval('auth_user_user_permissions_id_seq')` |       |
| user\_id       | integer   | FK → `auth_user.id`; not null                                        |       |
| permission\_id | integer   | FK → `auth_permission.id`; not null                                  |       |

**Indexes**

* `auth_user_user_permissions_pkey` — primary key (`id`)
* `auth_user_user_permissions_user_id_a95ead1b` — btree (`user_id`)
* `auth_user_user_permissions_permission_id_1fbb5f2c` — btree (`permission_id`)
* `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` — unique (`user_id`, `permission_id`)

**Foreign keys**

* `user_id` → `auth_user.id`
* `permission_id` → `auth_permission.id`

---

### 9. django\_admin\_log

| Column            | Data type    | Constraints                                                | Notes                             |
| ----------------- | ------------ | ---------------------------------------------------------- | --------------------------------- |
| id                | integer      | PK; not null; default `nextval('django_admin_log_id_seq')` |                                   |
| action\_time      | timestamptz  | not null                                                   |                                   |
| object\_id        | text         | nullable                                                   | primary key value of affected row |
| object\_repr      | varchar(200) | not null                                                   | human description                 |
| action\_flag      | smallint     | not null                                                   | 1 = add, 2 = change, 3 = delete   |
| change\_message   | text         | not null                                                   | JSON list of changes              |
| content\_type\_id | integer      | FK → `django_content_type.id`; nullable                    | model type                        |
| user\_id          | integer      | FK → `auth_user.id`; not null                              | who did the action                |

**Indexes**

* `django_admin_log_pkey` — primary key (`id`)
* `django_admin_log_content_type_id_c4bce8eb` — btree (`content_type_id`)
* `django_admin_log_user_id_c564eba6` — btree (`user_id`)

**Foreign keys**

* `content_type_id` → `django_content_type.id`
* `user_id` → `auth_user.id`

**Check constraints**

* `django_admin_log_action_flag_check` — ensures `action_flag >= 0`

---

### 10. django\_content\_type

| Column     | Data type    | Constraints                                                   | Notes      |
| ---------- | ------------ | ------------------------------------------------------------- | ---------- |
| id         | integer      | PK; not null; default `nextval('django_content_type_id_seq')` |            |
| app\_label | varchar(100) | not null                                                      | Django app |
| model      | varchar(100) | not null                                                      | model name |

**Indexes**

* `django_content_type_pkey` — primary key (`id`)
* `django_content_type_app_label_model_76bd3d3b_uniq` — unique (`app_label`, `model`)

**Foreign keys** – *none*

---

### 11. django\_migrations

| Column | Data type    | Constraints                                                 | Notes      |
| ------ | ------------ | ----------------------------------------------------------- | ---------- |
| id     | integer      | PK; not null; default `nextval('django_migrations_id_seq')` |            |
| app    | varchar(255) | not null                                                    | Django app |
| name   | varchar(255  |                                                             |            |
