export const dynamicParams = true; // fallback: true gibi çalışır

type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
};

export async function generateStaticParams() {
  const res = await fetch('http://localhost:8080/projects');
  const projects = await res.json();

  // ID'leri string olarak döndürüyoruz (gerekli)
  return projects.map((proj: Project) => ({
    id: proj.id.toString(),
  }));
}

export default async function SSGProjectDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:8080/projects/${params.id}`);
  
  if (!res.ok) {
    return <div>Proje bulunamadı.</div>;
  }

  const project: Project = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">SSG: {project.name}</h1>
      <p>{project.description}</p>
      <p className="text-sm text-gray-500">
        Başlangıç: {project.startDate} — Bitiş: {project.deadline}
      </p>
    </div>
  );
}
