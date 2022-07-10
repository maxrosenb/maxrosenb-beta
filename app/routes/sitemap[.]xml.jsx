const express = require("express");
const contentful = require("contentful");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { ContentfulSitemap } = require("contentful-sitemap");
import "dotenv/config";

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_CDA_TOKEN,
  space: process.env.CONTENTFUL_SPACE,
});

const sitemapGenerator = new ContentfulSitemap(client, [
  {
    pattern: "/",
    id: "[HOME_PAGE_ID]",
  },
  {
    pattern: "/blog/:slug",
    priority: 0.8,
    query: {
      content_type: "blogPost",
      select: "fields.slug",
    },
    params: {
      slug: "fields.slug",
    },
  },
]);

export const loader = () => {
  let sitemap;
  const smStream = new SitemapStream({ hostname: "https://maxrosenb.com/" });
  //   console.log("sm stream:");
  //   console.log(smStream);
  const pipeline = smStream.pipe(createGzip());
  //   console.log("Pipeline:");
  //   console.log(pipeline);
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const content = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
    <loc>https://www.maxrosenb.com/</loc>
    <lastmod>2022-07-09T00:15:16+01:00</lastmod>
    <priority>1.0</priority>
    </url>
    </urlset>
    `;
  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return sitemapGenerator.buildRoutes().then((routes) => {
    // console.log("routes:", routes);
    // console.log(routes);
    // pipe your entries or directly write them.
    routes.forEach((route) => smStream.write(route));
    smStream.end();

    // cache the response
    const result = streamToPromise(pipeline).then((sm) => {
      console.log("SM:");
      console.log(sm);
      sitemap = sm;
      console.log("sitemap:");
      console.log(sitemap);
      const res = new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
          "xml-version": "1.0",
          "Content-Encoding": "gzip",
        },
      });
      return res;
      console.log("RES:");
      console.log(res);
    });
    return result;
    // stream write the response

    // pipeline.pipe(res).on("error", (e) => {
    //   throw e;
    // });
  });
};
