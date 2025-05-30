'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/app/utils/vitals';

export default function ClientVitals() {
  useEffect(() => {
    reportWebVitals((metric) => {
      console.log(`[Vitals] ${metric.name}: ${metric.value}`);
    });
  }, []);

  return null; // DOM'a hiçbir şey render etme
}
