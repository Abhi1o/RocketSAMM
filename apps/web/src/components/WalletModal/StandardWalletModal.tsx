import { UniswapWalletOptions } from 'components/WalletModal/UniswapWalletOptions'
import { WalletModalLayout } from 'components/WalletModal/WalletModalLayout'
import { WalletOptionsGrid } from 'components/WalletModal/WalletOptionsGrid'
import { useReducer } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ClickableTamaguiStyle } from 'theme/components/styles'
import { Flex, Separator, Text } from 'ui/src'
import { DoubleChevron } from 'ui/src/components/icons/DoubleChevron'
import { DoubleChevronInverted } from 'ui/src/components/icons/DoubleChevronInverted'

export function StandardWalletModal(): JSX.Element {
  const { t } = useTranslation()
  const [expandMoreWallets, toggleExpandMoreWallets] = useReducer((s) => !s, true)

  const header = (
    <Flex row justifyContent="space-between" width="100%">
      <Text variant="subheading2">{t('common.connectAWallet.button')}</Text>
    </Flex>
  )

  const uniswapOptions = <UniswapWalletOptions />

  const expandToggle = (
    <Flex row alignItems="center" py={8} userSelect="none" onPress={toggleExpandMoreWallets} {...ClickableTamaguiStyle}>
      
    </Flex>
  )

  const walletOptions = (
    <WalletOptionsGrid
      showMobileConnector={false}
      showOtherWallets={false}
      maxHeight={expandMoreWallets ? '100vh' : '0'}
      opacity={expandMoreWallets ? 1 : 0}
    />
  )

  return (
    <WalletModalLayout
      header={
        <Flex gap="$gap16">
          {header}
          {uniswapOptions}
          {expandToggle}
        </Flex>
      }
    >
      {walletOptions}
    </WalletModalLayout>
  )
}
