rm -r -Force build-git
npm run build
npm run build -- --locale zh --out-dir build/zh
npm run build -- --locale cn --out-dir build/cn
git clone git@github.com:amentfirm/amentfirm.github.io.git build-git
mv build-git/.git tempgit
rm -r -Force build-git/**
cp -r -Force build/* build-git
mv tempgit build-git/.git
pushd build-git
git add --all
git commit -m "Deploy website"
git push
popd
firebase deploy
