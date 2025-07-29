'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import { X } from 'lucide-react';
interface MenuLink {
  name: string;
  href: string;
  action?: () => void;
  dropdown?: MenuLink[];
  icon?: React.ReactNode;
}

const primaryMenuLinks: MenuLink[] = [
  { name: 'Home', href: '/home' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Code', href: '/file-browser' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <nav className='sticky top-0 z-10 flex justify-between border-b-3 border-gray-200 bg-white'>
      <Menu
        size={24}
        className='mx-15 my-5 flex cursor-pointer text-gray-700 md:hidden'
        onClick={() => {
          setMobileMenu(!mobileMenu);
        }}
      />
      <ul className='hidden w-full flex-col space-x-0 px-15 sm:items-center md:flex md:flex-row'>
        {primaryMenuLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={clsx(
                `flex p-8 text-sm font-medium tracking-[3px] uppercase transition-all duration-300 hover:bg-zinc-100 hover:text-sky-600`,
                pathname.includes(link.href)
                  ? 'bg-zinc-100 text-sky-600'
                  : 'text-gray-700'
              )}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      {mobileMenu && (
        <div className='absolute top-0 left-0 z-20 h-screen w-[calc(100vw-100px)] border-r-3 border-neutral-200 bg-white opacity-95'>
          <X
            size='24'
            className='absolute top-5 right-5 cursor-pointer text-neutral-800'
            onClick={() => setMobileMenu(!mobileMenu)}
          />
          <ul className='mt-15'>
            {primaryMenuLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenu(!mobileMenu)}
                  className={clsx(
                    `flex p-8 text-sm font-medium tracking-[3px] uppercase transition-all duration-300 hover:bg-zinc-100 hover:text-sky-600`,
                    pathname.includes(link.href)
                      ? 'bg-zinc-100 text-sky-600'
                      : 'text-gray-700'
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
