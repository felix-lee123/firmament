---
slug: news-on-sphere
title: HK News on a Sphere
authors: [po, singchun]
tags: [apps,news,search,database,cronjob,sphere]
---

We added a cronjob on our server to scrape HK news daily and store them on FireStore. Then we implemented a query to [search for the news](/docs/NewsViz/SearchNews) and used the technique demonstrated by [raizensoft](https://www.youtube.com/@raizensoft) (video [here](https://www.youtube.com/watch?v=xqpUsk3HWic)) to display HK [news on a sphere](/docs/NewsViz/SphereNews). To display arbitrary numbers of news evenly on the sphere, we used [spherical Fibonacci mapping](https://doi.org/10.1145/2816795.2818131).

我哋加咗個cornjob係server上每日爬香港新聞同儲存係FireStore上面。然後我哋寫咗個query去[搵香港新閒](/docs/NewsViz/SearchNews)同用咗[raizensoft](https://www.youtube.com/@raizensoft)係[呢喥](https://www.youtube.com/watch?v=xqpUsk3HWic)示範嘅技巧將每日嘅[香港新閒顯示係球上面](/docs/NewsViz/SphereNews)。我哋用咗[spherical Fibonacci mapping](https://doi.org/10.1145/2816795.2818131)將任意數目嘅新閒平均地放係球上面。

