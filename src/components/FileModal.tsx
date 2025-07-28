'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
    <div className='w-full'>
      {/* <button onClick={onClose} className='float-right'>
        x
      </button> */}
      {/* <h2 className='mb-4 text-lg text-neutral-600'>File: {path}</h2> */}
      <pre className='w-full border-2 border-sky-800 bg-sky-950 p-5 font-mono text-sm whitespace-pre-wrap text-white'>
        {content}
      </pre>
    </div>
  );
}
