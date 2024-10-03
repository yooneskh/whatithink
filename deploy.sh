(
  (
    cd frontend && \
      bun run build --preset=deno_server && \
      rsync -rh --info=progress2 --delete ./.output/ $zxc:/home/yooneskh/rasa/frontend && \
      ssh $zxc pm2 restart rasa-frontend
  ) & (
    cd backend && \
      rsync -rh --info=progress2 --delete ./ $zxc:/home/yooneskh/rasa/backend && \
      ssh $zxc pm2 restart rasa-backend
  )
)