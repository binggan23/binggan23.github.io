#!/usr/bin/env bash
set -u
cd /home/cookie/code_test/binggan23.github.io
PORT=4173
PID=$(lsof -ti tcp:$PORT 2>/dev/null || true)
if [ -n "$PID" ]; then kill $PID 2>/dev/null || true; sleep 0.8; fi
nohup pnpm preview >/tmp/preview.log 2>&1 &
for i in $(seq 1 40); do
  if curl -sf http://127.0.0.1:4173/ >/dev/null; then echo "preview up"; exit 0; fi
  sleep 0.25
done
echo "preview failed"; tail -5 /tmp/preview.log; exit 1
