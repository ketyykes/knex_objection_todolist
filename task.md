# Apollo GraphQL 整合任務清單 (MVP)

## 🎯 目標
將現有的待辦事項清單專案整合 Apollo GraphQL，同時保持 REST API 不變。

## 📋 任務清單

### 階段 1: 基礎架構設定 (第 1-2 天)

#### ✅ Task 1.1: 建立 GraphQL 目錄結構
- [x] 建立 `graphql/` 目錄
- [x] 建立 `graphql/typeDefs/` 目錄  
- [x] 建立 `graphql/resolvers/` 目錄
- [x] 建立 `services/` 目錄

**完成標準**: 目錄結構建立完成 ✅

#### ✅ Task 1.2: 建立基本的 GraphQL Schema
- [x] 建立 `graphql/typeDefs/index.js` - 匯總所有 schema
- [x] 建立 `graphql/typeDefs/user.js` - User 型別定義
- [x] 建立 `graphql/typeDefs/todo.js` - Todo 型別定義
- [x] 定義基本的 Query、Mutation 型別

**完成標準**: GraphQL schema 可以正常載入，無語法錯誤 ✅

#### ✅ Task 1.3: 設定 Apollo Server
- [x] 建立 `graphql/server.js` - Apollo Server 基本設定
- [x] 建立 `graphql/context.js` - GraphQL 上下文設定
- [x] 在 `app.js` 中整合 Apollo Server
- [x] 設定 `/graphql` 端點

**完成標準**: 能夠存取 `/graphql` 端點，看到 GraphQL Playground ✅

#### ✅ Task 1.4: 建立服務層基礎
- [x] 建立 `services/authService.js` - 認證服務基礎框架
- [x] 建立 `services/todoService.js` - 待辦事項服務基礎框架
- [x] 從現有 controllers 提取共用邏輯到 services

**完成標準**: 服務層檔案建立完成，基本函式定義完成 ✅

---

### 階段 2: 認證功能實作 (第 3 天)

#### ✅ Task 2.1: 實作認證 Schema
- [x] 完善 User 型別定義
- [x] 定義 AuthPayload 型別
- [x] 定義 RegisterInput 和 LoginInput
- [x] 定義 register 和 login mutations

**完成標準**: 認證相關的 GraphQL 型別定義完成 ✅

#### ✅ Task 2.2: 實作認證 Resolvers
- [x] 建立 `graphql/resolvers/Mutation.js`
- [x] 實作 `register` resolver
- [x] 實作 `login` resolver
- [x] 建立 `graphql/resolvers/index.js` 匯總所有 resolvers

**完成標準**: 可以透過 GraphQL 進行使用者註冊和登入 ✅

#### ✅ Task 2.3: 實作 GraphQL 認證中間件
- [x] 在 `graphql/context.js` 中實作 JWT 解析
- [x] 建立認證檢查輔助函式
- [x] 測試認證流程

**完成標準**: GraphQL 可以正確解析和驗證 JWT token ✅

---

### 階段 3: 查詢功能實作 (第 4 天)

#### ✅ Task 3.1: 實作使用者查詢
- [x] 建立 `graphql/resolvers/Query.js`
- [x] 實作 `me` query resolver
- [x] 測試使用者資訊查詢

**完成標準**: 認證使用者可以透過 GraphQL 查詢自己的資訊 ✅

#### ✅ Task 3.2: 實作待辦事項查詢
- [x] 實作 `todos` query resolver  
- [x] 實作 `todo(id)` query resolver
- [x] 測試待辦事項查詢功能

**完成標準**: 認證使用者可以透過 GraphQL 查詢自己的待辦事項 ✅

#### ✅ Task 3.3: 實作關聯查詢
- [x] 建立 `graphql/resolvers/User.js` - User 欄位 resolvers
- [x] 建立 `graphql/resolvers/Todo.js` - Todo 欄位 resolvers  
- [x] 實作 `User.todos` resolver
- [x] 實作 `Todo.user` resolver

**完成標準**: 可以在單一查詢中取得使用者及其待辦事項 ✅

---

### 階段 4: 變更功能實作 (第 5 天)

#### ✅ Task 4.1: 實作待辦事項 CRUD Mutations
- [x] 實作 `createTodo` mutation resolver
- [x] 實作 `updateTodo` mutation resolver  
- [x] 實作 `deleteTodo` mutation resolver
- [x] 定義相關的 Input 型別

