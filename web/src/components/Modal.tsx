import FocusTrap from 'focus-trap-react'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useScrollToTop from '../hooks/useScrollToTop'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { LAYOUT_ELEMENT_ID, RichLayout } from './Layout'
import ModalContent from './ModalContent'
import Portal from './Portal'

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.9;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundColor};

  @media ${dimensions.smallViewport} {
    height: 100%;
    align-items: center;
    width: 100%;
  }
`

type ModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
  direction: UiDirectionType
  wrapInPortal?: boolean
}

const Modal = ({ title, closeModal, children, direction, wrapInPortal = false }: ModalProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('common')
  useScrollToTop()
  useLockedBody(true)

  useEffect(() => {
    const layoutElement = document.getElementById(LAYOUT_ELEMENT_ID)
    layoutElement?.setAttribute('aria-hidden', 'true')

    return () => layoutElement?.setAttribute('aria-hidden', 'false')
  }, [])

  const Modal = (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal>
        <Overlay onClick={closeModal} role='button' tabIndex={0} onKeyPress={closeModal} aria-label={t('close')} />
        <ModalContentContainer>
          <ModalContent title={title} closeModal={closeModal} small={viewportSmall}>
            {children}
          </ModalContent>
        </ModalContentContainer>
      </ModalContainer>
    </FocusTrap>
  )

  if (wrapInPortal) {
    return (
      <Portal className='modal' show>
        <RichLayout>
          <div dir={direction}>{Modal}</div>
        </RichLayout>
      </Portal>
    )
  }

  return Modal
}

export default Modal
