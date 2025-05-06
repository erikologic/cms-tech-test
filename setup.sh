#! /bin/bash

set -ex

npm install
npx playwright install
npm run prisma:migrate -- --name init