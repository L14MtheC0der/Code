#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:https://l14mthec0der.github.io/Code/main:gh-pages

cd -