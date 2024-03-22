cd /home/singchun/Firmament
pm2 delete "Firmament"
npm run build
pm2 start npm --name "Firmament" -- start -- --port 3001
