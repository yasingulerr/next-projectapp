'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';


type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
};

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user || !role) return;

    try {
      if (role === 'manager') {
        const res = await fetch('http://localhost:8080/projects');
        const data = await res.json();
        setProjects(data);
      } else {
        const resPU = await fetch('http://localhost:8080/project-users');
        const matchings = await resPU.json();

        const userProjects = matchings
          .filter((pu: any) => pu.userEmail === user.email)
          .map((pu: any) => pu.projectId);

        const resAll = await fetch('http://localhost:8080/projects');
        const allProjects = await resAll.json();

        const assigned = allProjects.filter((p: Project) =>
          userProjects.includes(p.id)
        );

        setProjects(assigned);
      }
    } catch (err) {
      console.error('Projeler alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user, role]);

  if (!user) return <p>Yükleniyor...</p>;
  if (loading) return <p>Projeler yükleniyor...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

            <Image
        src="/proje-banner2.png"
        alt="Proje Yönetim Sistemi"
        width={400}
        height={200}
        className="rounded shadow mx-auto"
        priority={false} // lazy loading aktif
      />
      <p>Hoş geldin, {user.email}</p>
      <p>Rolün: {role}</p>

      {role === 'manager' && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">Yeni Proje Ekle</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const name = formData.get('name') as string;
              const description = formData.get('description') as string;
              const startDate = formData.get('startDate') as string;
              const deadline = formData.get('deadline') as string;

              try {
                const res = await fetch('http://localhost:8080/projects', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name, description, startDate, deadline }),
                });

                if (!res.ok) throw new Error('Proje eklenemedi');

                alert('Proje başarıyla eklendi!');
                form.reset(); // formu sıfırla
                fetchProjects(); // projeleri yeniden yükle
              } catch (err: any) {
                alert('Hata: ' + err.message);
              }
            }}
            className="space-y-4 mt-4"
          >
            <input
              name="name"
              placeholder="Proje adı"
              required
              className="w-full border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Açıklama"
              required
              className="w-full border p-2 rounded"
            />
            <div className="flex space-x-2">
              <input
                name="startDate"
                type="date"
                required
                className="border p-2 rounded w-1/2"
              />
              <input
                name="deadline"
                type="date"
                required
                className="border p-2 rounded w-1/2"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Projeyi Ekle
            </button>
          </form>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Projeler</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 mt-2">Hiç projen yok.</p>
        ) : (
<ul className="mt-4 space-y-2">
  {projects.map((proj) => (
    <li key={proj.id} className="border p-4 rounded shadow hover:bg-gray-100 transition">
      <Link href={`/project/${proj.id}`}>
        <h3 className="font-bold text-blue-700 hover:underline">{proj.name}</h3>
        <p>{proj.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          Başlangıç: {proj.startDate} / Bitiş: {proj.deadline}
        </p>
      </Link>
    </li>
  ))}
</ul>

        )}
      </div>
    </div>
  );
}
