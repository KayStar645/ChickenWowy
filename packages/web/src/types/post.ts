export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText: string | null;
      width: number;
      height: number;
    };
  } | null;
}

export interface PostAttributes {
  title: string;
  slug: string;
  content: string;
  cover: StrapiMedia;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface PostEntity {
  id: number;
  attributes: PostAttributes;
}
