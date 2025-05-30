import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';

function TestComponent() {
  const { user, role } = useAuth();

  return (
    <div>
      <p>User: {user?.email || 'Yok'}</p>
      <p>Role: {role || 'Yok'}</p>
    </div>
  );
}

describe('AuthContext', () => {
  it('AuthProvider ile sarmalanınca context değerleri erişilebilir olmalı', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // İlk değerlerin null olduğunu varsayıyoruz
    expect(screen.getByText('User: Yok')).toBeInTheDocument();
    expect(screen.getByText('Role: Yok')).toBeInTheDocument();
  });
});
