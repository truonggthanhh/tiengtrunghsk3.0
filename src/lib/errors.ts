/** Normalize thrown SDK, network, and JavaScript values for user-facing errors. */
export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') return new Error(value.message);
  return new Error(typeof value === 'string' ? value : 'Đã xảy ra lỗi không xác định');
}
