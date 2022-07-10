import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "remix";
import { client } from "~/client.server";
import ArticlePreview from "~/components/article-preview";
import Hero from "~/components/hero";
import {
  TypeAuthor,
  TypePostPreview,
} from "../../types/contentful-graphql-types";
import { motion } from "framer-motion";

type LoaderData = { posts: TypePostPreview[]; author: TypeAuthor };

export const loader: LoaderFunction = async ({}) => {
  return json({
    posts: await client.getPostCollection(),
    author: await client.getAuthor("1lUcIFh7NuiYBgq2d8Okgq"),
  });
};

const boxVariant = {
  visible: { opacity: 1, scale: 2 },
  hidden: { opacity: 0, scale: 0 },
};

export default function Index() {
  const { author, posts } = useLoaderData<LoaderData>();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-full md:col-span-3 sm:overflow-auto relative z-0"
      >
        <Hero
          image={author.image}
          title={author.name}
          content={author.shortBio}
        />
        <ArticlePreview posts={posts} />
      </motion.div>
    </>
  );
}
