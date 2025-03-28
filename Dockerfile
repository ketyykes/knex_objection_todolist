FROM node:18

WORKDIR /app

# 安裝 pnpm 和 knex CLI
RUN npm install -g pnpm knex

# 先複製 package.json 以利用 Docker 緩存機制
COPY package.json pnpm-lock.json* ./

# 安裝依賴
RUN pnpm install

# 複製其餘所有檔案
COPY . .

# 運行資料庫遷移和啟動應用 (將在 docker-compose 中被覆蓋)
CMD ["sh", "-c", "pnpm run migrate && pnpm run dev"] 