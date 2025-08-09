import { component$ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';
import { hashPassword, signToken, signUpSchema } from '../../../lib/auth';
import { ensurePg } from '../../../lib/pg';

export const useSignUp = routeAction$(async (data, event) => {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: 'Maʼlumotlarni tekshiring' };
  const { email, name, password } = parsed.data;
  const pg = await ensurePg();
  const ex = await pg.query('select id from users where email=$1', [email]);
  if (ex.rowCount && ex.rowCount > 0) return { success: false, message: 'Ushbu email allaqachon mavjud' };
  const pass = hashPassword(password);
  const ins = await pg.query('insert into users (name, email, password_hash, role) values ($1,$2,$3,$4) returning id, name, email, role', [name, email, pass, 'student']);
  const user = ins.rows[0];
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role as any });
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


