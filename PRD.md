# Apollo GraphQL 整合產品需求文件 (PRD)

## 專案概述

### 目標
在現有的 Node.js、Express、Knex 和 Objection.js 待辦事項清單專案中整合 Apollo GraphQL，同時保持現有 REST API 不變，提供雙重 API 支援。

### 現有技術棧
- **後端框架**: Node.js with Express
- **資料庫 ORM**: Knex + Objection.js
- **資料庫**: PostgreSQL
- **認證**: JWT (jsonwebtoken) + Argon2 密碼雜湊
- **已安裝 GraphQL 套件**:
  - `@apollo/server`: ^4.12.2
  - `@as-integrations/express4`: ^1.1.0
  - `graphql`: ^16.11.0

### 現有 API 端點分析
#### 認證端點 (`/auth`)
- `POST /auth/register` - 使用者註冊
- `POST /auth/login` - 使用者登入

#### 待辦事項端點 (`/todos`)
- `POST /todos` - 建立待辦事項
- `GET /todos` - 取得使用者的所有待辦事項
- `PUT /todos/:id` - 更新待辦事項
- `DELETE /todos/:id` - 刪除待辦事項

### 資料模型
#### User (使用者)
```sql
- id: 主鍵 (auto increment)
- username: 使用者名稱 (unique, not null)
- password: 密碼雜湊 (not null)
- created_at: 建立時間
- updated_at: 更新時間
```

#### Todo (待辦事項)
```sql
- id: 主鍵 (auto increment)
- title: 標題 (not null)
- completed: 完成狀態 (boolean, default: false)
- user_id: 使用者外鍵 (not null, cascade delete)
- created_at: 建立時間
- updated_at: 更新時間
```

## GraphQL 整合需求

### 1. 架構設計原則

#### 1.1 非破壞性整合
- **保持現有 REST API 完全不變**
- GraphQL 作為額外的查詢介面，不影響現有功能
- 共享相同的商業邏輯層和資料存取層
- 使用相同的認證機制

#### 1.2 程式碼重用策略
- 重用現有的 Objection.js 模型
- 重用現有的中間件 (認證、驗證)
- 重用現有的控制器邏輯
- 避免重複的商業邏輯實作

### 2. GraphQL Schema 設計

#### 2.1 型別定義
```graphql
# 使用者型別
type User {
  id: ID!
  username: String!
  todos: [Todo!]!
  createdAt: String!
  updatedAt: String!
}

# 待辦事項型別
type Todo {
  id: ID!
  title: String!
  completed: Boolean!
  user: User!
  createdAt: String!
  updatedAt: String!
}

# 認證回應型別
type AuthPayload {
  token: String!
  user: User!
}

# 輸入型別
input RegisterInput {
  username: String!
  password: String!
}

input LoginInput {
  username: String!
  password: String!
}

input CreateTodoInput {
  title: String!
}

input UpdateTodoInput {
  title: String
  completed: Boolean
}
```

#### 2.2 查詢 (Queries)
```graphql
type Query {
  # 取得當前使用者資訊
  me: User
  
  # 取得使用者的所有待辦事項
  todos: [Todo!]!
  
  # 根據 ID 取得特定待辦事項
  todo(id: ID!): Todo
}
```

#### 2.3 變更 (Mutations)
```graphql
type Mutation {
  # 使用者認證
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  
  # 待辦事項操作
  createTodo(input: CreateTodoInput!): Todo!
  updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
  deleteTodo(id: ID!): Boolean!
}
```

### 3. 實作架構

#### 3.1 目錄結構
```
專案根目錄/
├── graphql/
│   ├── typeDefs/
│   │   ├── index.js          # Schema 匯總
│   │   ├── user.js           # 使用者型別定義
│   │   └── todo.js           # 待辦事項型別定義
│   ├── resolvers/
│   │   ├── index.js          # Resolver 匯總
│   │   ├── Query.js          # 查詢解析器
│   │   ├── Mutation.js       # 變更解析器
│   │   ├── User.js           # 使用者欄位解析器
│   │   └── Todo.js           # 待辦事項欄位解析器
│   ├── context.js            # GraphQL 上下文設定
│   └── server.js             # Apollo Server 設定
├── services/                 # 商業邏輯服務層 (新增)
│   ├── authService.js        # 認證相關服務
│   └── todoService.js        # 待辦事項相關服務
└── (現有檔案保持不變)
```

#### 3.2 服務層重構
為了避免在 GraphQL resolvers 和 REST controllers 中重複商業邏輯，需要建立服務層：

**authService.js**
- `register(username, password)` - 使用者註冊邏輯
- `login(username, password)` - 使用者登入邏輯
- `verifyToken(token)` - JWT 權杖驗證

**todoService.js**
- `createTodo(userId, title)` - 建立待辦事項
- `getUserTodos(userId)` - 取得使用者待辦事項
- `updateTodo(todoId, userId, data)` - 更新待辦事項
- `deleteTodo(todoId, userId)` - 刪除待辦事項

#### 3.3 認證整合
GraphQL 將使用與 REST API 相同的 JWT 認證機制：

