import { useEffect } from 'react'

const DEFAULT_TITLE = 'Fixora - Hata Mesajlarını Türkçeleştir'
const DEFAULT_DESCRIPTION =
  'İngilizce hata mesajlarını Türkçe, sade ve uygulanabilir çözümlere dönüştüren yapay zekâ destekli geliştirici aracı.'

function getOrCreateMetaTag(name) {
  let tag = document.head.querySelector(`meta[name="${name}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  return tag
}

export function usePageMeta({ title, description, robots } = {}) {
  useEffect(() => {
    const previousTitle = document.title

    const descriptionTag = document.head.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') ?? null

    const robotsTag = document.head.querySelector('meta[name="robots"]')
    const previousRobots = robotsTag?.getAttribute('content') ?? null
    const hadRobotsTag = Boolean(robotsTag)

    if (title) {
      document.title = title
    }

    if (description !== undefined) {
      const tag = getOrCreateMetaTag('description')
      tag.setAttribute('content', description || DEFAULT_DESCRIPTION)
    }

    if (robots !== undefined) {
      const tag = getOrCreateMetaTag('robots')
      tag.setAttribute('content', robots)
    }

    return () => {
      document.title = previousTitle || DEFAULT_TITLE

      const currentDescriptionTag = document.head.querySelector('meta[name="description"]')
      if (currentDescriptionTag) {
        currentDescriptionTag.setAttribute('content', previousDescription || DEFAULT_DESCRIPTION)
      }

      const currentRobotsTag = document.head.querySelector('meta[name="robots"]')
      if (currentRobotsTag) {
        if (hadRobotsTag) {
          if (previousRobots) {
            currentRobotsTag.setAttribute('content', previousRobots)
          } else {
            currentRobotsTag.removeAttribute('content')
          }
        } else {
          currentRobotsTag.remove()
        }
      }
    }
  }, [title, description, robots])
}
