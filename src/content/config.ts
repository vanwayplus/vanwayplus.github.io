import { defineCollection, z } from 'astro:content'

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    draft: z.boolean().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    // How the card cover thumbnail fits its frame: 'cover' (fill + crop, best
    // for photos, default) or 'contain' (show the whole image on a panel, best
    // for wide diagrams/figures so nothing is truncated).
    coverFit: z.enum(['cover', 'contain']).optional(),
    // Hide the published date on the post card and header (still used for
    // archive ordering). Useful for undated photo sets.
    hideDate: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
  }),
})
export const collections = {
  posts: postsCollection,
}
