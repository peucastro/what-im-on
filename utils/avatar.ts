export function getDefaultAvatarUrl(name: string | null | undefined): string {
  const displayName = name || 'User';
  const encodedName = encodeURIComponent(displayName);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128&bold=true&font-size=0.4`;
}
