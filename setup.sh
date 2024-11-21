#! /bin/bash

set -ex

npm install
npm run prisma:migrate -- --name init