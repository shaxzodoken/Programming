import { component$ } from '@builder.io/qwik';
import { type RequestHandler } from '@builder.io/qwik-city';
import { verifyToken } from '../../lib/auth';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const token = cookie.get('qa_session')?.value;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== 'admin') {
    throw redirect(302, '/auth/sign-in');
  }
};

export default component$(() => {
  return (
    <section class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-2xl font-semibold">Admin panel</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Foydalanuvchilar va kurslarni boshqarish (soddalashtirilgan demo).</p>
      <ul class="mt-6 list-disc pl-6 text-sm">
        <li>RBAC guard: faqat admin kirishi mumkin</li>
        <li>Kurslar JSON DB orqali saqlanadi</li>
      </ul>
    </section>
  );
});


