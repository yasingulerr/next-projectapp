'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { Suspense, lazy } from 'react';
const ProjectEditForm = lazy(() => import('@/app/components/ProjectEditForm'));

import EmployeeList from '@/app/components/MemoizedEmployeeList';


type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
};

type Assignment = {
  id: number;
  userEmail: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user, role } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projRes, assignRes] = await Promise.all([
        fetch(`http://localhost:8080/projects/${id}`),
        fetch('http://localhost:8080/project-users'),
      ]);

      const projData = await projRes.json();
      const allAssignments = await assignRes.json();
      const projectAssignments = allAssignments.filter((a: any) => a.projectId == id);

      setProject(projData);
      setAssignedUsers(projectAssignments);
    } catch (err) {
      console.error('Veriler alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleEmployeeAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = new FormData(form).get('email') as string;

    try {
      const res = await fetch('http://localhost:8080/project-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email,
          projectId: Number(id),
          projectRole: 'employee',
        }),
      });

      if (!res.ok) throw new Error('Ekleme başarısız');
      alert('Çalışan eklendi!');
      form.reset();
      fetchData();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  const handleProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch(`http://localhost:8080/projects/${id}`, {
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
      fetchData();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  const handleProjectDelete = async () => {
    if (!confirm('Bu projeyi silmek üzeresin. Emin misin?')) return;

    try {
      const res = await fetch(`http://localhost:8080/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Silinemedi');

      alert('Proje silindi!');
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

const handleRemoveUser = async (userEmail: string) => {
  if (!confirm(`${userEmail} kullanıcısını projeden kaldırmak istiyor musun?`)) return;

  try {
    const res = await fetch('http://localhost:8080/project-users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail,
        projectId: Number(id),
      }),
    });

    if (!res.ok) throw new Error('Kaldırma başarısız');
    alert('Kullanıcı kaldırıldı');
    fetchData();
  } catch (err: any) {
    alert('Hata: ' + err.message);
  }
};


  if (loading) return <p>Yükleniyor...</p>;
  if (!project) return <p>Proje bulunamadı.</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p>{project.description}</p>
      <p className="text-sm text-gray-600">Başlangıç: {project.startDate}</p>
      <p className="text-sm text-gray-600">Bitiş: {project.deadline}</p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Projeye Atanmış Çalışanlar</h2>
      <EmployeeList users={assignedUsers} role={role} onRemove={handleRemoveUser} />
      </div>

      {role === 'manager' && (
        <>
          {/* Çalışan Ekle */}
          <div>
            <h2 className="text-xl font-bold mb-2">Çalışan Ekle</h2>
            <form onSubmit={handleEmployeeAdd} className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="Çalışan Email"
                required
                className="border p-2 rounded w-full"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Ekle
              </button>
            </form>
          </div>

          {/* Proje Güncelle */}
    <div>
      <h2 className="text-xl font-bold mt-8 mb-2">Projeyi Düzenle</h2>
      <Suspense fallback={<p>Form yükleniyor...</p>}>
        <ProjectEditForm project={project} onUpdated={fetchData} />
      </Suspense>
    </div>

          {/* Projeyi Sil */}
          <div className="mt-8">
            <button
              onClick={handleProjectDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Projeyi Sil
            </button>
          </div>
        </>
      )}
    </div>
  );
}
