# 使用 Node.js 20 作為基礎鏡像
FROM node:20

# 設置工作目錄
WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm

# 複製 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製所有原始碼
COPY . .

# 設置環境變數
ENV NODE_ENV=development
ENV PORT=3000

# 曝露端口
EXPOSE 3000

# 啟動應用
CMD pnpm run migrate:latest && pnpm run dev