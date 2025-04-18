export type SiteConfig = {
  title: string
  subtitle: string

  lang: string

  themeHue: number
  banner: {
    enable: boolean
    src: string
  }
}

export enum LinkPreset {
  Photography = 0,
  Home = 1,
  Archive = 2
}

export type NavBarLink = {
  name: string
  url: string
  external?: boolean
}

export type NavBarConfig = {
  links: (NavBarLink | LinkPreset)[]
}

export type ProfileConfig = {
  avatar?: string
  name: string
  bio?: string
  links: {
    name: string
    url: string
    icon: string
  }[]
}

export type LicenseConfig = {
  enable: boolean
  name: string
  url: string
}
