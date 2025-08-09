import { component$ } from '@builder.io/qwik';
import { routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city';
import { listUsers, updateUserRole } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export const useUsers = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get('qa_session')?.value;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== 'admin') throw redirect(302, '/auth/sign-in');
  return listUsers();
});

export const useUpdateRole = routeAction$(async ({ userId, role }, { cookie, redirect, fail }) => {
  const token = cookie.get('qa_session')?.value;
  const me = token ? verifyToken(token) : null;
  if (!me || me.role !== 'admin') throw redirect(302, '/auth/sign-in');
  const updated = await updateUserRole(userId, role as any);
  if (!updated) return fail(404, { message: 'User not found' });
  return { ok: true };
}, zod$((z) => z.object({ userId: z.string().min(1), role: z.enum(['student','instructor','admin']) })));

export default component$(() => {
  const users = useUsers();
  const updateRole = useUpdateRole();
  return (
    <section class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-2xl font-semibold">Foydalanuvchilar</h1>
      <div class="mt-6 overflow-x-auto rounded border dark:border-gray-800">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-left dark:bg-gray-800/40">
            <tr>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.value.map((u) => (
              <tr key={u.id} class="border-t dark:border-gray-800">
                <td class="p-3">{u.name}</td>
                <td class="p-3">{u.email}</td>
                <td class="p-3">{u.role}</td>
                <td class="p-3">
                  <form method="post" preventdefault:submit onSubmit$={(e, el) => {
                    const form = el as HTMLFormElement;
                    updateRole.submit(new FormData(form));
                  }} class="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <select class="rounded border bg-white px-2 py-1 text-sm dark:bg-gray-900" name="role" value={u.role}>
                      <option value="student">student</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                    </select>
                    <button class="rounded bg-gray-900 px-2 py-1 text-white dark:bg-white dark:text-black">Saqlash</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});


