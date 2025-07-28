'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FileModal from './FileModal';
import { Folder, File } from 'lucide-react';

export default function FileBrowser({ initialPath }: { initialPath: string }) {
  const [files, setFiles] = useState<
    { name: string; isDirectory: boolean; fullPath: string }[]
  >([]);
  const [modalPath, setModalPath] = useState<string | null>(null);

  files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
  useEffect(() => {
    fetch('/api/list', {
      method: 'POST',
      body: JSON.stringify({ path: initialPath }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setFiles(res.contents);
      });
  }, [initialPath]);

  return (
    <div className='flex space-y-4'>
      <div className='w-64 flex-none'>
        <ul className='text-sm'>
          {files.map((file) =>
            file.isDirectory ? (
              <li key={file.fullPath} className='flex items-center'>
                <Folder size='12' className='mr-2 inline text-gray-600' />
                <Link
                  className='font-medium text-gray-600 uppercase hover:text-sky-600'
                  href={`/file-browser/${file.fullPath}`}
                >
                  {file.name}
                </Link>
              </li>
            ) : (
              <li key={file.fullPath} className='flex items-center'>
                <File size='12' className='mr-2 inline text-gray-600' />
                <span
                  className='cursor-pointer text-gray-600 hover:text-sky-600'
                  onClick={() => setModalPath(file.fullPath)}
                >
                  {file.name}
                </span>
              </li>
            )
          )}
        </ul>
      </div>
      {modalPath && (
        <FileModal path={modalPath} onClose={() => setModalPath(null)} />
      )}
    </div>
  );
}
