# Todo 待辦事項管理系統

這是一個使用 Node.js、Express、Knex 和 Objection.js 建立的 RESTful API 專案，用於管理待辦事項（Todo）。專案同時支援 Docker 部署，方便在各種環境中運行。

## 技術特點

- **認證系統**： `argon2` 進行密碼加密，`jsonwebtoken` 處理用戶認證
- **資料庫**：使用 PostgreSQL 作為資料庫系統
- **ORM 及查詢構建器**：採用 `knex.js` 查詢構建器和 `objection.js` ORM 進行資料操作
- **環境配置**：使用 `dotenv` 管理環境變數
- **容器化**：支援 Docker 和 Docker Compose 進行容器化部署
- **自動化遷移**：系統啟動時自動檢查並執行資料庫遷移

## 環境要求

- Node.js 20+
- PostgreSQL 14+
- 或者 Docker 和 Docker Compose（推薦）

## 安裝與運行

### 使用 Docker（推薦）

1. 克隆專案：
   ```
   git clone <專案 URL>
   cd knex_objection_todolist
   ```

2. 建立 `.env` 檔案（參考下方環境變數部分）

3. 使用 Docker Compose 啟動：
   ```
   docker-compose up -d
   ```
   系統會自動安裝依賴、連接資料庫並執行遷移

### 不使用 Docker

1. 克隆專案：
   ```
   git clone <專案 URL>
   cd knex_objection_todolist
   ```

2. 安裝 pnpm 和相依套件：
   ```
   npm install -g pnpm
   pnpm install
   ```

3. 建立 `.env` 檔案（參考下方環境變數部分）

4. 運行資料庫遷移：
   ```
   pnpm run migrate:latest
   ```

5. 啟動應用程式：
   - 開發模式：`pnpm run dev`
   - 生產模式：`pnpm start`

## Database migration command

- 執行最新遷移：`pnpm run migrate:latest`
- 回滾遷移：`pnpm run migrate:rollback`
- 查看遷移狀態：`pnpm run migrate:status`

## 環境變數

建立一個 `.env` 檔案，包含以下變數：

```
# 應用設定
JWT_SECRET=your_jwt_secret

# 資料庫設定
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=tododb
POSTGRES_HOST=db       # 若使用 Docker，使用 db；本機開發使用 localhost
POSTGRES_PORT=5432
```

## 主要依賴

- **express**: Web 應用框架
- **knex**: SQL 查詢構建器
- **objection**: 基於 knex 的 ORM
- **pg**: PostgreSQL 資料庫驅動
- **jsonwebtoken**: JWT 認證
- **argon2**: 密碼加密
- **dotenv**: 環境變數管理

## Docker 相關資訊

本專案包含完整的 Docker 設定，包括：

- **Dockerfile**: 用於建構開發環境應用容器
- **Dockerfile.prod**: 用於建構生產環境應用容器
- **docker-compose.yml**: 用於協調開發環境的應用和資料庫容器
- **docker-compose.prod.yml**: 用於協調生產環境的應用和資料庫容器
- **docker-entrypoint.sh**: 容器啟動腳本，處理資料庫遷移

啟動容器後，應用將在 `http://localhost:3000` 可用，資料庫將自動建立並遷移。

## Model

專案包含兩個主要的 Model：

- **User**: User Model，包含 id、username、password 欄位
- **Todo**: Todo Model，包含 id、title、completed、user_id 欄位以及與 User 的關聯

## API Route

### Authentication route `/auth`
- `POST /auth/register`: 註冊新用戶
- `POST /auth/login`: 用戶登入

### Todo Route `/todos` (需要認證)
- `GET /todos`: 獲取當前用戶的所有待辦事項
- `POST /todos`: 建立新的待辦事項
- `PUT /todos/:id`: 更新指定的待辦事項
- `DELETE /todos/:id`: 刪除指定的待辦事項

### 系統端點
- `GET /health`: 健康檢測 Route
