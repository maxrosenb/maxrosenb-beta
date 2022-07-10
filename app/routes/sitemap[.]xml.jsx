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
  const smStream = new SitemapStream({ hostname: "https://maxrosenb.com/" });
  const pipeline = smStream.pipe(createGzip());

  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return sitemapGenerator.buildRoutes().then((routes) => {
    // pipe your entries or directly write them.
    routes.forEach((route) => smStream.write(route));
    smStream.end();

    // cache the response
    const result = streamToPromise(pipeline).then((sitemap) => {
      const res = new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
          "xml-version": "1.0",
          "Content-Encoding": "gzip",
        },
      });
      return res;
    });
    return result;
    // stream write the response

    pipeline.pipe(res).on("error", (e) => {
      throw e;
    });
  });
};
