'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function TopLoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

    setLoading(true);
    NProgress.start();

    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 500); // optional minimum visible duration

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
