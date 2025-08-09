import { component$ } from '@builder.io/qwik';
import { routeLoader$ , Link } from '@builder.io/qwik-city';
import { listCourses } from '../../lib/db';

export const useCourses = routeLoader$(async () => {
  const courses = await listCourses();
  return courses;
});

export default component$(() => {
  const courses = useCourses();
  return (
    <section class="mx-auto max-w-6xl px-6 py-12">
      <h1 class="text-2xl font-semibold">Kurslar</h1>
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.value.map((c) => (
          <Link key={c.id} href={`/courses/${c.slug}`} class="block rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm transition hover:shadow dark:border-gray-800/60 dark:bg-gray-900">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">{c.title}</h3>
              {c.isPremium && (
                <span class="rounded bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">Premium</span>
              )}
            </div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{c.description}</p>
            <div class="mt-3 text-sm text-blue-600">Batafsil →</div>
          </Link>
        ))}
      </div>
    </section>
  );
});


