# Todo 待辦事項管理系統

一個功能完整的全端待辦事項管理系統，採用現代化的技術堆疊構建，支援 RESTful API 和 GraphQL 雙重介面。

## ✨ 專案特色

### 🔧 技術堆疊
- **後端框架**：Express.js
- **資料庫**：PostgreSQL 14+
- **ORM 及查詢建構器**：Knex.js + Objection.js
- **認證系統**：JWT + Argon2 密碼加密
- **API 介面**：RESTful API + GraphQL
- **容器化**：Docker + Docker Compose
- **套件管理**：pnpm

### 🚀 核心功能
- ✅ 用戶註冊與登入認證
- ✅ 待辦事項 CRUD 操作
- ✅ RESTful API 和 GraphQL 雙重支援
- ✅ JWT 權杖認證
- ✅ 密碼安全加密（Argon2）
- ✅ 自動資料庫遷移
- ✅ Docker 容器化部署
- ✅ 健康檢測端點

## 📋 環境需求

- Node.js 20+
- PostgreSQL 14+
- Docker & Docker Compose（推薦）

## 🚀 快速開始

### 方法一：使用 Docker（推薦）

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd knex_objection_todolist
   ```

2. **設定環境變數**
   ```bash
   cp .env.example .env
   # 編輯 .env 檔案，設定您的環境變數
   ```

3. **啟動服務**
   ```bash
   # 開發環境
   docker-compose up -d
   
   # 生產環境
   docker-compose -f docker-compose.prod.yml up -d
   ```

 4. **確認服務啟動**
    - RESTful API：http://localhost:3000
    - GraphQL Playground：http://localhost:3000/graphql
    - 健康檢測：http://localhost:3000/health

### 方法二：本機開發

1. **複製專案並安裝相依套件**
   ```bash
   git clone <repository-url>
   cd knex_objection_todolist
   npm install -g pnpm
   pnpm install
   ```

2. **設定環境變數**
   ```bash
   cp .env.example .env
   # 編輯 .env 檔案
   ```

3. **執行資料庫遷移**
   ```bash
   pnpm run migrate:latest
   ```

4. **啟動應用程式**
   ```bash
   # 開發模式（支援熱重載）
   pnpm run dev
   
   # 生產模式
   pnpm start
   
       # 啟動開發模式（包含 RESTful API 和 GraphQL）
    pnpm run dev
   ```

## ⚙️ 環境變數設定

建立 `.env` 檔案並設定以下變數：

```env
# 📡 資料庫連線設定
DATABASE_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5432/<POSTGRES_DB>
POSTGRES_USER=todouser
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=todolist_db

# 🔐 JWT 認證設定
JWT_SECRET=your_super_secret_jwt_key_here

# 📊 應用程式設定
LOG_LEVEL=info
NODE_ENV=development

# 🌐 伺服器設定
PORT=3000
```

### 環境變數說明

| 變數                | 說明                             | 預設值        |
| ------------------- | -------------------------------- | ------------- |
| `DATABASE_URL`      | PostgreSQL 完整連線字串          | -             |
| `POSTGRES_USER`     | 資料庫使用者名稱                 | -             |
| `POSTGRES_PASSWORD` | 資料庫密碼                       | -             |
| `POSTGRES_DB`       | 資料庫名稱                       | -             |
| `JWT_SECRET`        | JWT 簽章密鑰                     | -             |
| `LOG_LEVEL`         | 日誌等級 (debug/info/warn/error) | `info`        |
| `NODE_ENV`          | 運行環境                         | `development` |
| `PORT`              | 應用程式埠號                     | `3000`        |

## 🗄️ 資料庫管理

### 遷移指令

```bash
# 執行最新遷移
pnpm run migrate:latest

# 回滾遷移
pnpm run migrate:rollback

# 查看遷移狀態
pnpm run migrate:status

