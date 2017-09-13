import Endpoint from './Endpoint'
import { reduce } from 'lodash'
import PropTypes from 'prop-types'
import PageModel from './models/PageModel'
import { isEmpty } from 'lodash/lang'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'disclaimer',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since={since}',
  optionsPropType: PropTypes.shape({}),
  jsonToAny: (json) => {
    if (!json || isEmpty(json)) {
      throw new Error('disclaimer.notAvailable')
    }
    return reduce(json, (result, page) => {
      if (page.status !== 'publish') {
        return result
      }

      const id = page.permalink.url_page.split('/').pop()
      const numericId = page.id

      return new PageModel(
        id,
        numericId,
        page.title,
        page.parent,
        page.content,
        page.thumbnail
      )
    }, null)
  },
  mapStateToOptions: (state) => ({language: state.router.params.language, location: state.router.params.location}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
