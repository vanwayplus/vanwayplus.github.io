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
  name: 'Yufan(Evan) Wei',
  bio: 'Easy come, easy go. | 运气来的若有似无',


  links: [
    {
      name: 'Mail',
      icon: 'material-symbols:mail',
      url: 'mailto:littlevanplus@gmail.com',
    },
    {
      name: 'Linkedin',
      icon: 'fa6-brands:linkedin',
      url: 'www.linkedin.com/in/evan-way',
    },
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
