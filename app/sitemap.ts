import { MetadataRoute } from 'next'
import { locales } from '@/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://garts.gr'

  // Define all routes
  const routes = ['', '/software', '/sessions', '/bookings', '/about', '/contact']

  // Generate URLs for all locales
  const urls: MetadataRoute.Sitemap = []

  routes.forEach(route => {
    locales.forEach(locale => {
      // English uses root path (no /en), Greek uses /el
      const localePath = locale === 'en' ? '' : `/${locale}`

      urls.push({
        url: `${baseUrl}${localePath}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}${route}`,
            el: `${baseUrl}/el${route}`,
          }
        }
      })
    })
  })

  return urls
}
