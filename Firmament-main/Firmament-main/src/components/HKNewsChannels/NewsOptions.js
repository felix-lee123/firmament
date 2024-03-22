import { load } from 'cheerio';

function appendPostURL(data, options) {
  for (let i = 0; i < data.length; i++) {
    data[i].srcUrl = options['url'] + data[i].srcUrl
  }
  return data;
}

function appendImgURL(data, options) {
  for (let i = 0; i < data.length; i++) {
    data[i].imgUrl = options['url'] + data[i].imgUrl
  }
  return data;
}

function warpImgUsingWSRV(data, options) {
  for (let i = 0; i < data.length; i++) {
    data[i].imgUrl = "//wsrv.nl/?url=" + data[i].imgUrl
  }
  return data;
}

async function parseHK01News(msg) {
  var newsData = [];
  let $ = load(msg);
  let element;
  if(element = $('#__NEXT_DATA__').html()){
    var JSONobject = JSON.parse(element);
    //console.log(typeof(JSONobject));
    //console.log(JSONobject.props.initialProps.pageProps.sections[0].items[0].data);
    for (let i = 0; i < JSONobject.props.initialProps.pageProps.sections[0].items.length; i++) {
      newsData.push(
        { 
          title: JSONobject.props.initialProps.pageProps.sections[0].items[i].data.title ,
          imgUrl: JSONobject.props.initialProps.pageProps.sections[0].items[i].data.mainImage.cdnUrl ,
          srcUrl: JSONobject.props.initialProps.pageProps.sections[0].items[i].data.publishUrl ,
          desc: JSONobject.props.initialProps.pageProps.sections[0].items[i].data.description
        }
      );
    }
  }
  return newsData;
}

async function parseTKPNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let swipers = $('.swiper-slide');
  for (let i = 0; i < swipers.length; i++) {
    let aTag = $(swipers[i]).find('a');
    let imgTag = $(swipers[i]).find('img');
    let spanTag = $(swipers[i]).find('span')
    if (spanTag.length) {
      newsData.push(
        { 
          title: spanTag.text() ,
          imgUrl: imgTag.attr('src') ,
          srcUrl: aTag.attr('href') ,
          desc: ""
        }
      );  
    }
  }
  return newsData;
}

async function parseSTNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let banners = $('.banner-news');
  for (let i = 0; i < banners.length; i++) {
    let aTag = $(banners[i]).find('a');
    let imgTag = $(banners[i]).find('img');
    let titleTag = $(banners[i]).find('div[class="title"]');
    let desTag = $(banners[i]).find('div[class="des"]');
    newsData.push(
      { 
        title: titleTag.text() ,
        imgUrl: imgTag.attr('src') ,
        srcUrl: aTag.attr('href') ,
        desc: desTag.text()
      }
    );
  }
  return newsData;
}

async function parseOrientalNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let articles = $('div[type="article"]');
  for (let i = 0; i < articles.length; i++) {
    let aTag = $(articles[i]).find('a');
    let imgTag = $(articles[i]).find('img');
    newsData.push(
      { 
        title: imgTag.attr('alt') ,
        imgUrl: imgTag.attr('src') ,
        srcUrl: aTag.attr('href') ,
        desc: ""
      }
    );
  }
  return newsData;
}

async function parseMPNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let headlines = $('.headline');
  for (let i = 0; i < headlines.length; i++) {
    let aTag = $(headlines[i]).find('h1').find('a');
    let imgTag = $(headlines[i]).find('img');
    let descTag = $(headlines[i]).find('figure').find('a')
    newsData.push(
      { 
        title: aTag.text() ,
        imgUrl: imgTag.attr('src') ,
        srcUrl: "/" + aTag.attr('href') ,
        desc: descTag.attr('title')
      }
    );
  }
  return newsData;
}

