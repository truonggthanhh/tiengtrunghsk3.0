/** Server adapter contract for the legacy handlers in pages/api.
 * Vite does not register these handlers; deployment needs a server adapter.
 */
export type APIRoute = (context: {
  request: Request;
  url: URL;
  cookies: { get(name: string): { value: string } | undefined };
}) => Response | Promise<Response>;
