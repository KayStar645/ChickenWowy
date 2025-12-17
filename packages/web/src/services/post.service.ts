import { fetchStrapi } from "@/lib/strapi";
import { StrapiResponse } from "@/types/strapi";
import { PostEntity } from "@/types/post";

export function getPosts() {
  return fetchStrapi<StrapiResponse<PostEntity>>(
    "/api/posts",
    {
      populate: ["cover"],
      sort: ["publishedAt:desc"],
    },
    {
      revalidate: 60,
    }
  );
}

export async function getPostBySlug(slug: string) {
  const res = await fetchStrapi<StrapiResponse<PostEntity>>(
    "/api/posts",
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: ["cover"],
    },
    {
      cache: "no-store",
    }
  );

  return res.data[0] ?? null;
}
