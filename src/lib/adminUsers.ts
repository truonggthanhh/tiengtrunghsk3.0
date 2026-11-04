export interface ManagedUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  email?: string;
}
export function userDisplayName(user: Pick<ManagedUser, 'first_name' | 'last_name'>) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Chưa có tên';
}
export function isFullUserId(value: string) { return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value); }
export function userNameFilter(value: string) {
  const parts = value.trim().split(/\s+/).slice(0, 5).map(part => part.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[%_]/g, '\\$&'));
  const clauses = parts.map(part => `or(first_name.ilike."%${part}%",last_name.ilike."%${part}%")`);
  return `and(${clauses.join(',')})`;
}
