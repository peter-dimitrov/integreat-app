import moment from 'moment'
import React from 'react'

import { CategoryModel } from 'api-client'

import iconPlaceholder from '../../assets/IconPlaceholder.svg'
import { renderWithRouterAndTheme } from '../../testing/render'
import CategoryEntry from '../CategoryEntry'

const categoryParams = {
  root: false,
  path: '/augsburg/de/lorem-ipsum',
  title: 'Duis aute',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([
    ['en', '4861'],
    ['ar', '4867'],
    ['fa', '4868'],
  ]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
}

const category = new CategoryModel(categoryParams)
const categoryWithDifferentName = new CategoryModel({ ...categoryParams, title: 'Willkommen' })
const childCategory = new CategoryModel({
  ...categoryParams,
  path: '/augsburg/de/lorem-ipsum/test',
  title: 'Child',
  parentPath: '/augsburg/de/lorem-ipsum',
})
const noThumbCategory = new CategoryModel({ ...categoryParams, thumbnail: '' })

describe('CategoryEntry', () => {
  it('should render correctly', () => {
    const { getByText, getByRole, getByLabelText, queryAllByText } = renderWithRouterAndTheme(
      <CategoryEntry category={category} subCategories={[childCategory]} />
    )

    expect(getByLabelText(category.title)).toBeTruthy()
    expect(getByText(category.title).closest('a')).toHaveProperty('href', `http://localhost${category.path}`)
    expect(getByRole('img')).toHaveProperty('src', category.thumbnail)

    expect(getByLabelText(childCategory.title)).toBeTruthy()
    expect(getByText(childCategory.title).closest('a')).toHaveProperty('href', `http://localhost${childCategory.path}`)

    const regex = /.+/
    const texts = queryAllByText(regex)
    // Only category.title and childCategory.title, nothing split up because of highlighting
    expect(texts).toHaveLength(2)
  })

  it('should replace empty thumbnail', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <CategoryEntry category={noThumbCategory} subCategories={[childCategory]} />
    )

    expect(getByRole('img')).toHaveProperty('src', `http://localhost/${iconPlaceholder}`)
  })

  describe('query', () => {
    it('should show excerpt around query if match in title and content', () => {
      const excerptBeforeQuery = 'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      const query = 'Duis aute'
      const excerptAfterQuery = 'irure dolor in reprehenderit in voluptate velit esse cillum'
      const excerpt = `${excerptBeforeQuery} ${query} ${excerptAfterQuery}`
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold',
        },
      }

      const { queryAllByText, getByText, getByLabelText } = renderWithRouterAndTheme(
        <CategoryEntry category={category} subCategories={[]} query={query} contentWithoutHtml={category.content} />
      )

      expect(getByLabelText(excerpt)).toBeTruthy()
      expect(getByText(excerptBeforeQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(queryAllByText(query)[0]).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(queryAllByText(query)[1]).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(excerptAfterQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    })

    it('should show beginning of excerpt if match only in title', () => {
      const query = 'Willkommen'
      const excerpt =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold',
        },
      }

      const { getByText, getByLabelText } = renderWithRouterAndTheme(
        <CategoryEntry
          category={categoryWithDifferentName}
          subCategories={[]}
          query={query}
          contentWithoutHtml={categoryWithDifferentName.content}
        />
      )

      expect(getByText(query)).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByLabelText(excerpt)).toBeTruthy()
      expect(getByText(excerpt)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    })

    it('should show excerpt around query if only match in content', () => {
      const excerptBeforeQuery = 'et dolore magna aliqua. Ut enim ad minim veniam, quis'
      const query = 'nostrud exercitation'
      const excerptAfterQuery = 'ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      const excerpt = `${excerptBeforeQuery} ${query} ${excerptAfterQuery}`
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold',
        },
      }

      const { getByText, getByLabelText } = renderWithRouterAndTheme(
        <CategoryEntry category={category} subCategories={[]} query={query} contentWithoutHtml={category.content} />
      )

      expect(getByLabelText(excerpt)).toBeTruthy()
      expect(getByText(excerptBeforeQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(query)).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(excerptAfterQuery)).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
    })

    it('should show beginning of excerpt if there is no match', () => {
      const query = 'no match'
      const excerpt =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'

      const { queryAllByText, getByText } = renderWithRouterAndTheme(
        <CategoryEntry category={category} subCategories={[]} query={query} contentWithoutHtml={category.content} />
      )

      expect(getByText(category.title)).toBeTruthy()
      expect(getByText(excerpt)).toBeTruthy()
      const regex = /.+/
      const texts = queryAllByText(regex)
      // Shows category.title and beginning of category.content
      expect(texts).toHaveLength(2)
    })
  })
})
