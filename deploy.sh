(
  (
    cd frontend && \
      bun run build --preset=deno_server && \
      rsync -rh --info=progress2 --delete ./.output/ $zxc:/home/yooneskh/project/frontend && \
      ssh $zxc pm2 restart project-frontend
  ) & (
    cd backend && \
      rsync -rh --info=progress2 --delete ./ $zxc:/home/yooneskh/project/backend && \
      ssh $zxc pm2 restart project-backend
  )
)