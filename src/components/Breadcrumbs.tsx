'use client';

import Link from 'next/link';

export default function Breadcrumbs({ path }: { path: string }) {
  const parts = path.split('/').filter(Boolean);
  return (
    <nav className='text-md mb-4 text-white uppercase'>
      <Link href='/file-browser'>Root</Link>
      {parts.map((part, idx) => {
        const link = '/file-browser/' + parts.slice(0, idx + 1).join('/');
        return (
          <span key={link}>
            {' > '}
            <Link href={link}>{part}</Link>
          </span>
        );
      })}
    </nav>
  );
}
