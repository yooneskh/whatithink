(
  (
    cd frontend && \
      bun run build --preset=deno_server && \
      rsync -rh --delete ./.output/ $zxc:/home/yooneskh/rasa/frontend && \
      ssh $zxc pm2 restart rasa-frontend
  ) & (
    cd backend && \
      rsync -rh --delete ./ $zxc:/home/yooneskh/rasa/backend && \
      ssh $zxc pm2 restart rasa-backend
  )
)