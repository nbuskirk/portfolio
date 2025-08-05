import Link from 'next/link';
const ContactPage = () => {
  return (
    <div className='min-h-[calc(100vh-87px)] bg-zinc-100 px-15 py-15'>
      <h1 className='border-b-1 border-gray-200 pb-5 text-4xl font-bold text-gray-700'>
        Contact
      </h1>
      <p className='mt-4 text-gray-600'>
        To reach me about any professional opportunities, collaborations, or
        inquiries, please feel free to use any of the following methods:
      </p>
      <div className='grid grid-cols-1 gap-5 pt-15 md:grid-cols-3'>
        <div>
          <h2 className='bg-zinc-200 p-5 text-sm font-medium tracking-[3px] text-gray-700 uppercase'>
            Address
          </h2>
          <div className='bg-white p-5'>
            <p className='text-gray-600'>Nathan Buskirk</p>
            <p className='text-gray-600'>110 Aurora Street</p>
            <p className='text-gray-600'>Bethlehem, PA 18018</p>

            <p className='mt-5'>
              <Link
                href='mailto:nbuskirk@gmail.com'
                className='text-gray-600 hover:text-sky-600'
              >
                nbuskirk@gmail.com
              </Link>
            </p>
            <p className='text-gray-600'>(424) 299-0383</p>
          </div>
        </div>
        <div>
          <h2 className='bg-zinc-200 p-5 text-sm font-medium tracking-[3px] text-gray-700 uppercase'>
            Socials
          </h2>
          <div className='bg-white p-5'>
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
        </div>
        <div>
          <h2 className='bg-zinc-200 p-5 text-sm font-medium tracking-[3px] text-gray-600 uppercase'>
            Resume
          </h2>
          <div className='bg-white p-5'>
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
      </div>
    </div>
  );
};

export default ContactPage;
