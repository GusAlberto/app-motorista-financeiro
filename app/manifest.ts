import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'App Motorista',
    short_name: 'Motorista',
    description: 'Controle financeiro para motoristas de aplicativo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    lang: 'pt-BR',
    icons: [],
  }
}
