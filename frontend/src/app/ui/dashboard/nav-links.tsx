'use client';
import { HomeIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Upload', href: '/dashboard', icon: HomeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isSelected = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-green-100 text-green-600': isSelected,
                'hover:bg-gray-200': !isSelected,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
