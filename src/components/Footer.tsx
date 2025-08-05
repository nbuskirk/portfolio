import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='border-t-3 border-gray-300 bg-zinc-200 p-15 text-gray-800'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        <div>
          <h2 className='mb-[20px] text-sm font-medium tracking-[3px] uppercase'>
            Contact
          </h2>
          <p className='text-gray-600'>Nathan Buskirk</p>
          <p className='text-gray-600'>110 Aurora Street</p>
          <p className='text-gray-600'>Bethlehem, PA 18018</p>
          <p className='mt-5'>
            <Link
              href='mailto:nbuskirk@gmail.com'
              className='text-gray-700 hover:text-sky-600'
            >
              nbuskirk@gmail.com
            </Link>
          </p>
          <p className='text-gray-600'>(424) 299-0383</p>
        </div>
        <div>
          <h2 className='mb-[20px] text-sm font-medium tracking-[3px] uppercase'>
            Socials
          </h2>
          <ul>
            <li>
              <Link
                href='https://github.com/nbuskirk'
                target='_blank'
                className='text-gray-600 hover:text-sky-600'
              >
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href='https://www.linkedin.com/in/nathan-buskirk-9b376017/'
                target='_blank'
                className='text-gray-600 hover:text-sky-600'
              >
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className='mb-[20px] text-sm font-medium tracking-[3px] uppercase'>
            Resume
          </h2>
          <ul>
            <li>
              <Link
                href='/nbresume.pdf'
                target='_blank'
                className='text-neutral-500 hover:text-sky-600'
              >
                PDF
              </Link>
            </li>
            <li>
              <Link
                href='/nbresume.docx'
                target='_blank'
                className='text-neutral-500 hover:text-sky-600'
              >
                DOC
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
