import { LinkPreset, type NavBarLink } from '@/types/config'
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
  [LinkPreset.Home]: {
    name: i18n(I18nKey.home),
    url: '/',
    icon: 'material-symbols:home-outline-rounded',
  },
  [LinkPreset.Photography]: {
    name: i18n(I18nKey.about),
    url: '/photography',
    icon: 'fa6-solid:camera',
  },
  [LinkPreset.Archive]: {
    name: i18n(I18nKey.archive),
    url: '/archive',
    icon: 'fa6-solid:box-archive',
  },
}
