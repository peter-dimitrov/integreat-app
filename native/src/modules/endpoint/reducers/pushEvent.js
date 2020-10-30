// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel } from '@integreat-app/integreat-api-client'
import ErrorCodes from '../../error/ErrorCodes'

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const { events, path, key, language, resourceCache, cityLanguages, city } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  const getEventRoute = (): EventRouteStateType => {
    // Check whether another page in the same city is loading, e.g. because it is being refreshed.
    // This is important for displaying the loading spinner.
    const otherEventPageLoading = Object.values(state.eventsRouteMapping)
      .filter(route => city === route.city && path !== route.path && language === route.language)
      .some(route => route.status === 'loading')
    if (!path) {
      const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
      return {
        status: otherEventPageLoading ? 'loading' : 'ready',
        path: null,
        models: events,
        allAvailableLanguages,
        language,
        city
      }
    }
    const event: ?EventModel = events.find(event => event.path === path)
    if (!event) {
      return {
        path: path,
        language,
        city,
        status: 'error',
        message: `Could not find an event with path '${path}'.`,
        code: ErrorCodes.PageNotFound
      }
    }

    const allAvailableLanguages = new Map(event.availableLanguages)
    allAvailableLanguages.set(language, path)
    return {
      status: otherEventPageLoading ? 'loading' : 'ready',
      path,
      models: [event],
      allAvailableLanguages,
      language,
      city
    }
  }

  return {
    ...state,
    eventsRouteMapping: {
      ...state.eventsRouteMapping,
      [key]: getEventRoute()
    },
    resourceCache: {
      status: 'ready',
      value: newResourceCache
    }
  }
}

export default pushEvent
