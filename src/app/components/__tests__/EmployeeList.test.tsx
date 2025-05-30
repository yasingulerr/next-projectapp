import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeList from '../MemoizedEmployeeList';

describe('EmployeeList', () => {
  const mockUsers = [
    { id: 1, userEmail: 'test1@example.com' },
    { id: 2, userEmail: 'test2@example.com' },
  ];

  it('çalışan epostalarını doğru şekilde listeler', () => {
    render(<EmployeeList users={mockUsers} role="manager" onRemove={() => {}} />);
    
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
  });

  it('kaldır butonunu sadece manager rolü varsa gösterir', () => {
    render(<EmployeeList users={mockUsers} role="manager" onRemove={() => {}} />);
    
    expect(screen.getAllByText('Kaldır')).toHaveLength(2);
  });

  it('kaldır butonunu employee rolünde göstermez', () => {
    render(<EmployeeList users={mockUsers} role="employee" onRemove={() => {}} />);
    
    expect(screen.queryByText('Kaldır')).not.toBeInTheDocument();
  });

  it('kaldır butonuna tıklanınca callback çalışır', () => {
    const handleRemove = jest.fn();

    render(<EmployeeList users={mockUsers} role="manager" onRemove={handleRemove} />);
    
    const buttons = screen.getAllByText('Kaldır');
    fireEvent.click(buttons[0]);

    expect(handleRemove).toHaveBeenCalledWith('test1@example.com');
  });
});
