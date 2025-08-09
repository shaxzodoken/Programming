import { component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const code = useSignal('console.log("Salom Qwik!")');
  const output = useSignal('');

  return (
    <section class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-2xl font-semibold">Playground</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Kod yozing va natijani ko‘ring (JS client-side).</p>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <textarea class="h-72 w-full rounded-md border p-3 font-mono text-sm dark:bg-gray-900" bind:value={code} />
        <div class="h-72 w-full rounded-md border p-3 font-mono text-sm dark:bg-gray-900">
          <div class="mb-2 text-xs text-gray-500">Natija:</div>
          <pre class="whitespace-pre-wrap">{output.value}</pre>
        </div>
      </div>
      <div class="mt-4 flex gap-3">
        <button class="btn btn-primary" onClick$={() => {
          try {
            // eslint-disable-next-line no-new-func
            const result = Function(code.value)();
            output.value = String(result ?? '✅ OK');
          } catch (e: any) {
            output.value = '❌ ' + (e?.message || String(e));
          }
        }}>Ishga tushirish</button>
        <button class="btn" onClick$={() => { code.value = ''; output.value=''; }}>Tozalash</button>
      </div>
    </section>
  );
});


