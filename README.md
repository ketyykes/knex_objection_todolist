# Todo 應用程式 API

這是一個使用 Node.js 和 Express 框架構建的 RESTful API 專案，用於管理待辦事項（Todo）。專案具有以下特點：

- 認證系統：使用 `bcrypt` 進行密碼加密，`jsonwebtoken` 處理用戶認證。
- 資料庫：使用 PostgreSQL 作為資料庫，通過 `knex` 查詢構建器和 `objection.js` ORM 進行資料操作。
- 環境配置：使用 `dotenv` 管理環境變數。
- 開發工具：使用 `nodemon` 實現 Hot Reload，提高開發效率。
- 資料庫遷移：包含自定義的資料庫遷移腳本，確保資料庫結構的一致性。

## 環境要求

- Node.js
- PostgreSQL

## 安裝

1. git clone 此專案
2. npm install pnpm 
3. 運行 `pnpm install` 安裝依賴

## 使用方法

- 開發模式：`pnpm run dev`
- 生產模式：`pnpm start`
- 資料庫遷移：`pnpm run migrate`

## 資料庫設置

本專案使用 PostgreSQL 作為資料庫。請確保您已安裝並設置好 PostgreSQL。

## 環境變數

創建一個 `.env` 文件，並設置以下變數：

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
JWT_SECRET=<your_jwt_secret>
```

## 依賴

- express: Web 應用框架
- knex: SQL 查詢構建器
- objection: ORM
- jsonwebtoken: JWT 認證
- bcrypt: 密碼加密
- dotenv: 環境變數管理
