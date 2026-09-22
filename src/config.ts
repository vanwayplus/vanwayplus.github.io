import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Yufan Wei',
  subtitle: 'Welcome to my personal website',
  lang: 'en',
  themeHue: 40,
  banner: {
    enable: false,
    src: 'assets/images/banner.jpg',
  },
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Photography,
    LinkPreset.Archive,
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/000002.jpg',
  name: 'Yufan(Evan) Wei',
  bio: '運氣來的若有似無',
  links: [
    {
      name: 'Mail',
      icon: 'material-symbols:mail',
      url: 'mailto:littlevanplus@gmail.com',
    },
    {
      name: 'Linkedin',
      icon: 'fa6-brands:linkedin',
      url: 'https://www.linkedin.com/in/evan-way',
    },
    {
      name: 'Scholar',
      icon: 'fa6-solid:graduation-cap',
      url: 'https://scholar.google.com/citations?user=082Jf5IAAAAJ&hl=zh-CN',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: false,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
