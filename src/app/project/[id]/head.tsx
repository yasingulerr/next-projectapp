import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`http://localhost:8080/projects/${params.id}`, {
      cache: 'no-store',
    });
    const project = await res.json();

    return {
      title: `Proje: ${project.name}`,
      description: `${project.description || 'Projeye dair detaylar'}`,
    };
  } catch (error) {
    return {
      title: 'Proje Detayı',
      description: 'Proje bilgileri yüklenemedi.',
    };
  }
}
