import { component$ } from '@builder.io/qwik';
import { routeLoader$ , Link } from '@builder.io/qwik-city';
import { ensurePg } from '../../lib/pg';
import { Breadcrumbs } from '../../components/breadcrumbs';

export const useCourses = routeLoader$(async () => {
  const pg = await ensurePg();
  const { rows } = await pg.query('select id, slug, title, description, is_premium from courses order by title asc');
  return rows as { id: string; slug: string; title: string; description: string; is_premium: boolean }[];
});

export default component$(() => {
  const courses = useCourses();
  return (
    <section class="mx-auto max-w-6xl px-6 py-12">
      <Breadcrumbs items={[{ href: '/', label: 'Bosh sahifa' }, { href: '/courses', label: 'Kurslar' }]} />
      <div class="flex items-end justify-between gap-4">
        <h1 class="text-3xl font-semibold tracking-tight">Kurslar</h1>
        <div class="text-sm text-gray-500">Jami: {courses.value.length}</div>
      </div>
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.value.map((c) => (
          <Link key={c.id} href={`/courses/${c.slug}`} class="group block rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:shadow hover:ring-blue-500/20 dark:border-gray-800/60 dark:bg-gray-900">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium group-hover:text-blue-600">{c.title}</h3>
              {c.is_premium && (
                <span class="rounded bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">Premium</span>
              )}
            </div>
            <p class="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">{c.description}</p>
            <div class="mt-3 text-sm text-blue-600">Batafsil →</div>
          </Link>
        ))}
      </div>
    </section>
  );
});