async function parseSecretChinaNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let aTags = $('div[id="headlines"]').find('a');
  let imgTags = $('div[id="headlines"]').find('img');
  // aTags has one more than imgTags
  for (let i = 0; i < imgTags.length; i++) {
    newsData.push(
      { 
        title: $(aTags[i+1]).attr('title') ,
        imgUrl: $(imgTags[i]).attr('src') ,
        srcUrl: $(aTags[i+1]).attr('href') ,
        desc: ""
      }
    );
  }
  if (newsData.length == 0) { // mobile version
    if ($('a:contains("重點新聞")').parent().is('h2')) {
      let spanTags = $('a:contains("重點新聞")').parent().next().find('span'); //
      for (let i = 0; i < spanTags.length; i+=2 ) {
        newsData.push(
          { 
            title: $(spanTags[i]).find('img').attr('alt') ,
            imgUrl: $(spanTags[i]).find('img').attr('src') ,
            srcUrl: $(spanTags[i]).find('a').attr('href') ,
            desc: ""
          }
        );
      }
    }
  }
  return newsData;
}

async function parseEpochTimesNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let sliderImage = $('.slideImage');
  let sliderTitle = $('.slide_title');
  for (let i = 0; i < sliderTitle.length; i++) {
    let aTag = $(sliderTitle[i]).find('a');
    let imgTag = $(sliderImage[i]).find('img');
    let spanTag = $(sliderImage[i]).find('span');
    newsData.push(
      { 
        title: aTag.text() ,
        imgUrl: imgTag.attr('src') ,
        srcUrl: aTag.attr('href') ,
        desc: spanTag.text()
      }
    );
  }
  if (newsData.length == 0) { // mobile version
    let headlines = $('div[class="headline"]').find('.one_post');
    for (let i = 0; i < headlines.length; ++i) {
      newsData.push(
        { 
          title: $(headlines[i]).find('img').attr('alt') ,
          imgUrl: $(headlines[i]).find('img').attr('src') ,
          srcUrl: $(headlines[i]).find('a').attr('href') ,
          desc: $(headlines[i]).find('span').text()
        }
      );
    }
    console.log();
  }
  return newsData;
}

async function parseYahooNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let scripts = $('script:contains("/* -- Data -- */")');
  let yahooFun = scripts.text().split(/\r?\n/);
  let searchText = "root.App.main = ";
  for (let i = 0; i < yahooFun.length; ++i) {
    if (yahooFun[i].includes(searchText)) {
      let JSONString = yahooFun[i].substring(searchText.length, yahooFun[i].length-1);
      var JSONobject = JSON.parse(JSONString);
      for (let i = 0; i < JSONobject.context.dispatcher.stores.IndexDataStore.indexData['hong-kong'].length; i++) {
        newsData.push(
          { 
            title: JSONobject.context.dispatcher.stores.IndexDataStore.indexData['hong-kong'][i].title ,
            imgUrl: JSONobject.context.dispatcher.stores.IndexDataStore.indexData['hong-kong'][i].thumbnail.url ,
            srcUrl: JSONobject.context.dispatcher.stores.IndexDataStore.indexData['hong-kong'][i].url ,
            desc: JSONobject.context.dispatcher.stores.IndexDataStore.indexData['hong-kong'][i].summary
          }
        );
      }
      break;
    }
  }
  if (newsData.length == 0) { // mobile version
    let imgTags = $('img');
    for (let i = 0; i < imgTags.length; ++i) {
      if ($(imgTags[i]).attr('alt') && $(imgTags[i]).parent().parent() && $(imgTags[i]).parent().parent().is('a') ) {
        let imgUrl = $(imgTags[i]).attr('src');
        if ($(imgTags[i]).attr('data-wf-src')) {
          imgUrl = $(imgTags[i]).attr('data-wf-src');
        }
        newsData.push(
          { 
            title: $(imgTags[i]).attr('alt'),
            imgUrl: imgUrl,
            srcUrl: $(imgTags[i]).parent().parent().attr('href') ,
            desc: ""
          }
        );
      }
    }
  }
  return newsData;
}

