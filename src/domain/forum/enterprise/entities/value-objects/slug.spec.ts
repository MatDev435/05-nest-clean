import { Slug } from './slug'

test('it should be abel to normalize and slug', () => {
  const slug = Slug.createFromText('An question title')

  expect(slug.value).toEqual('an-question-title')
})
