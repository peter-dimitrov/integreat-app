// @flow

import reducers, { finishFetchReducer, startFetchReducer } from '../'
import startFetchAction from '../../actions/startFetchAction'
import Payload from '../../Payload'
import lolex from 'lolex'
import finishFetchAction from '../../actions/finishFetchAction'

describe('endpoint reducers', () => {
  let clock

  beforeEach(() => {
    clock = lolex.install({now: 42})
  })

  afterEach(() => {
    clock.uninstall()
  })

  describe('start fetch reducer', () => {
    it('should return the action payload', () => {
      const action = startFetchAction('endpoint', 'https://url.com')
      expect(startFetchReducer(new Payload(true), action)).toEqual(action.payload)
    })
  })

  describe('finish fetch reducer', () => {
    it('should return the action payload if the old payload was a fetching payload with the same url', () => {
      type SomeType = { someType: string }
      const oldPayload = new Payload<SomeType>(true, 'https://url.com')
      const payload = new Payload<SomeType>(false, 'https://url.com', {someType: 'someValue'}, null)
      const action = finishFetchAction<SomeType>('endpoint', payload)
      expect(finishFetchReducer<SomeType>(oldPayload, action)).toEqual(action.payload)
    })

    it('should return the old payload if the old payload was not a fetching payload', () => {
      // this happens if two fetches are initiated and the first one finishes after the second one,
      // in which case we want to keep the data of the second fetch
      const oldPayload = new Payload(false, 'https://url.com', {}, null)
      const payload = new Payload(false, 'https://url.com', {}, null)
      const action = finishFetchAction('endpoint', payload)
      expect(finishFetchReducer(oldPayload, action)).toEqual(oldPayload)
    })

    it('should return the old payload if the url has changed', () => {
      // this happens if two fetches are initiated and the first one finishes after the second one was initiated,
      // in which case we don't want to store the data of the first fetch
      const oldPayload = new Payload(true, 'https://newUrl.com', {}, null)
      const payload = new Payload(false, 'https://url.com', {}, null)
      const action = finishFetchAction('endpoint', payload)
      expect(finishFetchReducer(oldPayload, action)).toEqual(oldPayload)
    })
  })

  describe('reducers', () => {
    it('should reduce cities fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.cities !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.cities
      expect(reducer(undefined, startFetchAction('cities', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('cities', payload))).toEqual(payload)
    })

    it('should reduce languages fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.languages !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.languages
      expect(reducer(undefined, startFetchAction('languages', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('languages', payload))).toEqual(payload)
    })

    it('should reduce disclaimer fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.disclaimer !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.disclaimer
      expect(reducer(undefined, startFetchAction('disclaimer', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('disclaimer', payload))).toEqual(payload)
    })

    it('should reduce events fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.events !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.events
      expect(reducer(undefined, startFetchAction('events', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('events', payload))).toEqual(payload)
    })

    it('should reduce extras fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.extras !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.extras
      expect(reducer(undefined, startFetchAction('extras', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('extras', payload))).toEqual(payload)
    })

    it('should reduce categories fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.categories !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.categories
      expect(reducer(undefined, startFetchAction('categories', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('categories', payload))).toEqual(payload)
    })

    it('should reduce sprungbrettJobs fetch actions', () => {
      const payload = new Payload(false, 'http://example.com', 'data', null)
      if (typeof reducers.sprungbrettJobs !== 'function') {
        return expect(true).toBe(false)
      }
      const reducer: Function = reducers.sprungbrettJobs
      expect(reducer(undefined, startFetchAction('sprungbrettJobs', 'http://example.com'))).toEqual(new Payload(true, 'http://example.com'))
      expect(reducer(new Payload(true, 'http://example.com'), finishFetchAction('sprungbrettJobs', payload))).toEqual(payload)
    })
  })
})
