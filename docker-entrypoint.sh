#!/bin/sh
set -e

# 等待資料庫就緒
echo "等待資料庫連接..."
sleep 5

# 檢查遷移狀態
echo "檢查資料庫遷移狀態..."
pnpm run migrate:status

# 如果沒有資料表，執行遷移
echo "執行資料庫遷移..."
pnpm run migrate:latest

# 執行原本的啟動命令
echo "啟動應用程式..."
exec "$@" 