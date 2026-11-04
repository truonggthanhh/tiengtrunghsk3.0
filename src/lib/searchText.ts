/** Match Vietnamese labels without requiring accents, including uppercase Đ. */
export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLocaleLowerCase('vi').trim().replace(/\s+/g, ' ');
}
