#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
STATIC_DIR="$BACKEND_DIR/src/main/resources/static"

echo "========================================="
echo "  Midnight Library — Build & Package"
echo "========================================="
echo ""

# 1. Build React frontend
echo "[1/3] Building frontend..."
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
  echo "  -> Installing dependencies..."
  npm install
fi

npm run build
echo "  -> Frontend built."

# 2. Copy frontend build to Spring Boot static resources
echo ""
echo "[2/3] Copying frontend build to backend static resources..."
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"
cp -r "$FRONTEND_DIR/dist/"* "$STATIC_DIR/"
echo "  -> Copied to $STATIC_DIR"

# 3. Build Spring Boot JAR
echo ""
echo "[3/3] Building backend JAR..."
cd "$BACKEND_DIR"

# Use Maven wrapper if present, otherwise system mvn
if [ -f "./mvnw" ]; then
  MVN="./mvnw"
else
  MVN="mvn"
fi

$MVN clean package -DskipTests -q
echo "  -> JAR built."

# Report
JAR_FILE=$(ls "$BACKEND_DIR/target/"*.jar | head -1)
echo ""
echo "========================================="
echo "  Build complete"
echo "  JAR: $JAR_FILE"
echo "========================================="
echo ""
echo "To run: java -jar $JAR_FILE"
echo "Access: http://localhost:8080"
