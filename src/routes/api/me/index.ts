import { type RequestHandler } from '@builder.io/qwik-city';
import { verifyToken } from '../../../lib/auth';

export const onGet: RequestHandler = async ({ cookie, json }) => {
  const token = cookie.get('qa_session')?.value;
  const user = token ? verifyToken(token) : null;
  json(200, { user });
};


