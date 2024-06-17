import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import service from './src/appwrite/config.js';


const links = [
  { url: '/', changefreq: 'daily', priority: 0.9 },
  { url: '/addpost', changefreq: 'monthly', priority: 0.7 },
  { url: '/allpost', changefreq: 'weekly', priority: 0.8 },
  { url: '/login', changefreq: 'yearly', priority: 0.5 },
  { url: '/signup', changefreq: 'yearly', priority: 0.5 },
];

const generateSitemap = async() => {
  // Fetch dynamic routes (blog posts) from your API
  const posts = await service.getPosts([])
  posts.documents.forEach(post => {
    links.push({ url: `/post/${post.$id}`, changefreq: 'weekly', priority: 0.8 });
    links.push({ url: `/edit-post/${post.$id}`, changefreq: 'weekly', priority: 0.7 });
  });

  const stream = new SitemapStream({ hostname: 'https://codercorner.vercel.app' });
  const writeStream = createWriteStream('./public/sitemap.xml');
  
  streamToPromise(Readable.from(links).pipe(stream)).then(data => writeStream.end(data));

  console.log('Sitemap generated successfully.');
};

generateSitemap();
