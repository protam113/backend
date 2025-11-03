

## 1️⃣ `User`

| Column    | Type                                | Notes         |
| --------- | ----------------------------------- | ------------- |
| id        | string (PK, uuid)                   | primary key   |
| email     | string                              | unique        |
| password  | string                              | hashed        |
| fullName  | string                              |               |
| role      | enum('client','freelancer','admin') |               |
| createdAt | timestamp                           | default now() |
| updatedAt | timestamp                           | auto-update   |

**Relation**:

* 1 ↔ 1 `FreelancerProfile` (nếu role = freelancer)
* 1 ↔ 1 `ClientProfile` (nếu role = client)
* 1 ↔ N `Message` (sender / receiver)
* 1 ↔ N `Transaction` (payer / payee)
* 1 ↔ N `Review` (reviewer / reviewee)

---

## 2️⃣ `FreelancerProfile`

| Column          | Type                          | Notes                        |
| --------------- | ----------------------------- | ---------------------------- |
| id              | string (PK, uuid)             |                              |
| userId          | string (FK → User.id, unique) | 1-1                          |
| skills          | string[]                      | Postgres array or join table |
| hourlyRate      | numeric                       |                              |
| portfolioLinks  | string[]                      | optional                     |
| experienceLevel | enum('junior','mid','senior') |                              |
| verified        | boolean                       | default false                |

---

## 3️⃣ `ClientProfile`

| Column      | Type                          | Notes    |
| ----------- | ----------------------------- | -------- |
| id          | string (PK, uuid)             |          |
| userId      | string (FK → User.id, unique) | 1-1      |
| companyName | string                        | optional |
| industry    | string                        | optional |
| website     | string                        | optional |

---

## 4️⃣ `Project` (Job Post)

| Column         | Type                                               | Notes                        |
| -------------- | -------------------------------------------------- | ---------------------------- |
| id             | string (PK, uuid)                                  |                              |
| clientId       | string (FK → User.id)                              | must be client               |
| title          | string                                             |                              |
| description    | text                                               |                              |
| skillsRequired | string[]                                           | Postgres array or join table |
| budgetMin      | numeric                                            |                              |
| budgetMax      | numeric                                            |                              |
| status         | enum('open','in_progress','completed','cancelled') | default open                 |
| createdAt      | timestamp                                          | default now()                |
| updatedAt      | timestamp                                          | auto-update                  |

**Relation**:

* 1 ↔ N `Proposal`
* 1 ↔ N `Message` (projectId optional)
* 1 ↔ N `Transaction`
* 1 ↔ N `Review`

---

## 5️⃣ `Proposal`

| Column       | Type                                  | Notes              |
| ------------ | ------------------------------------- | ------------------ |
| id           | string (PK, uuid)                     |                    |
| projectId    | string (FK → Project.id)              |                    |
| freelancerId | string (FK → User.id)                 | must be freelancer |
| coverLetter  | text                                  |                    |
| bidAmount    | numeric                               |                    |
| status       | enum('pending','accepted','rejected') | default pending    |
| createdAt    | timestamp                             | default now()      |

---

## 6️⃣ `Message`

| Column     | Type                     | Notes         |
| ---------- | ------------------------ | ------------- |
| id         | string (PK, uuid)        |               |
| senderId   | string (FK → User.id)    |               |
| receiverId | string (FK → User.id)    |               |
| projectId  | string (FK → Project.id) | optional      |
| content    | text                     |               |
| isRead     | boolean                  | default false |
| createdAt  | timestamp                | default now() |

---

## 7️⃣ `Transaction`

| Column    | Type                                 | Notes              |
| --------- | ------------------------------------ | ------------------ |
| id        | string (PK, uuid)                    |                    |
| projectId | string (FK → Project.id)             |                    |
| payerId   | string (FK → User.id)                | usually client     |
| payeeId   | string (FK → User.id)                | usually freelancer |
| amount    | numeric                              |                    |
| status    | enum('pending','completed','failed') | default pending    |
| createdAt | timestamp                            | default now()      |

---

## 8️⃣ `Review`

| Column     | Type                     | Notes             |
| ---------- | ------------------------ | ----------------- |
| id         | string (PK, uuid)        |                   |
| projectId  | string (FK → Project.id) |                   |
| reviewerId | string (FK → User.id)    | who writes review |
| revieweeId | string (FK → User.id)    | who is reviewed   |
| comment    | text                     |                   |
| createdAt  | timestamp                | default now()     |

