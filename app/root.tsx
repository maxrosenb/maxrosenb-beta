import React from "react";
import type { MetaFunction } from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import Footer from "~/components/footer";
import { AnimatePresence } from "framer-motion";
import Navigation from "~/components/navigation";

import variablesStyles from "~/styles/variables.css";
import globalStyles from "~/styles/global.css";
import footerStyles from "~/styles/modules/footer.module.css";
import heroStyles from "~/styles/modules/hero.module.css";
import navigationStyles from "~/styles/modules/navigation.module.css";
import tagsStyles from "~/styles/modules/tags.module.css";
import articlePreviewStyles from "~/styles/modules/article-preview.module.css";

export const links = () => [
  { rel: "stylesheet", href: variablesStyles },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: navigationStyles },
  { rel: "stylesheet", href: footerStyles },
  { rel: "stylesheet", href: heroStyles },
  { rel: "stylesheet", href: tagsStyles },
  { rel: "stylesheet", href: articlePreviewStyles },
];

export const meta: MetaFunction = ({ parentsData, params }) => {
  const description =
    "A coding blog focusing on web development, design, and React.";
  const content = "default description";
  const keywords =
    "Contentful, Blog, Starter, Remix, React, TypeScript, JavaScript, Design, Web Development";
  const title = "Max Rosenberg's Tech Blog";

  return {
    title,
    description,
    keywords,

    "og:title": title,
    "og:description": description,
    "og:type": `website`,

    "twitter:title": title,
    "twitter:description": description,
  };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5894276300652245"
          crossorigin="anonymous"
        ></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />

        <Meta />
        <Links />
      </head>
      <body>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5894276300652245"
          crossorigin="anonymous"
        ></script>
        <Navigation />
        <main>
          <AnimatePresence exitBeforeEnter>
            <Outlet />
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
