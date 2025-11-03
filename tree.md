Chuẩn luôn 😎 — dưới đây là version **rút gọn gọn gàng, readable cho README**, có kèm **note tiếng Anh rõ ràng** (để dev khác đọc hiểu ngay cấu trúc BE project NestJS này):

---

```bash
# Backend Project Structure

.
├── addons/                 # MongoDB initialization scripts
│   └── init-mongo.js
│
├── dist/                   # Compiled JS output from TypeScript (auto-generated)
│   └── ...                 # (Ignored from documentation)
│
├── docs/
│   └── entity.md           # Database entity documentation
│
├── src/                    # Main source code
│   ├── app/                # Root app module and service
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── app.base.controller.ts
│   │   └── app.constant.ts
│   │
│   ├── common/             # Shared utilities and decorators
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── enums/
│   │   │   ├── role.enum.ts
│   │   │   └── status.enum.ts
│   │   └── guard/
│   │       └── jwt-auth.guard.ts
│   │
│   ├── configs/            # App & database configuration
│   │   ├── app.ts
│   │   ├── Database.ts
│   │   └── index.ts
│   │
│   ├── database/           # Database module & collections
│   │   ├── collections.ts
│   │   └── database.module.ts
│   │
│   ├── entities/           # MongoDB schemas / entities
│   │   ├── base.entity.ts
│   │   ├── user.entity.ts
│   │   ├── client.entity.ts
│   │   ├── freelance.entity.ts
│   │   ├── project.entity.ts
│   │   ├── payment.entity.ts
│   │   └── message.entity.ts
│   │
│   ├── modules/            # Core business logic modules
│   │   ├── auth/           # Authentication & authorization
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.public.controller.ts
│   │   │   ├── strategies/ # JWT, Secret strategies
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── secret.strategy.ts
│   │   │   └── dtos/       # Login & register payloads
│   │   │       ├── log-in.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── user/           # User management module
│   │   │   ├── user.module.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.controller.ts
│   │   │   └── dto/
│   │   │       ├── update-password.dto.ts
│   │   │       └── verify-code.dto.ts
│   │   │
│   │   ├── client/         # Client-side data and API
│   │   ├── freelance/      # Freelancer management
│   │   ├── project/        # Project CRUD + mapping + responses
│   │   └── payment/        # Payment service via Paddle
│   │
│   ├── middlewares/        # Global app middlewares
│   │   ├── cors.middleware.ts
│   │   ├── jwt-cookie.middleware.ts
│   │   └── rate-limiter.middleware.ts
│   │
│   ├── helpers/            # Small helper functions
│   │   └── helper.ts
│   │
│   ├── utils/              # Utilities like cache/time
│   │   ├── cache-key.util.ts
│   │   └── time.ts
│   │
│   ├── types/              # Custom TypeScript declarations
│   │   └── express.d.ts
│   │
│   └── main.ts             # Main entry point
│
├── docker-compose.yml      # Run MongoDB + App containers
├── Dockerfile              # Backend Docker setup
├── tree.md                 # Directory structure reference
├── package.json
├── yarn.lock
├── tsconfig.json
└── README.md
```

---

### 🧠 Notes

* **`src/modules`**: Each folder is a NestJS feature module (auth, user, project...).
* **`entities/`**: Defines MongoDB document schemas for Mongoose.
* **`configs/`**: Contains app, DB, and slugify configurations.
* **`middlewares/`**: Custom global middlewares for JWT cookie, CORS, and rate-limiting.
* **`dist/`**: Built files after compilation (`yarn build`) — **ignored in version control**.
* **`addons/init-mongo.js`**: Preloads database collections or test data for Docker.
* **`docker-compose.yml`**: Launches app + MongoDB automatically for local testing.

---

Muốn mình viết luôn phần **README.md** cho backend với intro, setup (yarn/docker), và test login info (`admin / Admin123`) giống frontend luôn không?
Mình sẽ làm format đẹp, chuyên nghiệp để dán thẳng vào GitHub repo.
