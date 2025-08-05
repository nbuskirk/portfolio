'use client';

import { useEffect, useState } from 'react';
import { Folder, File } from 'lucide-react';
import FileModal from './FileModal';

export default function FileBrowser({ initialPath }: { initialPath: string }) {
  const [files, setFiles] = useState<
    { name: string; isDirectory: boolean; fullPath: string }[]
  >([]);
  const [currentPath, setCurrentPath] = useState<string | null>('');
  const [modalOpen, setModalOpen] = useState(false);
  files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
  useEffect(() => {
    fetch('/api/list', {
      method: 'POST',
      body: JSON.stringify({ path: currentPath }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setFiles(res.contents);
      });
  }, [currentPath]);

  return (
    <div className='mt-5 flex'>
      <ul>
        <li>
          <span
            className='cursor-pointer font-medium text-gray-600 uppercase hover:text-sky-600'
            onClick={() => {
              if (currentPath === null || currentPath === '') {
                setCurrentPath(initialPath);
              } else {
                const parentPath = currentPath
                  .split('/')
                  .slice(0, -1)
                  .join('/');
                setCurrentPath(parentPath || initialPath);
              }
            }}
          >
            ..
          </span>
        </li>
        {files.map((file) => (
          <li key={file.fullPath} className='flex items-center'>
            {file.isDirectory ? (
              <Folder size='12' className='mr-2 inline text-gray-600' />
            ) : (
              <File size='12' className='mr-2 inline text-gray-600' />
            )}
            <span
              className={`${file.isDirectory ? 'font-medium' : ''} cursor-pointer text-gray-600 hover:text-sky-600`}
              onClick={() => {
                if (file.isDirectory) {
                  setCurrentPath(file.fullPath);
                } else {
                  setCurrentPath(file.fullPath);
                  setModalOpen(true);
                }
              }}
            >
              {file.name}
            </span>
          </li>
        ))}
      </ul>
      {modalOpen && (
        <FileModal path={currentPath!} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
