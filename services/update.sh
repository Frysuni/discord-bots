#!/bin/bash

pm2 stop HopaBot
rm -r src
rm package-lock.json ecosystem.config.js .env package.json
tar -xf build.tar.gz
chmod 755 update.sh
npm i
echo -n "Start? (yes/No):"
read start
if [ $start == 'yes' ] || [ $start == 'y' ]
then
  echo "Starting..."
  pm2 start HopaBot
else
  echo "Skiped."
fi

