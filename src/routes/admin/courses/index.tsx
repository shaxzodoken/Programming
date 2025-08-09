import { component$ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city';
import { ensurePg } from '../../../lib/pg';
import { verifyToken } from '../../../lib/auth';

export const useCourses = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get('qa_session')?.value;
  const me = token ? verifyToken(token) : null;
  if (!me || me.role !== 'admin') throw redirect(302, '/auth/sign-in');
  const pg = await ensurePg();
  const { rows } = await pg.query('select id, slug, title, description, is_premium from courses order by title asc');
  return rows as any[];
});

export const useCreateCourse = routeAction$(async (data, { cookie, redirect, fail }) => {
  const token = cookie.get('qa_session')?.value;
  const me = token ? verifyToken(token) : null;
  if (!me || me.role !== 'admin') throw redirect(302, '/auth/sign-in');
  const pg = await ensurePg();
  try {
    await pg.query(
      'insert into courses (slug, title, description, is_premium) values ($1,$2,$3,$4)',
      [data.slug, data.title, data.description, data.is_premium === 'on'],
    );
    return { ok: true };
  } catch (e: any) {
    return fail(400, { message: e?.message || 'Xatolik' });
  }
}, zod$((z) => z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  description: z.string().min(3),
  is_premium: z.string().optional(),
})));

export const useDeleteCourse = routeAction$(async (data, { cookie, redirect, fail }) => {
  const token = cookie.get('qa_session')?.value;
  const me = token ? verifyToken(token) : null;
  if (!me || me.role !== 'admin') throw redirect(302, '/auth/sign-in');
  const pg = await ensurePg();
  try {
    await pg.query('delete from courses where slug=$1', [data.slug]);
    return { ok: true };
  } catch (e: any) {
    return fail(400, { message: e?.message || 'Xatolik' });
  }
}, zod$((z) => z.object({ slug: z.string().min(1) })));

export default component$(() => {
  const courses = useCourses();
  const create = useCreateCourse();
  const del = useDeleteCourse();
  return (
    <section class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-2xl font-semibold">Kurslar (Admin)</h1>

      <div class="mt-6 rounded border p-4 dark:border-gray-800">
        <h2 class="font-medium">Yangi kurs qo‘shish</h2>
        <Form action={create} class="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="slug" placeholder="slug" class="rounded border px-3 py-2 dark:bg-gray-900" />
          <input name="title" placeholder="title" class="rounded border px-3 py-2 dark:bg-gray-900" />
          <textarea name="description" placeholder="description" class="sm:col-span-2 rounded border px-3 py-2 dark:bg-gray-900" />
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_premium" /> Premium</label>
          <button class="sm:col-span-2 rounded bg-gray-900 px-3 py-2 text-white dark:bg-white dark:text-black">Saqlash</button>
          {create.value?.message && <p class="text-sm text-red-600">{create.value.message}</p>}
        </Form>
      </div>

      <div class="mt-8 overflow-x-auto rounded border dark:border-gray-800">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-left dark:bg-gray-800/40">
            <tr>
              <th class="p-3">Slug</th>
              <th class="p-3">Title</th>
              <th class="p-3">Premium</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.value.map((c: any) => (
              <tr key={c.id} class="border-t dark:border-gray-800">
                <td class="p-3">{c.slug}</td>
                <td class="p-3">{c.title}</td>
                <td class="p-3">{c.is_premium ? 'yes' : 'no'}</td>
                <td class="p-3">
                  <a class="mr-3 text-blue-600" href={`/admin/courses/${c.slug}/lessons`}>Lessons</a>
                  <form method="post" class="inline" preventdefault:submit onSubmit$={(e, el) => del.submit(new FormData(el as HTMLFormElement))}>
                    <input type="hidden" name="slug" value={c.slug} />
                    <button class="text-red-600">Delete</button>
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


