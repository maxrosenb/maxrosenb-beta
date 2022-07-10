import { BLOCKS, Document } from "@contentful/rich-text-types";
import { useLoaderData } from "@remix-run/react";
import * as React from "react";
import { json, LinksFunction, LoaderFunction, MetaFunction } from "remix";
import { client } from "~/client.server";
import Hero from "~/components/hero";
import Tags from "~/components/tags";
import { readingTime } from "~/utils/raeading-time";
import { richTextFromMarkdown } from "~/utils/rich-text-from-markdown";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { toReadableDate } from "~/utils/to-readable-date";
import { useReactComponentFromDocument } from "~/utils/use-react-component-from-document";
import { TypePostDetail } from "../../types/contentful-graphql-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { MARKS } from "@contentful/rich-text-types";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  obsidian,
  tomorrowNightBlue,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import blogPostStyles from "../styles/blog-post.page.css";
import { ContentfulImage } from "~/components/contentful-image";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: blogPostStyles },
];

type LoaderData = { post: TypePostDetail; body: Document; timeToRead: number };

export const loader: LoaderFunction = async ({ params }) => {
  const post = await client.getPost(params.post!);
  const bodyString = post.body || "";
  const body = await richTextFromMarkdown(post.body || "");
  return json({
    post,
    body,
    timeToRead: Math.ceil(readingTime(bodyString).minutes),
  });
};

export const meta: MetaFunction = ({ parentsData, params, data, location }) => {
  const post: TypePostDetail = data.post;
  const description = post.description;
  const image = post.heroImage.url;
  const title = post.title;

  return {
    title: title,
    image: image,
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "twitter:title": title,
    "twitter:description": description,
  };
};

export default function BlogPost() {
  const { post, body, timeToRead } = useLoaderData<LoaderData>();
  const document = useReactComponentFromDocument(body);

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (
        node: { content: string | any[] },
        children: {} | null | undefined
      ) => {
        if (
          node.content.length === 1 &&
          node.content[0].marks.find((x) => x.type === "code")
        ) {
          return <div>{children}</div>;
        }
        return <p>{children}</p>;
      },
    },
    renderMark: {
      [MARKS.CODE]: (text) => {
        return (
          <SyntaxHighlighter
            language="javascript"
            style={tomorrowNightBlue}
            showLineNumbers
          >
            {text}
          </SyntaxHighlighter>
        );
      },
    },
  };

  const image = post.author?.profilepic;

  return (
    <article className={"blog-post"}>
      <Hero
        image={post.heroImage}
        title={post.title}
        content={post.description}
      />
      <div className={"container"}>
        <span className={"meta"}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",

              alignItems: "center",
            }}
          >
            {post.author?.profilepic && (
              <div className="figureContainer">
                <figure className={"image"}>
                  <picture>
                    <div>
                      <img
                        src={image.url}
                        alt={image.title}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                        }}
                      />{" "}
                    </div>
                  </picture>
                </figure>
              </div>
            )}
            {post.author?.name} &middot;{" "}
            <time dateTime={post.publishDate} style={{ marginLeft: "6px" }}>
              {toReadableDate(post.publishDate)}
            </time>{" "}
          </div>
        </span>

        <div className={"article"}>
          <div className={"body"}>
            {/* @ts-ignore */}
            {documentToReactComponents(post.content.json, options)}
          </div>

          {document}
          {/* @ts-ignore */}
          <Tags tags={post.tags} />
        </div>
      </div>
    </article>
  );
}
