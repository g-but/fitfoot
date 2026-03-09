export interface SocialMediaLink {
  name: string
  url: string
  icon: 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  ariaLabel: string
  hoverColor: string
}

export const socialMediaLinks: SocialMediaLink[] = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Fitfoot/61577757242115/',
    icon: 'facebook',
    ariaLabel: 'Follow us on Facebook',
    hoverColor: 'hover:text-blue-600'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/fitfoot15/',
    icon: 'instagram',
    ariaLabel: 'Follow us on Instagram',
    hoverColor: 'hover:text-pink-600'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@fitfoot67',
    icon: 'tiktok',
    ariaLabel: 'Follow us on TikTok',
    hoverColor: 'hover:text-black'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@FitfootMode',
    icon: 'youtube',
    ariaLabel: 'Subscribe to our YouTube channel',
    hoverColor: 'hover:text-red-600'
  }
]
