import { component$ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';
import { createUser, findUserByEmail } from '../../../lib/db';
import { hashPassword, signToken, signUpSchema } from '../../../lib/auth';

export const useSignUp = routeAction$(async (data, event) => {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: 'Maʼlumotlarni tekshiring' };
  const { email, name, password } = parsed.data;
  const exists = await findUserByEmail(email);
  if (exists) return { success: false, message: 'Ushbu email allaqachon mavjud' };
  const user = await createUser({ email, name, passwordHash: hashPassword(password), role: 'student' });
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  event.cookie.set('qa_session', token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
  throw event.redirect(302, '/');
});

export default component$(() => {
  const action = useSignUp();
  return (
    <section class="mx-auto max-w-md px-6 py-12">
      <h1 class="text-2xl font-semibold">Ro‘yxatdan o‘tish</h1>
      <Form action={action} class="mt-6 space-y-4">
        <div>
          <label class="block text-sm">Ism</label>
          <input name="name" required class="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-900" />
        </div>
        <div>
          <label class="block text-sm">Email</label>
          <input name="email" type="email" required class="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-900" />
        </div>
        <div>
          <label class="block text-sm">Parol</label>
          <input name="password" type="password" required class="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-900" />
        </div>
        {action.value?.message && (
          <p class="text-sm text-red-600">{action.value.message}</p>
        )}
        <button type="submit" class="btn btn-primary w-full">Ro‘yxatdan o‘tish</button>
      </Form>
    </section>
  );
});


