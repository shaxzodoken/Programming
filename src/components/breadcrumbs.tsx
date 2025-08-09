import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface Crumb { href: string; label: string }

export const Breadcrumbs = component$<{ items: Crumb[] }>(({ items }) => {
  return (
    <nav class="mb-6 text-sm" aria-label="Breadcrumb">
      <ol class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        {items.map((c, i) => (
          <li key={i} class="flex items-center gap-2">
            {i > 0 && <span class="opacity-60">/</span>}
            {i < items.length - 1 ? (
              <Link href={c.href} class="hover:underline">{c.label}</Link>
            ) : (
              <span class="font-medium text-gray-900 dark:text-gray-100">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});


