'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
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
  return (
    <nav className='sticky top-0 z-10 flex justify-between border-b-3 border-gray-200 bg-white'>
      <Menu
        size={24}
        className='mx-15 my-5 flex cursor-pointer text-gray-700 md:hidden'
        onClick={() => {
          const menu = document.querySelector('.mobile-menu');
          if (menu) {
            menu.classList.toggle('hidden');
          }
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
    </nav>
  );
};

export default Navbar;
