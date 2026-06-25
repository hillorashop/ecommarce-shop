const IP_CACHE_KEY = '_client_ip' as const;
const IP_CACHE_TTL = 24 * 60 * 60 * 1000;

interface IpCache {
  ip: string;
  country: string;
  expiresAt: number;
}

export interface IpData {
  ip: string;
  country: string;
}

let cachedData: IpData = { ip: '', country: '' };
let fetchPromise: Promise<IpData> | null = null; // prevent duplicate fetches

const readFromStorage = (): IpData | null => {
  try {
    const raw = localStorage.getItem(IP_CACHE_KEY);
    if (raw) {
      const parsed: IpCache = JSON.parse(raw);
      if (Date.now() < parsed.expiresAt) {
        cachedData = { ip: parsed.ip, country: parsed.country };
        return cachedData;
      }
      localStorage.removeItem(IP_CACHE_KEY);
    }
  } catch {
    localStorage.removeItem(IP_CACHE_KEY);
  }
  return null;
};

const writeToStorage = (data: IpData): void => {
  try {
    const cache: IpCache = { ...data, expiresAt: Date.now() + IP_CACHE_TTL };
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify(cache));
  } catch {}
};

export const getClientIpSync = (): IpData => {
  if (typeof window === 'undefined') return { ip: '', country: '' };
  if (cachedData.ip) return cachedData;
  return readFromStorage() ?? { ip: '', country: '' };
};

export const getClientIp = async (): Promise<IpData> => {
  if (typeof window === 'undefined') return { ip: '', country: '' };
  if (cachedData.ip) return cachedData;

  const stored = readFromStorage();
  if (stored) return stored;

  if (fetchPromise) return fetchPromise; // deduplicate concurrent calls

  fetchPromise = (async () => {
    try {
      let data: IpData = { ip: '', country: '' };

      try {
        const res = await fetch('/api/ip');
        if (res.ok) {
          const json: { ip: string } = await res.json();
          data.ip = json.ip ?? '';
        }
      } catch {}

      if (data.ip) {
        try {
          const res = await fetch(`https://ipinfo.io/${data.ip}/json`);
          if (res.ok) {
            const json: { ip: string; country?: string } = await res.json();
            data.country = json.country ?? '';
          }
        } catch {}
      }

      if (!data.ip) {
        try {
          const res = await fetch('https://ipinfo.io/json');
          if (res.ok) {
            const json: { ip: string; country?: string } = await res.json();
            data = { ip: json.ip ?? '', country: json.country ?? '' };
          }
        } catch {}
      }

      if (data.ip) {
        cachedData = data;
        writeToStorage(data);
      }

      return cachedData;
    } catch {
      return { ip: '', country: '' };
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

// 🔑 Fire immediately on module load — warms cache before any sync call needs it
if (typeof window !== 'undefined') {
  getClientIp();
}