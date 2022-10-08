#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e



# 更新 master
git add -A
git commit -m "更新"
git push

# 更新 gh-pages
cd vuepress-doc
npm run build  # 生成静态文件
cd docs/.vuepress/dist # 进入生成的文件夹

git init
# echo 'cswiki.top' > CNAME # 绑定域名
git add -A
git commit -m 'deploy'

# 发布到 Github Pages: https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:veal98/cs-wiki.git master:gh-pages

# 发布到 个人云服务器
git push -f git@124.221.132.200:/home/www/website/cswiki.git master

cd -

cd ../