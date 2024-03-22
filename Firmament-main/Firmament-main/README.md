Firmament - 蒼穹

Frimament is a home developed fun project.

蒼穹是一個在家研發的有趣項目。

# Environments

This website is built using Docusaurus on Windows. The apps are developed on Firebase.

# Package installation / update

```
npm ci
npm update
npm audit fix
npm i --package-lock-only
```

# Build and deploy to GitHub page

Windows PowerShell
```
rm -r -Force build-git
npm run build
git clone https://github.com/amentfirm/amentfirm.github.io.git build-git
cp -r -Force build\* build-git
pushd build-git
git add --all
git commit -m "Deploy website"
git push
popd
```

Or, just run `deploy.ps1`


# Build and deploy to firebase

initialize firebase project and set public directory as build
```
firebase init hosting

...

? What do you want to use as your public directory? (public) build

...
```
build and deploy the project

```
npm run build
firebase deploy
```

# Development ideas
- Text scrape
  - https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer  
  - https://cors-anywhere.herokuapp.com/corsdemo
  - https://www.scrapingbee.com/blog/web-scraping-javascript/
  - https://github.com/Rob--W/cors-anywhere/issues/166
  - https://ithelp.ithome.com.tw/m/articles/10268821
- Study helper
- News visualizer
  - https://github.com/tensorflow/tfjs-models/tree/master/toxicity
- Something that we want the machine does for us
- https://themeisle.com/blog/news-aggregator-websites-examples/
- https://www.google.com/search?q=news+feeds+gather+and+analysis+web&rlz=1C1ONGR_zh-HKHK971HK971&ei=kMqrY_K6C5vN-QbtqqOQDQ&ved=0ahUKEwjywvqcwZv8AhWbZt4KHW3VCNIQ4dUDCA8&uact=5&oq=news+feeds+gather+and+analysis+web&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIHCCEQoAEQCjIHCCEQoAEQCjIHCCEQoAEQCjIHCCEQoAEQCjoKCAAQRxDWBBCwA0oECEEYAEoECEYYAFCwAVjkB2CiC2gBcAF4AIABYogBpQKSAQE0mAEAoAEByAEKwAEB&sclient=gws-wiz-serp
