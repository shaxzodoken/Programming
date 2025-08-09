import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <section class="mx-auto max-w-5xl px-6 py-12">
        <div class="mb-10">
          <h1 class="text-4xl font-bold tracking-tight">Eng kuchli zamonaviy dasturlash darslari</h1>
          <p class="mt-3 text-gray-600 dark:text-gray-300">
            Qwik City, Mojo va boshqa eng ilg‘or texnologiyalar bo‘yicha chuqur va amaliy kurslar. Bepul darslar, premium yo‘nalishlar, interaktiv topshiriqlar.
          </p>
          <div class="mt-6 flex gap-3">
            <Link class="btn btn-primary" href="/courses">Kurslarni ko‘rish</Link>
            <Link class="btn btn-secondary" href="/auth/sign-up">Ro‘yxatdan o‘tish</Link>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard title="Qwik City" desc="SSR, Resumability va Signals bilan eng tezkor web ilovalar." />
          <FeatureCard title="Mojo" desc="AI va HPC uchun Python’ga mos, yuqori unumdor til." />
          <FeatureCard title="Interaktiv IDE" desc="Brauzerda yozing, ishga tushiring, natijani darhol ko‘ring." />
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

interface FeatureProps { title: string; desc: string }
export const FeatureCard = component$<FeatureProps>(({ title, desc }) => {
  return (
    <div class="rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm transition hover:shadow dark:border-gray-800/60 dark:bg-gray-900">
      <h3 class="text-lg font-semibold">{title}</h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  );
});
