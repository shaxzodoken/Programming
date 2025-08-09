import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import NavbarUser from '../components/navbar-user';

export default component$(() => {
  return (
    <div class="min-h-dvh bg-[--color-bgContrast] text-gray-900 dark:text-gray-100">
      <header class="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur dark:border-gray-800/60 dark:bg-gray-900/70">
        <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" class="flex items-center gap-2 font-semibold">
            <span class="inline-block rounded bg-yellow-400 px-2 py-1 text-xs text-black">Beta</span>
            <span>Qwik Academy</span>
          </Link>
          <div class="flex items-center gap-4">
            <Link href="/courses" class="text-sm hover:underline">Kurslar</Link>
            <Link href="/playground" class="text-sm hover:underline">Playground</Link>
            <Link href="/docs" class="text-sm hover:underline">Docs</Link>
            <NavbarUser />
          </div>
        </nav>
      </header>
      <main>
        <Slot />
      </main>
      <footer class="mt-20 border-t border-gray-200/60 py-10 text-center text-sm text-gray-600 dark:border-gray-800/60 dark:text-gray-300">
        © {new Date().getFullYear()} Qwik Academy. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
});


