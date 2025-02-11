import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SadSmileyIcon, NoteIcon, HappySmileyIcon } from '../assets'
import dimensions from '../constants/dimensions'
import { SendingState } from './FeedbackContainer'
import TextInput from './TextInput'
import Icon from './base/Icon'
import TextButton from './base/TextButton'
import ToggleButton from './base/ToggleButton'

export const Container = styled.div`
  display: flex;
  flex: 1;
  max-height: 80vh;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  border-radius: 10px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  font-size: ${props => props.theme.fonts.contentFontSize};
  overflow: auto;
  align-self: center;
  @media ${dimensions.mediumLargeViewport} {
    width: 400px;
  }
`

const CommentField = styled.textarea`
  margin-top: 8px;
  resize: none;
  min-height: 60px;
`

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px;
`

export const Description = styled.label`
  font-weight: 700;
`

export const ErrorSendingStatus = styled.div`
  padding: 10px 0 5px;
  font-weight: 700;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  gap: 16px;
`

const NoteContainer = styled.div<{ showContainer: boolean }>`
  display: flex;
  margin-top: 12px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 12px;
  opacity: ${props => (props.showContainer ? 1 : 0)};
`

const NoteText = styled.span`
  margin-left: 12px;
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
`

type FeedbackProps = {
  isPositiveFeedback: boolean | null
  isSearchFeedback: boolean
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  onFeedbackChanged: (isPositiveFeedback: boolean | null) => void
  onSubmit: () => void
  sendingStatus: SendingState
}

const Feedback = (props: FeedbackProps): ReactElement => {
  const {
    isPositiveFeedback,
    isSearchFeedback,
    comment,
    contactMail,
    sendingStatus,
    onSubmit,
    onCommentChanged,
    onContactMailChanged,
    onFeedbackChanged,
  } = props
  const { t } = useTranslation('feedback')

  const description = isSearchFeedback ? 'wantedInformation' : 'commentHeadline'
  const sendFeedbackDisabled = isPositiveFeedback === null && comment.trim().length === 0

  return (
    <Container>
      <TextContainer>
        <div>{t('description')}</div>
      </TextContainer>
      <ButtonContainer>
        <ToggleButton
          onClick={() => onFeedbackChanged(isPositiveFeedback ? null : true)}
          active={isPositiveFeedback === true}
          icon={HappySmileyIcon}
          text={t('useful')}
        />
        <ToggleButton
          onClick={() => onFeedbackChanged(isPositiveFeedback === false ? null : false)}
          active={isPositiveFeedback === false}
          icon={SadSmileyIcon}
          text={t('notUseful')}
        />
      </ButtonContainer>
      <TextContainer>
        <Description htmlFor='comment'>{t(description)}</Description>
        <div>({t('optionalInfo')})</div>
      </TextContainer>
      <TextContainer>
        <div>{t('commentDescription')}</div>
      </TextContainer>
      <CommentField id='comment' rows={7} value={comment} onChange={event => onCommentChanged(event.target.value)} />
      <TextContainer>
        <Description htmlFor='email'>{t('contactMailAddress')}</Description>
        <div>({t('optionalInfo')})</div>
      </TextContainer>
      <TextInput
        id='email'
        type='email'
        onChange={event => onContactMailChanged(event.target.value)}
        value={contactMail}
      />

      {sendingStatus === SendingState.ERROR && (
        <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>
      )}

      <NoteContainer showContainer={sendFeedbackDisabled}>
        <Icon src={NoteIcon} />
        <NoteText>{t('note')}</NoteText>
      </NoteContainer>

      <TextButton disabled={sendFeedbackDisabled} onClick={onSubmit} text={t('send')} />
    </Container>
  )
}

export default Feedback