async function parseHKCNANews(msg) {
  var newsData = [];
  let $ = load(msg);
  let sliderImage = $('.slide_img');
  for (let i = 0; i < sliderImage.length; i++) {
    let aTag = $(sliderImage[i]).find('a');
    let pTag = $(sliderImage[i]).find('p');
    let imgTag = $(sliderImage[i]).find('img');
    newsData.push(
      { 
        title: pTag.text() ,
        imgUrl: imgTag.attr('src').replace(/\/\//g, "/") ,
        srcUrl: aTag.attr('href') ,
        desc: ""
      }
    );
  }
  return newsData;
}

async function parseRTHKNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let slides = $('.sp-slide-content');
  for (let i = 0; i < slides.length; i++) {
    let aTag = $(slides[i]).find('a');
    let pTag = $(slides[i]).find('p');
    let imgTag = $(slides[i]).find('img');
    newsData.push(
      { 
        title: pTag.text() ,
        imgUrl: imgTag.attr('src') ,
        srcUrl: aTag.attr('href') ,
        desc: ""
      }
    );
  }
  return newsData;
}

async function parseHKMetasNews(msg) {
  var newsData = [];
  let $ = load(msg);
  var date = new Date();
  let day = date.getDate().toString();
  if (day.length < 2) day = "0" + day;
  let month = (date.getMonth() + 1).toString(); // getMonth() returns month from 0 to 11
  if (month.length < 2) month = "0" + month;
  const year = date.getFullYear().toString();
  const lookfor = 'div:contains("' + year + "年" + month + "月" + day + "日" + '")';
  let todays = $(lookfor);
  for (let i = 0; i < todays.length; i++) if ($(todays[i]).prev().prev().is("img") && $(todays[i]).parent().is("a")) {
    newsData.push(
      { 
        title: $(todays[i]).prev().text() ,
        imgUrl: $(todays[i]).prev().prev().attr("src") ,
        srcUrl: $(todays[i]).parent().attr("href") ,
        desc: ""
      }
    );
  }
  if (newsData.length == 0) { // no news, look for the previous day
    let day = date.getDate() - 1;
    let month = date.getMonth();
    let year = date.getFullYear();
    if (day == 0) {
      month = month - 1;
      if (month == 0) {
        month = 11;
        year = year - 1;
      }
      day = getLastDayOfAMonth(month);
    }
    day = day.toString();
    if (day.length < 2) day = "0" + day;
    month = (month + 1).toString();
    if (month.length < 2) month = "0" + month;
    year = year.toString();
    const lookfor = 'div:contains("' + year + "年" + month + "月" + day + "日" + '")';
    let yesterdays = $(lookfor);
    for (let i = 0; i < yesterdays.length; i++) if ($(yesterdays[i]).prev().prev().is("img") && $(yesterdays[i]).parent().is("a")) {
      newsData.push(
        { 
          title: $(yesterdays[i]).prev().text() ,
          imgUrl: $(yesterdays[i]).prev().prev().attr("src") ,
          srcUrl: $(yesterdays[i]).parent().attr("href") ,
          desc: ""
        }
      );
    }
  }
  
  return newsData;
}

async function parseTVBNews(msg) {
  var newsData = [];
  let $ = load(msg);
  // TODO, the content is loaded after the fetch. Need to find a better way to fetch the data
  console.log($('body').html());
  return newsData;
}

async function parseGovNews(msg) {
  var newsData = [];
  let $ = load(msg);
  // TODO, the content is loaded after the fetch. Need to find a better way to fetch the data
  return newsData;
}

async function parseWenWeiNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let lunbos = $('.gallery-lunbo-title');
  for (let i = 0; i < lunbos.length; i++) {
    let srcUrl = $(lunbos[i]).parent().parent().next().find('img').attr('src');
    newsData.push(
      { 
        title: $(lunbos[i]).attr('title') ,
        imgUrl: $(lunbos[i]).parent().parent().next().find('img').attr('src'),
        srcUrl: $(lunbos[i]).attr('href') ,
        desc: $(lunbos[i]).parent().next().text()
      }
    );
  }
  return newsData;
}

