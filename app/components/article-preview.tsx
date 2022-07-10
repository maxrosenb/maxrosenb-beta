import { motion } from "framer-motion";
import React from "react";
import { Link } from "remix";
import { ContentfulImage } from "~/components/contentful-image";
import { CssModuleWrapper } from "~/components/css-module-wrapper";
import { toReadableDate } from "~/utils/to-readable-date";
import { TypePostPreview } from "../../types/contentful-graphql-types";

import Container from "./container";
import Tags from "./tags";

type Props = {
  posts: TypePostPreview[];
};

const ArticlePreview: React.FC<Props> = ({ posts }) => {
  if (!posts) return null;
  if (!Array.isArray(posts)) return null;

  return (
    <CssModuleWrapper className={"article-module"}>
      <Container>
        <ul className={"article-list"}>
          {posts.map((post) => {
            return (
              <motion.div
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 1.05, transition: { duration: 0.5 } }}
              >
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className={"link"}
                    prefetch={"intent"}
                  >
                    <ContentfulImage
                      image={post.heroImage}
                      width={363}
                      height={212}
                      quality={50}
                      format={"webp"}
                      behaviour={"thumb"}
                    />
                    <h2 className={"title"}>{post.title}</h2>
                  </Link>
                  <section
                    dangerouslySetInnerHTML={{
                      __html: post.description,
                    }}
                  />
                  <section className={"meta"}>
                    <small className="meta">
                      {toReadableDate(post.publishDate)}
                    </small>
                    {post.tags && <Tags tags={post.tags} />}
                  </section>
                </li>
              </motion.div>
            );
          })}
        </ul>
      </Container>
    </CssModuleWrapper>
  );
};

export default ArticlePreview;
