import { CreditCardIcon } from 'components/Icons/CreditCard'
import { Limit } from 'components/Icons/Limit'
import { SwapV2 } from 'components/Icons/SwapV2'
import { MenuItem } from 'components/NavBar/CompanyMenu/Content'
import { useTheme } from 'lib/styled-components'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { CoinConvert } from 'ui/src/components/icons/CoinConvert'
import { Compass } from 'ui/src/components/icons/Compass'
import { Pools } from 'ui/src/components/icons/Pools'
import { ReceiveAlt } from 'ui/src/components/icons/ReceiveAlt'
import { Wallet } from 'ui/src/components/icons/Wallet'
import { FeatureFlags } from 'uniswap/src/features/gating/flags'
import { useFeatureFlag } from 'uniswap/src/features/gating/hooks'

export type TabsSection = {
  title: string
  href: string
  isActive?: boolean
  items?: TabsItem[]
  closeMenu?: () => void
  icon?: JSX.Element
}

export type TabsItem = MenuItem & {
  icon?: JSX.Element
}

export const useTabsContent = (): TabsSection[] => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const theme = useTheme()
  const isFiatOffRampEnabled = useFeatureFlag(FeatureFlags.FiatOffRamp)
  const isPortfolioPageEnabled = useFeatureFlag(FeatureFlags.PortfolioPage)
  const isToucanEnabled = useFeatureFlag(FeatureFlags.Toucan)

  return [
    {
      title: t('common.swap'),
      href: '/swap',
      isActive: pathname.startsWith('/swap') || pathname.startsWith('/limit') || pathname.startsWith('/send'),
      icon: <CoinConvert color="$accent1" size="$icon.20" />,
      
    },
    
    {
      title: t('common.pool'),
      href: '/positions',
      isActive: pathname.startsWith('/positions'),
      icon: <Pools color="$accent1" size="$icon.20" />,
      items: [
        {
          label: t('nav.tabs.viewPositions'),
          href: '/positions',
          internal: true,
        },
        {
          label: t('nav.tabs.createPosition'),
          href: '/positions/create',
          internal: true,
        },
      ],
    },
    ...(isPortfolioPageEnabled
      ? [
          {
            title: t('common.portfolio'),
            href: '/portfolio',
            isActive: pathname.startsWith('/portfolio'),
            icon: <Wallet color="$accent1" size="$icon.20" />,
            items: [
              {
                label: t('portfolio.overview.title'),
                href: '/portfolio',
                internal: true,
              },
              {
                label: t('portfolio.tokens.title'),
                href: '/portfolio/tokens',
                internal: true,
              },
              {
                label: t('portfolio.defi.title'),
                href: '/portfolio/defi',
                internal: true,
              },
              {
                label: t('portfolio.nfts.title'),
                href: '/portfolio/nfts',
                internal: true,
              },
              {
                label: t('portfolio.activity.title'),
                href: '/portfolio/activity',
                internal: true,
              },
            ],
          },
        ]
      : []),
  ]
}
