'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { emitEvent, trackPageView } from '@/lib/custom-tm';
import {  initClickIdCookiesFromParams } from '@/lib/cookies-tracking';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`;
    const sessionKey = 'page_view_tracked';
    const hasTrackedInSession = sessionStorage.getItem(sessionKey);
    
    if (!hasTrackedInSession) {
      trackPageView('Page View', {
        route: pathname,
        url: url,
        search_params: Object.fromEntries(searchParams?.entries() || []),
        is_initial_load: true
      });
      sessionStorage.setItem(sessionKey, 'true');
    } else if (previousPathname.current !== pathname) {
      trackPageView('Page View', {
        route: pathname,
        url: url,
        search_params: Object.fromEntries(searchParams?.entries() || []),
        previous_route: previousPathname.current,
        is_initial_load: false
      });
    }
    
    if (previousPathname.current && previousPathname.current !== pathname) {
      emitEvent('page_hide', {
        previous_route: previousPathname.current,
        new_route: pathname,
        time_on_page: performance.now()
      });
    }
    
    previousPathname.current = pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    const appLoadedKey = 'app_loaded_tracked';
    const hasTrackedAppLoaded = sessionStorage.getItem(appLoadedKey);
    
    if (!hasTrackedAppLoaded) {
      emitEvent('app_loaded', {
        load_time: performance.timing?.loadEventEnd - performance.timing?.navigationStart,
        dom_ready: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart,
        first_paint: performance.getEntriesByType('paint')[0]?.startTime
      });
      sessionStorage.setItem(appLoadedKey, 'true');
    }
  }, []);

useEffect(() => {
  initClickIdCookiesFromParams(searchParams);
}, [searchParams]); 

  return <>{children}</>;
}