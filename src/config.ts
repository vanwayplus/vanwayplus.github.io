import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Evan Wei',
  subtitle: 'Welcome to my personal website',
  lang: 'en',
  themeHue: 250,
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

    // {
    //   name: 'GitHub',
    //   url: 'https://github.com/saicaca/fuwari',
    //   external: true,
    // },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/emoji.jpg',
  name: 'Evan(Yufan) Wei',
  bio: 'Luck drifts by like a whisper on the wind. | 运气来的若有似无  ',


  links: [
    {
      name: 'Mail',
      icon: 'material-symbols:mail',
      url: 'mailto:littlevanplus@gmail.com',
    },
    // {
    //   name: 'Xiaohongshu',
    //   icon: 'fa6-brands:steam',
    //   url: 'https://store.steampowered.com',
    // },
    // {
    //   name: 'GitHub',
    //   icon: 'fa6-brands:github',
    //   url: 'https://github.com/saicaca/fuwari',
    // },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: false,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
