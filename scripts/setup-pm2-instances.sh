ssh $zxc pm2 start --name whatithink-backend --cwd /home/yooneskh/whatithink/backend/ deno -- task start
ssh $zxc PORT=48503 pm2 start --name whatithink-frontend --cwd /home/yooneskh/whatithink/frontend/ deno -- task start
