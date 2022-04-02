#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

#echo 'cswiki.top' > CNAME

# 更新 master
git add -A
git commit -m "更新"
git push

# 更新 gh-pages
cd vuepress-doc
npm run build  # 生成静态文件
cd docs/.vuepress/dist # 进入生成的文件夹

git init
git add -A
git commit -m 'deploy'

# 发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:veal98/cs-wiki.git master:gh-pages

cd -

cd ../