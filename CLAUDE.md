# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個功能完整的待辦事項管理系統，使用 Node.js + Express、PostgreSQL、Knex.js + Objection.js 建構，支援 RESTful API 和 GraphQL 雙重介面。

## 開發指令

### 基本指令
```bash
# 安裝相依套件
pnpm install

# 開發模式（包含熱重載）
pnpm run dev

# 生產模式
pnpm start

# 健康檢測
curl http://localhost:3000/health
```

### 資料庫遷移
```bash
# 執行最新遷移
pnpm run migrate:latest

# 回滾遷移
pnpm run migrate:rollback

# 查看遷移狀態
pnpm run migrate:status
```

### Docker 開發
```bash
# 啟動開發環境
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

## 系統架構

### 核心技術棧
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Knex.js + Objection.js
- **Authentication**: JWT + Argon2 password hashing
- **GraphQL**: Apollo Server with Express integration

### 資料庫設定
- **Configuration**: `knexfile.js` - PostgreSQL 連接設定
- **Migrations**: `db/migrations/` - 資料庫結構版本控制
- **Connection**: 使用 `DATABASE_URL` 環境變數

### 認證系統
- **JWT Secret**: 使用 `JWT_SECRET` 環境變數
- **Password Hashing**: Argon2 演算法
- **Token Verification**: `middleware/authMiddleware.js`
- **Context Injection**: GraphQL 上下文中自動注入使用者資訊

## 專案結構

### 資料模型層 (`models/`)
- **User.js**: 使用者模型，與 Todo 建立 HasMany 關聯
- **Todo.js**: 待辦事項模型，與 User 建立 BelongsToOne 關聯
- **關聯查詢**: 使用 Objection.js relationMappings 自動處理

### 服務層 (`services/`)
- **authService.js**: 認證邏輯，供 REST 和 GraphQL 共用
- **todoService.js**: 待辦事項業務邏輯，避免重複實作
- **Design Pattern**: Service layer 避免在 controllers 和 resolvers 中重複商業邏輯

### API 層

#### REST API (`routes/`, `controllers/`)
- **Auth Routes**: `/auth/register`, `/auth/login`
- **Todo Routes**: `/todos` (CRUD operations)
- **Controller Pattern**: Thin controllers 呼叫 service layer

#### GraphQL API (`graphql/`)
- **Type Definitions**: `typeDefs/` - 模組化 schema 定義
- **Resolvers**: `resolvers/` - 按功能分離的解析器
- **Server Setup**: `server.js` - Apollo Server 設定與 Express 整合
- **Context**: `context.js` - 認證與資料庫連接注入

### 中介軟體 (`middleware/`)
- **authMiddleware.js**: JWT 權杖驗證，REST API 專用
- **validators.js**: 輸入資料驗證規則

## API 端點

### REST API
- **Base URL**: `http://localhost:3000`
- **Auth**: `/auth/register`, `/auth/login`
- **Todos**: `/todos` (GET, POST, PUT, DELETE)
- **Health**: `/health`

### GraphQL API
- **Endpoint**: `http://localhost:3000/graphql`
- **Playground**: 開發環境自動啟用
- **Authentication**: HTTP header `Authorization: Bearer <token>`

## 開發注意事項

### 環境變數設定
創建 `.env` 檔案：
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=3000
```

### 資料庫初始化流程
1. 確保 PostgreSQL 服務運行
2. 建立資料庫
3. 執行 `pnpm run migrate:latest`
4. 啟動應用程式

### 雙 API 開發模式
- **REST 和 GraphQL 共存**: 兩套 API 使用相同的服務層邏輯
- **資料一致性**: 透過共享 service layer 確保操作結果一致
- **認證機制**: 兩套 API 使用相同的 JWT 驗證機制

### GraphQL 開發最佳實踐
- **Schema First**: 先定義 schema 再實作 resolvers
- **Resolver 職責**: 僅處理 GraphQL 特定邏輯，商業邏輯委託給 services
- **Error Handling**: 生產環境隱藏敏感錯誤資訊
- **Context Sharing**: 透過 context 在 resolvers 間共享認證資訊

### 測試與驗證
- **GraphQL Playground**: 用於 GraphQL API 測試
- **REST API**: 使用 curl 或 Postman 測試
- **資料一致性**: 確保 REST 和 GraphQL 操作結果相同
- **權限控制**: 驗證使用者只能存取自己的資料

## 故障排除

### 常見問題
- **GraphQL 404**: 檢查 Apollo Server 是否正確啟動
- **認證失敗**: 確認 JWT_SECRET 設定正確
- **資料庫連接**: 檢查 DATABASE_URL 和 PostgreSQL 服務狀態
- **模組載入錯誤**: 確認使用正確的 ES module import/export 語法

### 除錯資訊
- **Server Logs**: 查看 console 輸出的錯誤訊息
- **GraphQL Errors**: 開發環境會顯示完整錯誤堆疊
- **Database Status**: 使用 `/health` 端點檢查系統狀態