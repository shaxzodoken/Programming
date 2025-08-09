import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <section class="prose prose-slate mx-auto max-w-3xl px-6 py-12 dark:prose-invert">
      <h1>Hujjatlar</h1>
      <p>Platformadan foydalanish, obuna, RBAC va texnik qo‘llanma.</p>
      <h2>RBAC</h2>
      <ul>
        <li><b>Student</b>: kurslarni ko‘rish</li>
        <li><b>Instructor</b>: kurs qo‘shish/yangilash</li>
        <li><b>Admin</b>: barcha resurslarga to‘liq kirish</li>
      </ul>
      <h2>Demo loginlar</h2>
      <ul>
        <li><b>Admin</b>: admin@example.com / admin123</li>
        <li><b>Instructor</b>: instructor@example.com / instructor123</li>
        <li><b>Student</b>: student@example.com / student123</li>
      </ul>
    </section>
  );
});


