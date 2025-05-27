'use client';

import React from 'react';

type Props = {
  users: { id: number; userEmail: string }[];
    role: string | null;
  onRemove: (email: string) => void;
};

function EmployeeList({ users, role, onRemove }: Props) {
  return (
    <ul className="list-disc ml-5 space-y-1">
      {users.map((user) => (
        <li key={user.id} className="flex justify-between items-center">
          <span>{user.userEmail}</span>
          {role === 'manager' && (
            <button
              onClick={() => onRemove(user.userEmail)}
              className="text-red-600 hover:underline text-sm"
            >
              Kaldır
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default React.memo(EmployeeList);