# 建立新遷移檔案
pnpm run migrate:make <migration_name>
```

### 資料模型

#### User（用戶）
```sql
- id: 主鍵 (UUID)
- username: 用戶名稱 (唯一)
- password: 加密密碼
- created_at: 建立時間
- updated_at: 更新時間
```

#### Todo（待辦事項）
```sql
- id: 主鍵 (UUID)
- title: 待辦事項標題
- completed: 完成狀態 (boolean)
- user_id: 用戶 ID (外鍵)
- created_at: 建立時間
- updated_at: 更新時間
```

## 🔌 API 文件

### RESTful API

#### 🔐 認證端點 `/auth`

| 方法   | 端點             | 說明       | 認證需求 |
| ------ | ---------------- | ---------- | -------- |
| `POST` | `/auth/register` | 註冊新用戶 | ❌        |
| `POST` | `/auth/login`    | 用戶登入   | ❌        |

#### ✅ 待辦事項端點 `/todos`

| 方法     | 端點         | 說明                 | 認證需求 |
| -------- | ------------ | -------------------- | -------- |
| `GET`    | `/todos`     | 取得用戶所有待辦事項 | ✅        |
| `POST`   | `/todos`     | 建立新待辦事項       | ✅        |
| `PUT`    | `/todos/:id` | 更新指定待辦事項     | ✅        |
| `DELETE` | `/todos/:id` | 刪除指定待辦事項     | ✅        |

#### 🏥 系統端點

| 方法  | 端點      | 說明     | 認證需求 |
| ----- | --------- | -------- | -------- |
| `GET` | `/health` | 健康檢測 | ❌        |

### GraphQL API

GraphQL Playground 位於：`http://localhost:3000/graphql`

#### 查詢（Queries）
```graphql
# 取得所有待辦事項
query {
  todos {
    id
    title
    completed
    createdAt
    user {
      id
      username
    }
  }
}

# 取得單一待辦事項
query {
  todo(id: "todo-id") {
    id
    title
    completed
  }
}
```

#### 變更（Mutations）
```graphql
# 建立待辦事項
mutation {
  createTodo(input: {
    title: "學習 GraphQL"
  }) {
    id
    title
    completed
  }
}

# 更新待辦事項
mutation {
  updateTodo(id: "todo-id", input: {
    title: "更新的標題"
    completed: true
  }) {
    id
    title
    completed
  }
}

# 刪除待辦事項
mutation {
  deleteTodo(id: "todo-id")
}
```

## 🔒 認證機制

### JWT 權杖使用方式

在 HTTP 標頭中加入 Authorization：
```
Authorization: Bearer <your_jwt_token>
```

### GraphQL 認證

在 GraphQL 請求的 HTTP 標頭中加入：
```json
{
  "Authorization": "Bearer <your_jwt_token>"
}
```

## 🐳 Docker 部署

### 開發環境
```bash
docker-compose up -d
```

### 生產環境
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Docker 檔案說明

| 檔案                      | 說明           |
| ------------------------- | -------------- |
| `Dockerfile`              | 開發環境映像檔 |
| `Dockerfile.prod`         | 生產環境映像檔 |
| `docker-compose.yml`      | 開發環境編排   |
| `docker-compose.prod.yml` | 生產環境編排   |

## 📁 專案結構

```
knex_objection_todolist/
├── app.js                          # Express 應用程式進入點
├── controllers/                    # 控制器層
│   ├── authController.js          # 認證控制器
│   └── todoController.js          # 待辦事項控制器
├── db/migrations/                  # 資料庫遷移檔案
├── graphql/                        # GraphQL 相關檔案
│   ├── server.js                  # GraphQL 伺服器
│   ├── context.js                 # GraphQL 上下文
│   ├── resolvers/                 # GraphQL 解析器
│   └── typeDefs/                  # GraphQL 類型定義
├── middleware/                     # 中介軟體
│   ├── authMiddleware.js          # 認證中介軟體
│   └── validators.js              # 驗證中介軟體
├── models/                        # Objection.js 模型
│   ├── Todo.js                    # 待辦事項模型
│   └── User.js                    # 用戶模型
├── routes/                        # Express 路由
├── services/                      # 業務邏輯層
├── knexfile.js                    # Knex 設定檔
└── package.json                   # 專案相依套件
```

## 🛠️ 開發指令

```bash
# 安裝相依套件
pnpm install

# 開發模式（包含 RESTful API 和 GraphQL）
pnpm run dev

# 生產模式
pnpm start

# 資料庫遷移
pnpm run migrate:latest
pnpm run migrate:rollback
pnpm run migrate:status

# Docker 相關
docker-compose up -d              # 啟動開發環境
docker-compose down               # 停止開發環境
docker-compose logs -f            # 查看日誌
```

## 🧪 測試

```bash
# 運行測試（如果有的話）
pnpm test

# 健康檢測
curl http://localhost:3000/health
```

## 📝 API 請求範例

### 註冊用戶
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### 用戶登入
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### 建立待辦事項
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"title": "學習 Node.js"}'
```
