import { test, expect } from '@playwright/test';

test.beforeAll('run before all', async ({}) => {
  console.log('This will run before all tests');
});

test.afterAll('run after all', async ({}) => {
  console.log('This will run after all tests');
});

test('Get Test Tag', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagsResponseJson = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJson.tags[0]).toEqual('Test');
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);

  //  console.log(tagsResponseJson);
});

test('Get All Articles', async ({ request }) => {
  // const articlesResponse = await request.get(
  //   'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
  // );

  const url = new URL('https://conduit-api.bondaracademy.com/api/articles');
  url.searchParams.set('limit', '10');
  url.searchParams.set('offset', '0');

  const response = await request.get(url.toString());
  const articleResponseJson = await response.json();

  expect(response.status()).toEqual(200);
  expect(articleResponseJson.articles.length).toBeLessThanOrEqual(10);
  expect(articleResponseJson.articlesCount).toEqual(10);
  // console.log(articleResponseJson);
});

test('Create Article', async ({ request }) => {
  const tokenResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/users/login',
    {
      data: { user: { email: 'udemy_user2@gmail.com', password: 'udemy_user2' } },
    },
  );
  const tokenResponseJSON = await tokenResponse.json();
  const authToken = 'Token ' + tokenResponseJSON.user.token;

  const generateId = (length = 12): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const id = generateId(); // 'aZ3kR9mTqL2x'

  const newArticleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles',
    {
      data: {
        article: {
          title: `Article Title-${id}`,
          description: 'Article Title',
          body: 'Article Title',
          tagList: ['test'],
        },
      },
      headers: {
        authorization: authToken,
      },
    },
  );

  const newArticleResponseJson = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJson.article.title).toEqual(`Article Title-${id}`);
  const slugId = newArticleResponseJson.article.slug;

  const updateArticleResponse = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      data: {
        article: {
          title: `Updated Article Title-${id}`,
          description: 'Article Title',
          body: 'Article Title',
          tagList: ['test'],
        },
      },
      headers: {
        authorization: authToken,
      },
    },
  );

  const updateArticleResponseJson = await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJson.article.title).toEqual(`Updated Article Title-${id}`);

  const articlesResponse = await request.get(
    'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
  );
  const articleResponseJson = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        authorization: authToken,
      },
    },
  );
  expect(deleteArticleResponse.status()).toEqual(404);
});
