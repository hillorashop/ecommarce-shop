/**
 * Utility to provide API protection headers (API Key and Secret)
 * when communicating with the Admin backend APIs.
 */
export const getAdminApiHeaders = (): Record<string, string> => {
  const apiKey =
    process.env.ADMIN_APP_API_KEY ||
    process.env.NEXT_PUBLIC_ADMIN_APP_API_KEY ||
    "";
  const apiSecret =
    process.env.ADMIN_APP_API_SECRET ||
    process.env.NEXT_PUBLIC_ADMIN_APP_API_SECRET ||
    "";

  return {
    Client_Key: apiKey,
    Client_Secret: apiSecret,
  };
};

/**
 * Standard fetch wrapper that automatically attaches Admin API key and secret headers.
 */
export const fetchWithAdminAuth = async (
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> => {
  const headers = new Headers(init?.headers);

  const authHeaders = getAdminApiHeaders();
  if (authHeaders["Client_Key"] && !headers.has("Client_Key") && !headers.has("client_key")) {
    headers.set("Client_Key", authHeaders["Client_Key"]);
  }
  if (authHeaders["Client_Secret"] && !headers.has("Client_Secret") && !headers.has("client_secret")) {
    headers.set("Client_Secret", authHeaders["Client_Secret"]);
  }

  return fetch(input, {
    ...init,
    headers,
  });
};

