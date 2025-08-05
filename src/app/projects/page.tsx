import Image from 'next/image';

const Projects = () => {
  return (
    <div className='min-h-[calc(100vh-87px)] bg-zinc-100 px-15 py-15'>
      <h1 className='border-b-1 border-gray-200 pb-5 text-4xl font-bold text-gray-700'>
        Projects
      </h1>
      <p className='mt-4 text-gray-600'>
        For the last 20 years I have worked as a software engineer, both front
        end and back end. These are some various examples of previous work,
        where I was either the full stack engineer, or front end engineer. Each
        project has it&apos;s own brief description including technologies and
        software used, some quick info about it and where I could still retrieve
        them--screenshots or photos showing the software.
      </p>
      <p className='mt-4 text-gray-600'>
        I have always been interested in video games and video game development.
        Some of the game demos are made with unity, while others are created
        with html5 game engines like phaser. One day I would love to invest more
        time in game development and see what I can actually come up with if I
        dedicate myself to it for awhile.
      </p>
      <p className='mt-4 text-gray-600'>
        My GitHub account is/was used primary for just experimentation and demo
        purposes. A majority of the software that i&apos;ve worked on is not
        available to be publicly accessible (private internal repos).
      </p>
      <h2 className='border-b-1 border-gray-200 py-15 pb-5 text-2xl font-bold text-gray-700'>
        Applications
      </h2>
      <div className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5'>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/cybersense1.png'
            layout='fill'
            alt='CyberSense UI'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/cybersense2.png'
            layout='fill'
            alt='CyberSense UI'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/cybersense3.png'
            layout='fill'
            alt='CyberSense UI'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/cybersense4.png'
            layout='fill'
            alt='CyberSense UI'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/cybersense5.png'
            layout='fill'
            alt='CyberSense UI'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/cybersense6.png'
            layout='fill'
            alt='CyberSense UI'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/lmb1.png'
            layout='fill'
            alt='LowerMyBills.com'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
      </div>
      <h2 className='border-b-1 border-gray-200 py-15 pb-5 text-2xl font-bold text-gray-700'>
        Games & Demos
      </h2>

      <div className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5'>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ss1.png'
            layout='fill'
            alt='Unity Demo'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ss2.png'
            layout='fill'
            alt='Unity Demo'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ss3.png'
            layout='fill'
            alt='Unity Demo'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ss4.png'
            layout='fill'
            alt='Unity Demo'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ss5.png'
            layout='fill'
            alt='Unity Demo'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/hcastle1.png'
            layout='fill'
            alt='Haunted Castle'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/hcastle2.png'
            layout='fill'
            alt='Haunted Castle'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/hcastle3.png'
            layout='fill'
            alt='Haunted Castle'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/hcastle4.png'
            layout='fill'
            alt='Haunted Castle'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ultima1.png'
            layout='fill'
            alt='Ultima V Phaser'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
        <div className='relative h-60 w-full'>
          <Image
            src='/screenshots/ultima2.png'
            layout='fill'
            alt='Ultima V Phaser'
            className='cursor-pointer border-1 border-gray-200 bg-white p-5 transition-all duration-300 hover:border-sky-600'
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