1. **上下文中的使用者資訊**: 從 HTTP header 解析 JWT token
2. **權限檢查**: 在 resolver 中檢查使用者權限
3. **錯誤處理**: 統一的認證錯誤處理

### 4. API 端點配置

#### 4.1 GraphQL 端點
- **路徑**: `/graphql`
- **方法**: POST (查詢和變更) + GET (僅查詢，開發時使用)
- **GraphQL Playground**: 在開發環境中啟用

#### 4.2 與現有路由共存
```javascript
// app.js 更新後的路由配置
app.use('/auth', authRoutes);      // 現有 REST 認證
app.use('/todos', todoRoutes);     // 現有 REST 待辦事項
app.use('/graphql', graphqlServer); // 新增 GraphQL
```

### 5. 開發階段規劃

#### 階段一：基礎建設 (第 1-2 天)
1. 建立服務層，從現有控制器重構商業邏輯
2. 設定 Apollo Server 基礎架構
3. 建立 GraphQL 上下文和認證中間件
4. 建立基本的型別定義

#### 階段二：核心功能實作 (第 3-5 天)
1. 實作認證相關的 resolvers (register, login)
2. 實作使用者查詢 resolver (me)
3. 實作待辦事項 CRUD resolvers
4. 實作關聯查詢 (User.todos, Todo.user)

#### 階段三：測試與驗證 (第 6-7 天)
1. 編寫 GraphQL 查詢測試
2. 驗證與現有 REST API 的一致性
3. 效能測試和最佳化
4. 錯誤處理完善

#### 階段四：文件與部署 (第 8 天)
1. 撰寫 GraphQL API 文件
2. 更新 README 說明雙 API 使用方式
3. 設定生產環境配置

### 6. 技術考量

#### 6.1 效能最佳化
- **資料載入最佳化**: 使用 DataLoader 避免 N+1 查詢問題
- **查詢複雜度限制**: 避免過於複雜的嵌套查詢
- **快取策略**: 適當的查詢結果快取

#### 6.2 安全性
- **查詢深度限制**: 防止惡意的深度嵌套查詢
- **查詢複雜度分析**: 限制查詢的複雜度
- **速率限制**: 與 REST API 共享速率限制規則
- **輸入驗證**: 嚴格的輸入資料驗證

#### 6.3 錯誤處理
- **統一錯誤格式**: GraphQL 錯誤與 REST API 錯誤保持一致的格式
- **適當的錯誤分類**: 區分認證、驗證、和系統錯誤
- **開發 vs 生產環境**: 不同環境下的錯誤資訊詳細程度

### 7. 測試策略

#### 7.1 功能測試
- GraphQL 查詢和變更的功能測試
- 認證流程測試
- 資料驗證測試
- 權限控制測試

#### 7.2 整合測試
- GraphQL 與 REST API 的資料一致性測試
- 資料庫操作的一致性驗證
- 併發請求測試

#### 7.3 效能測試
- 查詢回應時間測試
- 複雜查詢的效能測試
- 記憶體使用量監控

### 8. 文件需求

#### 8.1 開發者文件
- GraphQL Schema 文件
- 常用查詢範例
- 認證使用說明
- 與 REST API 的對照表

#### 8.2 部署文件
- 環境變數設定說明
- Docker 配置更新
- 生產環境最佳實務

### 9. 成功指標

#### 9.1 功能指標
- ✅ 所有現有 REST API 功能在 GraphQL 中都有對應實作
- ✅ 認證機制完全相容
- ✅ 資料操作結果與 REST API 完全一致

#### 9.2 效能指標
- GraphQL 查詢回應時間 ≤ 對應 REST API 的 1.2 倍
- 記憶體使用增加 ≤ 20%
- 無明顯的 N+1 查詢問題

#### 9.3 開發體驗指標
- GraphQL Playground 可正常使用
- 型別安全和自動完成功能正常
- 清晰的錯誤訊息和除錯資訊

### 10. 風險評估與緩解策略

#### 10.1 技術風險
**風險**: GraphQL 查詢複雜度可能導致效能問題
**緩解**: 實作查詢複雜度分析和深度限制

**風險**: 認證整合可能出現安全漏洞
**緩解**: 重用現有經過驗證的認證中間件

#### 10.2 專案風險
**風險**: 開發時程可能延後
**緩解**: 採用漸進式開發，先實作核心功能

**風險**: 維護複雜度增加
**緩解**: 透過服務層重構減少程式碼重複

### 11. 後續發展方向

#### 11.1 進階功能
- GraphQL 訂閱 (Subscriptions) 支援即時更新
- 更細粒度的權限控制
- GraphQL Federation 支援微服務架構

#### 11.2 開發工具整合
- GraphQL Code Generator 整合
- 前端 Apollo Client 最佳實務
- GraphQL 的 CI/CD 整合

---

## 結論

此 PRD 提供了將 Apollo GraphQL 整合到現有待辦事項清單專案的完整藍圖。透過非破壞性的整合方式，您可以在保持現有 REST API 穩定運行的同時，為專案添加現代化的 GraphQL 查詢能力。

整合過程中的關鍵是建立共享的服務層，確保 REST 和 GraphQL 兩套 API 使用相同的商業邏輯，避免功能不一致和維護困難的問題。
