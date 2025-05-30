import { onLCP, onTTFB, onCLS, onFCP } from 'web-vitals';

export function reportWebVitals(callback: (metric: any) => void) {
  onFCP(callback);      // İlk içeriğin görünme süresi
  onLCP(callback);     // Ana içeriğin yüklenmesi
  onTTFB(callback);   // Sunucu yanıt süresi
  onCLS(callback);   // Sayfa kaymaların ölçümü
}
