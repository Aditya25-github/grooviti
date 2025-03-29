const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/events", changefreq: "weekly", priority: 0.8 },
  { url: "/pricing", changefreq: "monthly", priority: 0.6 },
  { url: "/contact", changefreq: "yearly", priority: 0.5 }
];

const sitemap = new SitemapStream({ hostname: "https://grooviti.com" });

streamToPromise(sitemap)
  .then((data) => fs.writeFileSync("frontend/public/sitemap.xml", data))
  .catch((err) => console.error(err));

links.forEach((link) => sitemap.write(link));
sitemap.end();
