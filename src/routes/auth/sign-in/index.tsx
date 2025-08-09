import { component$, useSignal } from '@builder.io/qwik';
import { Form, routeAction$, zod$ } from '@builder.io/qwik-city';
import { signInSchema, verifyPassword, signToken } from '../../../lib/auth';
import { ensurePg } from '../../../lib/pg';

export const useSignIn = routeAction$(async (data, event) => {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: 'Maʼlumotlarni tekshiring' };
  const { email, password } = parsed.data;
  const pg = await ensurePg();
  const q = await pg.query('select id, name, email, password_hash, role from users where email=$1', [email]);
  const user = q.rows[0];
  if (!user) return { success: false, message: 'Email yoki parol noto‘g‘ri' };
  const ok = verifyPassword(password, user.password_hash);
  if (!ok) return { success: false, message: 'Email yoki parol noto‘g‘ri' };
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  event.cookie.set('qa_session', token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
  throw event.redirect(302, '/');
}, zod$((z) => z.object({ email: z.string().email(), password: z.string().min(6) })));

export default component$(() => {
  const action = useSignIn();
  const showPwd = useSignal(false);
  return (
    <section class="mx-auto max-w-md px-6 py-12">
      <h1 class="text-2xl font-semibold">Kirish</h1>
      <Form action={action} class="mt-6 space-y-4">
        <div>
          <label class="block text-sm">Email</label>
          <input name="email" type="email" required class="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-900" />
        </div>
        <div>
          <label class="block text-sm">Parol</label>
          <div class="mt-1 flex gap-2">
            <input name="password" type={showPwd.value ? 'text' : 'password'} required class="w-full rounded-md border px-3 py-2 dark:bg-gray-900" />
            <button class="rounded-md border px-3" onClick$={(e) => { e.preventDefault(); showPwd.value = !showPwd.value; }}>{showPwd.value ? 'Yashir' : 'Ko‘r'}</button>
          </div>
        </div>
        {action.value?.message && (
          <p class="text-sm text-red-600">{action.value.message}</p>
        )}
        <button type="submit" class="btn btn-primary w-full">Kirish</button>
      </Form>
    </section>
  );
});