async function parse730News(msg) {
  var newsData = [];
  let $ = load(msg);
  let covers = $('.coverlist-item');
  for (let i = 0; i < covers.length; ++i) {
    let imgTag = $(covers[i]).find('.coveritem-img');
    let imgUrl = imgTag.attr('style'); 
    let searchText = "background-image:url(";
    imgUrl = imgUrl.substring(searchText.length, imgUrl.length-1);
    let aTag = $(covers[i]).find('.coveritem-title').find('a');
    newsData.push(
      { 
        title: aTag.text() ,
        imgUrl: imgUrl,
        srcUrl: aTag.attr('href') ,
        desc: ""
      }
    );
  }
  return newsData;
}

async function parseNowNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let news = $('.newsSummary');
  for (let i = 0; i < news.length; ++i) {
    newsData.push(
      { 
        title: $(news[i]).parent().find('img').attr('alt') ,
        imgUrl: $(news[i]).parent().find('img').attr('src'),
        srcUrl: $(news[i]).parent().attr('href') ,
        desc: $(news[i]).find('p').text()
      }
    );
  }
  if (newsData.length == 0) { // mobile version
    let news = $('.newsWrap');
    for (let i = 0; i < news.length; ++i) {
      let aTag = $(news[i]).find('a');
      let imgTag = aTag.find('.newsImgWrap').find('img');
      let timeTag = aTag.find('.newsDecs').find('.newsTime');
      if (timeTag.text().includes("分鐘前")) {
        newsData.push(
          { 
            title: imgTag.attr('alt'),
            imgUrl: imgTag.attr('src'),
            srcUrl: aTag.attr('href') ,
            desc: timeTag.text().trim()
          }
        );
      }
      else {
        for (let h = 1; h <= 8; ++h) { // news within 8 hours
          let searchText = h.toString() + "小時前";
          if (timeTag.text().includes(searchText) && timeTag.text().trim().length == searchText.length) {
            newsData.push(
              { 
                title: imgTag.attr('alt'),
                imgUrl: imgTag.attr('src'),
                srcUrl: aTag.attr('href') ,
                desc: timeTag.text().trim()
              }
            );
            break;
          }
        }
      }
    }
  }
  return newsData;
}

export function getLastDayOfAMonth(m, y) {
  switch (m) {
    case 0: case 2: case 4: case 6: case 7: case 9: case 11: return 31;
    case 3: case 5: case 8: case 10: return 30;
    case 1: if (y % 4 == 0) return 29; else return 28;
    default: return 0;
  }
}

async function parseBBCNews(msg) {
  var newsData = [];
  let $ = load(msg);
  var date = new Date();
  let day = date.getDate().toString();
  if (day.length < 2) day = "0" + day;
  let month = (date.getMonth() + 1).toString(); // getMonth() returns month from 0 to 11
  if (month.length < 2) month = "0" + month;
  const year = date.getFullYear().toString();
  let lookfor = 'time[datetime="' + year + '-' + month + '-' + day + '"]';
  let todays = $(lookfor);
  for (let i = 0; i < todays.length; ++i) if ($(todays[i]).prev().is('p') && $(todays[i]).prev().prev().is('h3')) {
    let pTag = $(todays[i]).prev();
    let aTag = $(todays[i]).prev().prev().find('a');
    let spanTag = aTag.find('span');
    let imgTag = $(todays[i]).parent().prev().find('img');
    newsData.push(
      { 
        title: spanTag.text() ,
        imgUrl: imgTag.attr('src'),
        srcUrl: aTag.attr('href') ,
        desc: pTag.text()
      }
    );
  }
  if (newsData.length == 0) { // no news, look for the previous day
    let day = date.getDate() - 1;
    let month = date.getMonth();
    let year = date.getFullYear();
    if (day == 0) {
      month = month - 1;
      if (month == 0) {
        month = 11;
        year = year - 1;
      }
      day = getLastDayOfAMonth(month);
    }
    day = day.toString();
    if (day.length < 2) day = "0" + day;
    month = (month + 1).toString();
    if (month.length < 2) month = "0" + month;
    year = year.toString();
    let lookfor = 'time[datetime="' + year + '-' + month + '-' + day + '"]';
    let yesterdays = $(lookfor);
    for (let i = 0; i < yesterdays.length; ++i) if ($(yesterdays[i]).prev().is('p') && $(yesterdays[i]).prev().prev().is('h3')) {
      let pTag = $(yesterdays[i]).prev();
      let aTag = $(yesterdays[i]).prev().prev().find('a');
      let spanTag = aTag.find('span');
      let imgTag = $(yesterdays[i]).parent().prev().find('img');
      newsData.push(
        { 
          title: spanTag.text() ,
          imgUrl: imgTag.attr('src'),
          srcUrl: aTag.attr('href') ,
          desc: pTag.text()
        }
      );
    }
  }
  return newsData;
}

