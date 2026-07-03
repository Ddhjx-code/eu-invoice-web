import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://eu-invoice-web.vercel.app'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/de`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/fr`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/invoice/new`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
