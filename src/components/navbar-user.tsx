import { component$, useResource$, Resource } from '@builder.io/qwik';

export default component$(() => {
  const me = useResource$(async () => {
    const res = await fetch('/api/me');
    return (await res.json()) as { user: null | { name: string } };
  });
  return (
    <Resource
      value={me}
      onResolved={(data) => (
        data.user ? (
          <div class="flex items-center gap-3 text-sm">
            <span>Salom, {data.user.name}</span>
            <a href="/auth/sign-out" class="rounded border px-2 py-1">Chiqish</a>
          </div>
        ) : (
          <a href="/auth/sign-in" class="text-sm hover:underline">Kirish</a>
        )
      )}
    />
  );
});