function numberToMonth(mon) {
  switch (mon) {
    case 0: return 'Jan';
    case 1: return 'Feb';
    case 2: return 'Mar';
    case 3: return 'Apr';
    case 4: return 'May';
    case 5: return 'Jun';
    case 6: return 'Jul';
    case 7: return 'Aug';
    case 8: return 'Sep';
    case 9: return 'Oct';
    case 10: return 'Nov';
    case 11: return 'Dec';
    default: return 'Unknown';
  }
}

async function parseABCNews(msg) {
  var newsData = [];
  let $ = load(msg);
  var date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  for (let d = 0; d < 5; ++d) { // last four days
    let searchDay = day - d;
    let searchMonth = month;
    let searchYear = year;
    if (searchDay <= 0) {
      searchMonth = month - 1;
      if (searchMonth == 0) {
        searchMonth = 11;
        searchYear = year - 1;
      }
      searchDay = getLastDayOfAMonth(searchMonth) - (d - day);
    }
    const lookfor = 'time:contains("' + searchDay.toString() + " " + numberToMonth(searchMonth) + " " + searchYear.toString() + '")';
    let todays = $(lookfor);
    for(let i = 0; i < todays.length; ++i) {
      let descTag = $(todays[i]).parent().parent().prev();
      let aTag = descTag.parent().prev().find('a');
      let imgTag = aTag.parent().parent().parent().next().find('img');
      newsData.push(
        { 
          title: aTag.text() ,
          imgUrl: imgTag.attr('src'),
          srcUrl: aTag.attr('href'),
          desc: descTag.text()
        }
      );
    }
  }
  return newsData;
}

async function parseRCINews(msg) {
  var newsData = [];
  let $ = load(msg);
  let lookfor = 'footer:contains("分鐘前")';
  let minutes = $(lookfor);
  for(let i = 0; i < minutes.length; ++i) {
    let descTag = $(minutes[i]).prev();
    let aTag = $(minutes[i]).prev().prev().find('a');
    let imgTag = $(minutes[i]).parent().prev().find('img');
    newsData.push(
      { 
        title: aTag.find('div').find('span').text() ,
        imgUrl: imgTag.attr('src'),
        srcUrl: aTag.attr('href'),
        desc: descTag.text()
      }
    );
  }
  lookfor = 'footer:contains("小時前")';
  let hours = $(lookfor);
  for(let i = 0; i < hours.length; ++i) {
    let descTag = $(hours[i]).prev();
    let aTag = $(hours[i]).prev().prev().find('a');
    let imgTag = $(hours[i]).parent().prev().find('img');
    newsData.push(
      { 
        title: aTag.find('div').find('span').text() ,
        imgUrl: imgTag.attr('src'),
        srcUrl: aTag.attr('href'),
        desc: descTag.text()
      }
    );
  }
  for(let d = 1; d <= 3; ++d) { // last three days
    lookfor = 'footer:contains("' + d.toString() + ' 天前")';
    let days = $(lookfor);
    for(let i = 0; i < days.length; ++i) {
      let descTag = $(days[i]).prev();
      let aTag = $(days[i]).prev().prev().find('a');
      let imgTag = $(days[i]).parent().prev().find('img');
      newsData.push(
        { 
          title: aTag.find('div').find('span').text() ,
          imgUrl: imgTag.attr('src'),
          srcUrl: aTag.attr('href'),
          desc: descTag.text()
        }
      );
    }
  }
  return newsData;
}

