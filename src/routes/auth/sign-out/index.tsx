import { type RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  cookie.set('qa_session', '', { path: '/', maxAge: 0 });
  throw redirect(302, '/');
};

export default function SignOut() {
  return null;
}


