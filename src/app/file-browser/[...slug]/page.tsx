'use client';
import FileBrowser from '@/components/FileBrowser';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowLeft, House } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
export default function FolderPage({ params }: { params: { slug: string[] } }) {
  const paramss: { slug: string[] } = React.use(params);
  const path = paramss.slug.join('/');
  const router = useRouter();
  return (
    <div className='min-h-[calc(100vh-87px)] bg-zinc-100 px-15 py-15'>
      <div className='max-w-[700px] min-w-[300px] rounded-xl border-2 border-gray-300 bg-gray-200 shadow-xl'>
        <div className='flex border-b-2 border-gray-300 pt-2 pl-2'>
          <h1 className='text-md mb-[-2px] flex rounded-tl-lg rounded-tr-lg border-2 border-b-0 border-gray-300 bg-gray-100 py-2 pr-15 pl-5 text-sm font-medium text-gray-600'>
            Code Explorer
          </h1>
        </div>
        <div className='flex space-x-5 border-b-2 border-gray-200 bg-gray-100 p-2'>
          <button
            className='flex cursor-pointer items-center gap-2 rounded-full p-3 text-gray-700 hover:bg-gray-200'
            onClick={() => router.back()}
          >
            <ArrowLeft size={24} strokeWidth={1} />
          </button>
          <button className='flex cursor-pointer items-center gap-2 rounded-full p-3 text-gray-700 hover:bg-gray-200'>
            <House size={24} strokeWidth={1} onClick={() => router.back()} />
          </button>
          <input
            type='textfield'
            className='m-0 flex-1 rounded bg-white p-2 text-sm text-gray-700 outline-gray-200 placeholder:text-gray-400'
            placeholder='Root Directory'
            defaultValue={path || ''}
          />
          {/* <Breadcrumbs path='' /> */}
        </div>
        <div className='h-[300px] overflow-y-scroll rounded-br-xl rounded-bl-xl bg-white p-5'>
          <FileBrowser initialPath={path || ''} />
        </div>
        {/* <Breadcrumbs path='' /> */}
      </div>
    </div>
  );
}