async function parseNYTNews(msg) {
  var newsData = [];
  let $ = load(msg);
  let headline = $('.sectionLeadHeader');
  let headlineImg = $('.photoWrapper ');
  let headlineDesc = headlineImg.next();
  if (headline.length != 0) {
    newsData.push(
      { 
        title: headline.find('a').text() ,
        imgUrl: headlineImg.find('img').attr('data-url'),
        srcUrl: headline.find('a').attr('href'),
        desc: headlineDesc.text()
      }
    );
    let stories = $('.autoListStory');
    for (let i = 0; i < stories.length && i < 10; ++i) { // list the first nine stories
      let aTag = $(stories[i]).find('h3').find('a');
      let imgTag = $(stories[i]).find('img');
      let descTag = $(stories[i]).find('p');
      newsData.push(
        { 
          title: aTag.text() ,
          imgUrl: imgTag.attr('data-url'),
          srcUrl: aTag.attr('href'),
          desc: descTag.text()
        }
      );
    }
  }
  else {
    let articles = $('.regular-item');
    for (let i = 0; i < articles.length && i <= 10; ++i) { // list the first ten stories
      let aTag = $(articles[i]).find('a');
      let imgTag = $(articles[i]).find('figure').find('img');
      let descTag = $(articles[i]).find('p');
      newsData.push(
        { 
          title: aTag.text() ,
          imgUrl: imgTag.attr('src'),
          srcUrl: aTag.attr('href'),
          desc: descTag.text()
        }
      );
    }
  }
  return newsData;
}

async function parseDWNews(msg) {
  let newsData = [];
  let $ = load(msg);
  let teaserTags = $('.teaserImg');
  for (let i = 0; i < teaserTags.length ; ++i) {
    let teaser = $(teaserTags[i]);
    if (teaser.find('a').length == 1) { // teaser news
      let aTag = teaser.find('a');
      let imgTag = teaser.find('img');
      let pTag = teaser.parent().find('p');
      if (imgTag.attr('title').includes('You Tube')) continue;
      if (imgTag.attr('title').includes('Themenbild')) continue;
      newsData.push(
        { 
          title: imgTag.attr('title'),
          imgUrl: imgTag.attr('src'),
          srcUrl: aTag.attr('href'),
          desc: pTag.text()
        }
      );
    }
    else if (teaser.parent().is('a') == 1) {
      let aTag = teaser.parent();
      let imgTag = teaser.find('img');
      let pTag = teaser.next();
      newsData.push(
        { 
          title: imgTag.attr('title'),
          imgUrl: imgTag.attr('src'),
          srcUrl: aTag.attr('href'),
          desc: pTag.text()
        }
      );
    }
    if (newsData.length == 10) break;
  }
  if (newsData.length == 0) {
    let teaserTags = $('.basicteaser__wrap');
    for (let i = 0; i < teaserTags.length; ++i) {
      let teaser = $(teaserTags[i]);
      let aTag = teaser.find('a');
      let imgTag = teaser.find('img');
      if (imgTag.attr('alt').includes('You Tube')) continue;
      if (aTag.length == 2) {
        newsData.push(
          {
            title: imgTag.attr('alt'),
            imgUrl: imgTag.attr('data-src'),
            srcUrl: $(aTag[0]).attr('href'),
            desc: ""
          }
        );
      }
      else if (aTag.length == 3) {
        newsData.push(
          {
            title: imgTag.attr('alt'),
            imgUrl: imgTag.attr('data-src'),
            srcUrl: $(aTag[0]).attr('href'),
            desc: $(aTag[2]).text(),
          }
        );
      }
      if (newsData.length == 10) break;
    }
  }
  return newsData;
}

