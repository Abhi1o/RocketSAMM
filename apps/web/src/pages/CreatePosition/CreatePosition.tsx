import { ProtocolVersion } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import type { Currency } from '@uniswap/sdk-core'
import { DynamicFeeTierSpeedbump } from 'components/Liquidity/Create/DynamicFeeTierSpeedbump'
import { FormStepsWrapper, FormWrapper } from 'components/Liquidity/Create/FormWrapper'
import { useLiquidityUrlState } from 'components/Liquidity/Create/hooks/useLiquidityUrlState'
import { useLPSlippageValue } from 'components/Liquidity/Create/hooks/useLPSlippageValues'
import ResetCreatePositionFormModal from 'components/Liquidity/Create/ResetCreatePositionsFormModal'
import { PositionFlowStep } from 'components/Liquidity/Create/types'
import { FeeTierSearchModal } from 'components/Liquidity/FeeTierSearchModal'
import { LPSettings } from 'components/LPSettings'

import {
  CreateLiquidityContextProvider,
  useCreateLiquidityContext,
} from 'pages/CreatePosition/CreateLiquidityContextProvider'
import { CreatePositionTxContextProvider } from 'pages/CreatePosition/CreatePositionTxContext'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MultichainContextProvider } from 'state/multichain/MultichainContext'
import { useMultichainContext } from 'state/multichain/useMultichainContext'
import { Button, Flex, styled, Text } from 'ui/src'
import { RotateLeft } from 'ui/src/components/icons/RotateLeft'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { InterfacePageName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { Deadline } from 'uniswap/src/features/transactions/components/settings/settingsConfigurations/deadline/Deadline/Deadline'
import { Slippage } from 'uniswap/src/features/transactions/components/settings/settingsConfigurations/slippage/Slippage/Slippage'
import { LPTransactionSettingsStoreContextProvider } from 'uniswap/src/features/transactions/components/settings/stores/transactionSettingsStore/LPTransactionSettingsStoreContextProvider'
import { useTransactionSettingsStore } from 'uniswap/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { usePrevious } from 'utilities/src/react/hooks'

function CreatePositionInner({
  currencyInputs,
  setCurrencyInputs,
}: {
  currencyInputs: { tokenA: Maybe<Currency>; tokenB: Maybe<Currency> }
  setCurrencyInputs: Dispatch<SetStateAction<{ tokenA: Maybe<Currency>; tokenB: Maybe<Currency> }>>
}) {
  const {
    positionState: { protocolVersion },
    creatingPoolOrPair,
    step,
    setStep,
  } = useCreateLiquidityContext()
  const v2Selected = protocolVersion === ProtocolVersion.V2

  const handleContinue = useCallback(() => {
    if (v2Selected) {
      if (step === PositionFlowStep.SELECT_TOKENS_AND_FEE_TIER && creatingPoolOrPair) {
        setStep(PositionFlowStep.PRICE_RANGE)
      } else {
        setStep(PositionFlowStep.DEPOSIT)
      }
    } else {
      setStep(step + 1)
    }
  }, [creatingPoolOrPair, step, v2Selected, setStep])

  return (
    <FormStepsWrapper
      currencyInputs={currencyInputs}
      setCurrencyInputs={setCurrencyInputs}
      onSelectTokensContinue={handleContinue}
    />
  )
}

interface ResetProps {
  onClickReset: () => void
  isDisabled: boolean
}

const ResetButton = ({ onClickReset, isDisabled }: ResetProps) => {
  const { t } = useTranslation()
  return (
    <Button size="small" emphasis="tertiary" onPress={onClickReset} isDisabled={isDisabled} icon={<RotateLeft />}>
      {t('common.button.reset')}
    </Button>
  )
}

const ToolbarContainer = styled(Flex, {
  row: true,
  centered: true,
  gap: '$gap8',
  $md: {
    '$platform-web': {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gridColumnGap: '8px',
    },
  },
})

const Toolbar = () => {
  const { t } = useTranslation()
  const {
    isNativeTokenAOnly,
    reset: resetCreatePositionState,
    resetPriceRange: resetPriceRangeState,
    resetDeposit: resetDepositState,
  } = useCreateLiquidityContext()
  const customSlippageTolerance = useTransactionSettingsStore((s) => s.customSlippageTolerance)

  const [showResetModal, setShowResetModal] = useState(false)

  const { reset: resetMultichainState } = useMultichainContext()

  const { isTestnetModeEnabled } = useEnabledChains()
  const prevIsTestnetModeEnabled = usePrevious(isTestnetModeEnabled) ?? false

  const handleReset = useCallback(() => {
    resetCreatePositionState()
    resetPriceRangeState()
    resetMultichainState()
    resetDepositState()
  }, [resetDepositState, resetCreatePositionState, resetMultichainState, resetPriceRangeState])

  useEffect(() => {
    if (isTestnetModeEnabled !== prevIsTestnetModeEnabled) {
      handleReset()
    }
  }, [handleReset, isTestnetModeEnabled, prevIsTestnetModeEnabled])

  return (
    <Flex>
      <ResetCreatePositionFormModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onHandleReset={handleReset}
      />

      <ToolbarContainer>
        <ResetButton onClickReset={() => setShowResetModal(true)} isDisabled={isNativeTokenAOnly} />
        <Flex
          borderRadius="$rounded12"
          borderWidth="$spacing1"
          borderColor="$surface3"
          py="$spacing8"
          px="$spacing12"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="buttonLabel3" lineHeight="16px" whiteSpace="nowrap">
            {t('position.protocol', { protocol: 'v2' })}
          </Text>
        </Flex>
        <Flex
          borderRadius="$rounded12"
          borderWidth={!customSlippageTolerance ? '$spacing1' : '$none'}
          borderColor="$surface3"
          height="38px"
          px={!customSlippageTolerance ? '$gap8' : '$gap4'}
          alignItems="center"
          pt="$spacing2"
        >
          <LPSettings
            position="relative"
            adjustRightAlignment={false}
            adjustTopAlignment={false}
            settings={[Slippage, Deadline]}
            iconColor="$neutral1"
            iconSize="$icon.16"
          />
        </Flex>
      </ToolbarContainer>
    </Flex>
  )
}

export const SharedCreateModals = () => {
  return (
    <>
      <FeeTierSearchModal />
      <DynamicFeeTierSpeedbump />
    </>
  )
}

function CreatePositionContent({
  initialInputs,
  autoSlippageTolerance,
}: {
  initialInputs: ReturnType<typeof useLiquidityUrlState>
  autoSlippageTolerance: number
}) {
  // Always use V2 as the default and only protocol version
  const initialProtocolVersion = ProtocolVersion.V2

  const [currencyInputs, setCurrencyInputs] = useState<{ tokenA: Maybe<Currency>; tokenB: Maybe<Currency> }>({
    tokenA: initialInputs.tokenA,
    tokenB: initialInputs.tokenB,
  })

  return (
    <Trace logImpression page={InterfacePageName.CreatePosition}>
      <MultichainContextProvider initialChainId={initialInputs.chainId}>
        <LPTransactionSettingsStoreContextProvider autoSlippageTolerance={autoSlippageTolerance}>
          <CreateLiquidityContextProvider
            currencyInputs={currencyInputs}
            setCurrencyInputs={setCurrencyInputs}
            initialPositionState={{
              fee: initialInputs.fee,
              hook: initialInputs.hook ?? undefined,
              protocolVersion: initialProtocolVersion,
            }}
            defaultInitialToken={initialInputs.defaultInitialToken}
            initialPriceRangeState={initialInputs.priceRangeState}
            initialDepositState={initialInputs.depositState}
            initialFlowStep={initialInputs.flowStep}
          >
            <CreatePositionTxContextProvider>
              <FormWrapper toolbar={<Toolbar />}>
                <CreatePositionInner currencyInputs={currencyInputs} setCurrencyInputs={setCurrencyInputs} />
              </FormWrapper>
              <SharedCreateModals />
            </CreatePositionTxContextProvider>
          </CreateLiquidityContextProvider>
        </LPTransactionSettingsStoreContextProvider>
      </MultichainContextProvider>
    </Trace>
  )
}

export default function CreatePosition() {
  // Always use V2 protocol version
  const autoSlippageTolerance = useLPSlippageValue({
    version: ProtocolVersion.V2,
  })

  const initialInputs = useLiquidityUrlState()

  if (initialInputs.loading) {
    return null
  }

  return (
    <CreatePositionContent
      initialInputs={initialInputs}
      autoSlippageTolerance={autoSlippageTolerance}
    />
  )
}
