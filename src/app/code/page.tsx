import FileBrowser from '@/components/FileBrowser';

export default function Home() {
  return (
    <>
      <div className='min-h-[calc(100vh-87px)] bg-zinc-100 px-15 py-15'>
        <h1 className='border-b-1 border-gray-200 pb-5 text-4xl font-bold text-gray-700'>
          Code
        </h1>
        <p className='mt-4 text-gray-600'>
          Browse through code that has not been uploaded to GitHub. These
          samples span everything from javascript and React code, to Unity C#
          examples. This is a work in progress, so please be patient as I
          continue to add more code and features.
        </p>
        <FileBrowser initialPath='' />
      </div>
    </>
  );
}
