export const dynamic = 'force-dynamic'; // Bu sayede SSR zorlanır

type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
};

export default async function SSRProjectDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:8080/projects/${params.id}`, {
    cache: 'no-store', // SSR için bu da önemlidir
  });

  if (!res.ok) {
    return <div>Proje bulunamadı.</div>;
  }

  const project: Project = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">SSR: {project.name}</h1>
      <p>{project.description}</p>
      <p className="text-sm text-gray-500">
        Başlangıç: {project.startDate} — Bitiş: {project.deadline}
      </p>
    </div>
  );
}
