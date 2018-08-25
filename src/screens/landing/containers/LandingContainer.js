// @flow

import * as React from 'react'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import { Text } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { ScrollView } from 'react-native'
import Heading from '../components/Heading'
import styled, { withTheme } from 'styled-components'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from '../../../modules/layout/constants/theme'
import { translate } from 'react-i18next'

const Wrapper = styled.View`
  padding-top: 22px;
`

type PropType = {
  language: string,
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  theme: ThemeType
}

type StateType = {
  data: Array<CityModel> | null
}

/**
 * This shows the landing screen. This is a container because it depends on endpoints.
 */
class LandingContainer extends React.Component<PropType, StateType> {
  constructor () {
    super()
    this.state = {data: null}
  }

  async fetchData (): void {
    const payload = await citiesEndpoint.loadData({language: 'de'})
    console.log(payload)
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({data: payload.data})
  }

  componentDidMount () {
    this.fetchData()
  }

  render () {
    if (!this.state.data) {
      return <Text>Test</Text>
    }

    return <ScrollView>
      <Wrapper>
        <Heading />
        <FilterableCitySelector theme={this.props.theme} language={'de'} cities={this.state.data} t={this.props.t}/>
      </Wrapper>
    </ScrollView>
  }
}

export default withTheme(translate('landing')(LandingContainer))
