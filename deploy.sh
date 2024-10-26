(
  (
    cd frontend && \
      bun run build --preset=deno_server && \
      rsync -rh --delete ./.output/ $zxc:/home/yooneskh/whatithink/frontend && \
      ssh $zxc pm2 restart whatithink-frontend
  ) & (
    cd backend && \
      rsync -rh --delete ./ $zxc:/home/yooneskh/whatithink/backend && \
      ssh $zxc pm2 restart whatithink-backend
  )
)