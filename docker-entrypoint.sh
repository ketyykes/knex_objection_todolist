#!/bin/sh
set -e

# 等待資料庫就緒
echo "等待資料庫連接..."
sleep 5

# 檢查遷移狀態
echo "檢查資料庫遷移狀態..."
pnpm run migrate:status
MIGRATION_STATUS=$?

# 如果沒有資料表，執行遷移
if [ $MIGRATION_STATUS -ne 0 ]; then
  echo "沒有找到資料表或遷移狀態異常，執行資料庫遷移..."
  pnpm run migrate:latest
else
  echo "資料表已存在，跳過遷移步驟..."
fi

# 執行原本的啟動命令
echo "啟動應用程式..."
exec "$@" 