**完成標準**: 可以透過 GraphQL 執行所有待辦事項的 CRUD 操作

#### ✅ Task 4.2: 測試完整的 CRUD 流程
- [x] 測試建立待辦事項
- [x] 測試更新待辦事項
- [x] 測試刪除待辦事項
- [x] 驗證權限控制正常運作

**完成標準**: 所有 CRUD 功能都能正常運作，且只能操作自己的資料 ✅

---

### 階段 5: 錯誤處理與最佳化 (第 6 天)

#### ✅ Task 5.1: 完善錯誤處理
- [ ] 統一 GraphQL 錯誤格式
- [ ] 處理認證錯誤
- [ ] 處理驗證錯誤
- [ ] 處理資料庫錯誤

**完成標準**: GraphQL API 有清晰的錯誤訊息，不會洩漏敏感資訊

#### ✅ Task 5.2: 基本效能最佳化
- [ ] 檢查並修復 N+1 查詢問題
- [ ] 實作簡單的查詢複雜度限制
- [ ] 測試回應時間

**完成標準**: GraphQL 查詢效能符合基本要求

---

### 階段 6: 測試與驗證 (第 7 天)

#### ✅ Task 6.1: 功能測試
- [ ] 測試所有 GraphQL 查詢
- [ ] 測試所有 GraphQL 變更
- [ ] 驗證與 REST API 的資料一致性
- [ ] 測試認證和權限控制

**完成標準**: 所有功能測試通過

#### ✅ Task 6.2: 整合測試
- [ ] 同時使用 REST 和 GraphQL API 進行操作
- [ ] 驗證資料一致性
- [ ] 測試併發請求

**完成標準**: REST 和 GraphQL API 可以同時正常運作

---

### 階段 7: 文件與部署 (第 8 天)

#### ✅ Task 7.1: 撰寫基本文件
- [ ] 更新 README.md 加入 GraphQL 使用說明
- [ ] 撰寫常用查詢範例
- [ ] 記錄認證方式

**完成標準**: 有足夠的文件讓其他開發者了解如何使用 GraphQL API

#### ✅ Task 7.2: 部署設定
- [ ] 確認生產環境設定
- [ ] 更新 Docker 設定 (如果需要)
- [ ] 測試部署流程

**完成標準**: GraphQL API 可以在生產環境正常運作

---

## 🔧 開發指南

### 每日檢查清單
- [ ] 程式碼能正常運行
- [ ] 現有 REST API 功能未受影響
- [ ] 新增的 GraphQL 功能正常運作
- [ ] 無明顯的效能問題
- [ ] 錯誤處理適當

### 測試方式
1. **GraphQL Playground**: 在 `http://localhost:3000/graphql` 測試查詢
2. **REST API**: 確認原有端點仍正常運作
3. **資料一致性**: 比較 REST 和 GraphQL 的回應結果

### 常用 GraphQL 查詢範例

#### 使用者註冊
```graphql
mutation {
  register(input: {
    username: "testuser"
    password: "password123"
  }) {
    token
    user {
      id
      username
    }
  }
}
```

#### 查詢待辦事項
```graphql
query {
  todos {
    id
    title
    completed
    createdAt
  }
}
```

#### 建立待辦事項
```graphql
mutation {
  createTodo(input: {
    title: "完成 GraphQL 整合"
  }) {
    id
    title
    completed
  }
}
```

---

## 🚨 重要提醒

### 必須保持的原則
1. **不能破壞現有功能**: 每次修改後都要確認 REST API 正常
2. **段階式開發**: 每完成一個階段就要進行測試
3. **簡單優先**: 先實作核心功能，複雜功能後續再加
4. **頻繁測試**: 每個任務完成後都要進行基本測試

### 遇到問題時
1. 先檢查是否影響到現有 REST API
2. 查看 GraphQL Playground 的錯誤訊息
3. 檢查伺服器日誌
4. 確認資料庫連線正常

---

## ✅ 完成標準

當所有任務完成後，您應該能夠：
- ✅ 透過 GraphQL 執行所有現有 REST API 的功能
- ✅ 使用相同的認證機制
- ✅ 在 GraphQL Playground 中測試所有查詢和變更
- ✅ REST API 功能完全不受影響
- ✅ 有基本的使用文件

**🎉 恭喜！您已經成功將 Apollo GraphQL 整合到現有專案中！**
