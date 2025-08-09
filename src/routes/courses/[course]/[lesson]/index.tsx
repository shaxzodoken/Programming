import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { routeLoader$, type RequestHandler } from '@builder.io/qwik-city';
import { ensurePg } from '../../../../lib/pg';
import { verifyToken } from '../../../../lib/auth';
import { marked } from 'marked';
import hljs from 'highlight.js';

export const onGet: RequestHandler = async ({ cookie, params, error }) => {
  const pg = await ensurePg();
  const courseQ = await pg.query('select slug, title, is_premium from courses where slug=$1', [params.course]);
  const lessonQ = await pg.query('select slug, title, content_md, free_preview from lessons where course_slug=$1 and slug=$2', [params.course, params.lesson]);
  const course = courseQ.rows[0];
  const lesson = lessonQ.rows[0];
  if (!course || !lesson) throw error(404, 'Topilmadi');

  if (course.is_premium && !lesson.free_preview) {
    const token = cookie.get('qa_session')?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) throw error(402, 'Premium dars. Iltimos, tizimga kiring yoki obuna bo‘ling.');
  }
};

export const useLesson = routeLoader$(async ({ params, error }) => {
  const pg = await ensurePg();
  const courseQ = await pg.query('select slug, title, is_premium from courses where slug=$1', [params.course]);
  const lessonQ = await pg.query('select slug, title, content_md, free_preview from lessons where course_slug=$1 and slug=$2', [params.course, params.lesson]);
  const course = courseQ.rows[0];
  const lesson = lessonQ.rows[0];
  if (!course || !lesson) throw error(404, 'Topilmadi');
  return { course, lesson } as any;
});

export default component$(() => {
  const data = useLesson();
  const html = useSignal('');

  useVisibleTask$(() => {
    const renderer = new marked.Renderer();
    marked.setOptions({
      renderer: renderer as any,
      gfm: true,
      breaks: true,
    } as any);
    // code highlight via post-process
    const raw = marked.parse(data.value.lesson.content_md) as string;
    const highlighted = raw.replace(/<code class="language-([^"]+)">([\s\S]*?)<\/code>/g, (_m, lang, code) => {
      try {
        const res = hljs.highlight(code, { language: lang }).value;
        return `<code class="hljs language-${lang}">${res}</code>`;
      } catch {
        return `<code class="hljs">${code}</code>`;
      }
    });
    html.value = highlighted;
  });

  return (
    <article class="prose prose-slate mx-auto max-w-3xl px-6 py-12 dark:prose-invert">
      <h1 class="mb-4 text-2xl font-semibold">{data.value.lesson.title}</h1>
      <div class="not-prose rounded-lg border p-3 text-xs text-gray-500 dark:border-gray-800">
        Kurs: {data.value.course.title}
      </div>
      <div class="prose mt-6" dangerouslySetInnerHTML={html.value} />
    </article>
  );
});


