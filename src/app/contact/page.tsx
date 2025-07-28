import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
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
            <p className='text-gray-600'>110 Aurora Street</p>
            <p className='text-gray-600'>Bethlehem, PA 18018</p>
            <p>&nbsp;</p>
            <p>
              <Mail size={14} className='inline-block text-gray-600' />
              <Link
                href='mailto:nbuskirk@gmail.com'
                className='pl-5 text-gray-600 hover:text-sky-600'
              >
                nbuskirk@gmail.com
              </Link>
            </p>
            <p className='text-gray-600'>
              <Phone size={14} className='inline-block' />
              <span className='pl-5'>(424) 299-0383</span>
            </p>
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
            <p className='text-gray-600'>DOC</p>
            <p className='text-gray-600'>PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