export const newsOptions = [
  { 
    value:'hk01', 
    label:'HK01-香港01', 
    url:'https://www.hk01.com', 
    path:'', 
    parser:parseHK01News, 
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'takungpao', 
    label:'Ta Kung Pao-大公報', 
    url:'http://www.takungpao.com.hk', 
    path:'', 
    parser:parseTKPNews, 
    postProcess:[warpImgUsingWSRV],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'st', 
    label:'Sing Tao Daily-星島日報', 
    url:'https://www.stheadline.com', 
    path:'', 
    parser:parseSTNews, 
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'oriental',
    label:'Oriental Daily News-東方日報', 
    url:'https://hk.on.cc',
    path:'',
    parser:parseOrientalNews,
    postProcess:[appendPostURL,appendImgURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'mingpao',
    label:'Ming Pao-明報',
    url:'https://news.mingpao.com/pns', 
    path:'/明報新聞網/main',
    parser:parseMPNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'secretchina', 
    label:'Vision Times-看中國', 
    url:'https://www.secretchina.com', 
    path:'/news/b5/index.html', 
    parser:parseSecretChinaNews, 
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false    
  },
  { 
    value:'epochtimes',
    label:'Epoch Times-大紀元',
    url:'https://www.epochtimes.com',
    path:'/b5',
    parser:parseEpochTimesNews,
    postProcess:null,
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'yahoo',
    label:'Yahoo-雅虎',
    url:'https://hk.news.yahoo.com',
    path:'',
    parser:parseYahooNews,
    postProcess:null,
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'hkcna',
    label:'HKCNA-香港新閒網',
    url:'http://www.hkcna.hk',
    path:'',
    parser:parseHKCNANews,
    postProcess:[appendPostURL,appendImgURL,warpImgUsingWSRV],
    isDisabled:false,
    isHidden:false   
  },
  { 
    value:'rthk',
    label:'RTHK News-香港電台',
    url:'https://news.rthk.hk',
    path:'/rthk/ch',
    parser:parseRTHKNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  } ,
  { 
    value:'hkmetas',
    label:'HK Matters-香港新聞連線',
    url:'https://news.hongkongmetas.com', 
    path:'',
    parser:parseHKMetasNews,
    postProcess:null,
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'tvb',
    label:'TVB News-無線新聞',
    url:'https://news.tvb.com',
    path:'/tc',
    parser:parseTVBNews,
    postProcess:null,
    isDisabled:true,
    isHidden:false
  },
  { 
    value:'gov',
    label:'Gov News-政府新聞網',
    url:'https://www.news.gov.hk',
    path:'/chi/index.html',
    parser:parseGovNews,
    postProcess:null,
    isDisabled:true,
    isHidden:false
  },
  { 
    value:'wwp',
    label:'Wen Wei Po-文匯報',
    url:'https://www.wenweipo.com',
    path:'/immed/hongkong',
    parser:parseWenWeiNews,
    postProcess:null,
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'730',
    label:'am730',
    url:'https://www.am730.com.hk',
    path:'',
    parser:parse730News,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'now',
    label:'Now News-Now 新聞',
    url:'https://news.now.com',
    path:'/home',
    parser:parseNowNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'bbc',
    label:'BBC News-BBC 新聞',
    url:'https://www.bbc.com',
    path:'/zhongwen/trad',
    parser:parseBBCNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'abc',
    label:'ABC News-ABC 新聞',
    url:'https://www.abc.net.au',
    path:'/news/chinese/china',
    parser:parseABCNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'rci',
    label:'CBC Radio-加拿大新聞',
    url:'https://ici.radio-canada.ca',
    path:'/rci/zh-hant',
    parser:parseRCINews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'nyt',
    label:'NY Times-紐約時報',
    url:'https://cn.nytimes.com',
    path:'/hk-taiwan/zh-hant/',
    parser:parseNYTNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  },
  { 
    value:'dw',
    label:'DW-德國之聲',
    url:'https://www.dw.com/zh',
    path:'/zh/在线报导/s-9058?&zhongwen=trad',
    parser:parseDWNews,
    postProcess:[appendPostURL],
    isDisabled:false,
    isHidden:false
  }
];
