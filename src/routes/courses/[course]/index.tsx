import { component$ } from '@builder.io/qwik';
import { routeLoader$, Link } from '@builder.io/qwik-city';
import { ensurePg } from '../../../lib/pg';

export const useCourse = routeLoader$(async ({ params, error }) => {
  const pg = await ensurePg();
  const { rows } = await pg.query('select slug, title, description, is_premium from courses where slug=$1', [params.course]);
  const course = rows[0];
  if (!course) throw error(404, 'Topilmadi');
  const lessons = await pg.query('select slug, title, free_preview from lessons where course_slug=$1 order by title', [params.course]);
  return { ...course, lessons: lessons.rows } as any;
});

export default component$(() => {
  const course = useCourse();
  return (
    <section class="mx-auto max-w-3xl px-6 py-12">
      <div class="flex items-start justify-between gap-6">
        <div>
          <h1 class="text-2xl font-semibold">{course.value.title}</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{course.value.description}</p>
        </div>
        {course.value.is_premium && (
          <span class="rounded bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black self-center">Premium</span>
        )}
      </div>
      <ol class="mt-8 space-y-3">
        {course.value.lessons.map((l: any, idx: number) => (
          <li key={l.id} class="flex items-center justify-between rounded border p-4 dark:border-gray-800">
            <div>
              <div class="text-sm text-gray-500">Dars {idx + 1}</div>
              <div class="font-medium">{l.title}</div>
              {l.free_preview && <div class="text-xs text-green-600">Bepul preview</div>}
            </div>
            <Link href={`/courses/${course.value.slug}/${l.slug}`} class="text-sm text-blue-600">Ko‘rish →</Link>
          </li>
        ))}
      </ol>
    </section>
  );
});


