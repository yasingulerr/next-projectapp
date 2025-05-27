'use client';

type Props = {
  project: {
    id: number;
    name: string;
    description: string;
    startDate: string;
    deadline: string;
  };
  onUpdated: () => void;
};

export default function ProjectEditForm({ project, onUpdated }: Props) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch(`http://localhost:8080/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          description: data.get('description'),
          startDate: data.get('startDate'),
          deadline: data.get('deadline'),
        }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız');
      alert('Proje güncellendi!');
      onUpdated();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" defaultValue={project.name} className="w-full border p-2 rounded" />
      <textarea name="description" defaultValue={project.description} className="w-full border p-2 rounded" />
      <div className="flex space-x-2">
        <input type="date" name="startDate" defaultValue={project.startDate} className="border p-2 rounded w-1/2" />
        <input type="date" name="deadline" defaultValue={project.deadline} className="border p-2 rounded w-1/2" />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Güncelle</button>
    </form>
  );
}
