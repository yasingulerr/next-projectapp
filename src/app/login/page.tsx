'use client';

import { useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // Firestore'a kullanıcı ekle
        await setDoc(doc(db, 'users', user.uid), {
          email,
          role: 'employee', // varsayılan rol
        });

        alert('Kayıt başarılı!');
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // Rol kontrolü için:
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data()?.role : null;

        console.log('Kullanıcı rolü:', role);
        router.push('/dashboard');
        // Yönlendirme burada yapılır
      }
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">
          {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {isRegistering ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline"
          >
            {isRegistering ? 'Giriş yap' : 'Kayıt ol'}
          </button>
        </p>
      </div>
    </div>
  );
}
