/**
 * Writing — links to the three blogspot essays plus "All posts →".
 * Framed as personal essays, not technical posts. Verified by verify:links.
 */

export interface Post {
  readonly title: string;
  readonly url: string;
  readonly year: string;
  /** One-line framing in Aaditya's own voice. */
  readonly blurb: string;
}

export const posts: readonly Post[] = [
  {
    title: 'Differences',
    url: 'https://aadityasapkota.blogspot.com/2024/03/differences.html',
    year: '2024',
    blurb:
      'On whether you would rather have an imperfect person willing to grow with you, or a perfect one who is ignorant of others.',
  },
  {
    title: "Don't miss anything!",
    url: 'https://aadityasapkota.blogspot.com/2024/03/dont-miss-anything.html',
    year: '2024',
    blurb:
      "A note to myself about living each moment fully, instead of acting like there's a thousand years to spare.",
  },
  {
    title: 'My First Blog',
    url: 'https://aadityasapkota.blogspot.com/2022/05/my-experience-in-creating-my-first-blog.html',
    year: '2022',
    blurb: 'The first thing I ever published — on the excitement of writing for a new audience.',
  },
] as const;

export const allPostsUrl = 'https://aadityasapkota.blogspot.com/';
