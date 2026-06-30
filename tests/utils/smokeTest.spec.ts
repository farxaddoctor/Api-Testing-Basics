import { test, expect } from '@playwright/test';
import { RequestHandler } from './request-handler';

test('first test', async ({}) => {
  const api = new RequestHandler();
  api.url('https://conduit-api.bondaracademy.com/api/articles');
});
