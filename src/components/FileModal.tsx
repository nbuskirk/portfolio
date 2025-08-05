'use client';

import { useEffect, useState } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

export default function FileModal({
  path,
  onClose,
}: {
  path: string;
  onClose: () => void;
}) {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    fetch('/api/file', {
      method: 'POST',
      body: JSON.stringify({ path }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setContent(res.contents);
        else setContent('Error loading file...');
      });
  }, [path]);

  return (
    <div
      className='fixed top-0 left-0 z-10 h-full w-full bg-black/90'
      onClick={onClose}
    >
      <div className='absolute top-1/2 left-1/2 z-20 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-white p-5'>
        <Scrollbar style={{ width: '100%', height: '100%' }}>
          <pre className='text-sm text-gray-600'>{content}</pre>
        </Scrollbar>
      </div>
    </div>
  );
}
