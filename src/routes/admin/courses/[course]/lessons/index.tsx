import { component$ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city';
import { ensurePg } from '../../../../lib/pg';
import { verifyToken } from '../../../../lib/auth';

export const useLessons = routeLoader$(async ({ cookie, params, redirect, error }) => {
  const token = cookie.get('qa_session')?.value;
  const me = token ? verifyToken(token) : null;
  if (!me || me.role !== 'admin') throw redirect(302, '/auth/sign-in');
  const pg = await ensurePg();
  const course = await pg.query('select slug, title from courses where slug=$1', [params.course]);
  if (!course.rowCount) throw error(404, 'Topilmadi');
  const lessons = await pg.query('select id, slug, title, free_preview from lessons where course_slug=$1 order by title', [params.course]);
  return { course: course.rows[0], lessons: lessons.rows } as any;
});

export const useCreateLesson = routeAction$(async (data, { cookie, params, redirect, fail }) => {
  const token = cookie.get('qa_session')?.value;
  const me = token ? verifyToken(token) : null;
  if (!me || me.role !== 'admin') throw redirect(302, '/auth/sign-in');
  const pg = await ensurePg();
  try {
    await pg.query(
      'insert into lessons (course_slug, slug, title, content_md, free_preview) values ($1,$2,$3,$4,$5)',
      [params.course, data.slug, data.title, data.content_md, data.free_preview === 'on'],
    );
    return { ok: true };
  } catch (e: any) {
    return fail(400, { message: e?.message || 'Xatolik' });
  }
}, zod$((z) => z.object({ slug: z.string().min(2), title: z.string().min(2), content_md: z.string().min(1), free_preview: z.string().optional() })));

export default component$(() => {
  const data = useLessons();
  const create = useCreateLesson();
  return (
    <section class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-2xl font-semibold">Darslar: {data.value.course.title}</h1>
      <div class="mt-6 rounded border p-4 dark:border-gray-800">
        <h2 class="font-medium">Yangi dars</h2>
        <Form action={create} class="mt-3 grid gap-3">
          <input name="slug" placeholder="slug" class="rounded border px-3 py-2 dark:bg-gray-900" />
          <input name="title" placeholder="title" class="rounded border px-3 py-2 dark:bg-gray-900" />
          <textarea name="content_md" placeholder="# Title\n\nContent..." class="h-40 rounded border px-3 py-2 font-mono text-sm dark:bg-gray-900" />
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="free_preview" /> Bepul preview</label>
          <button class="rounded bg-gray-900 px-3 py-2 text-white dark:bg-white dark:text-black">Saqlash</button>
          {create.value?.message && <p class="text-sm text-red-600">{create.value.message}</p>}
        </Form>
      </div>
      <div class="mt-8 overflow-x-auto rounded border dark:border-gray-800">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-left dark:bg-gray-800/40">
            <tr>
              <th class="p-3">Slug</th>
              <th class="p-3">Title</th>
              <th class="p-3">Preview</th>
            </tr>
          </thead>
          <tbody>
            {data.value.lessons.map((l: any) => (
              <tr key={l.id} class="border-t dark:border-gray-800">
                <td class="p-3">{l.slug}</td>
                <td class="p-3">{l.title}</td>
                <td class="p-3">{l.free_preview ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});


