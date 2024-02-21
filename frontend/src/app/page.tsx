import { lusitana } from '@/app/ui/fonts';
import Logo from '@/app/ui/logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-green-500 p-4 md:h-52">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div />
          <svg
            width="32"
            height="32"
            viewBox="0 0 105 105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M35 0C54.33 0 70 15.67 70 35H69.375H40H35V40V69.375V70C15.67 70 0 54.33 0 35C0 15.67 15.67 0 35 0ZM35 74.375V105H105V35H74.375C74.375 36.6938 74.2681 38.3626 74.0605 40C71.8114 57.748 57.748 71.8114 40 74.0605C38.3626 74.2681 36.6938 74.375 35 74.375ZM40 40H69.014C66.8307 54.9828 54.9828 66.8307 40 69.014V40Z"
              fill="black"
            ></path>
          </svg>
          <p
            className={`text-xl text-gray-800 md:text-3xl md:leading-normal ${lusitana.className}`}
          >
            <strong>Welcome.</strong>Genomic Data, Transformed
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-5 self-start rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/images/hero-desktop.png"
            width={1000}
            height={760}
            className="hero-style hidden md:block"
            alt="Screenshot of the Acme homepage"
          />
        </div>
      </div>
    </main>
  );
}
