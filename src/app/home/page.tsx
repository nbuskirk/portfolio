import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <>
      <section
        className={`flex h-[calc(100vh-87px)] items-center justify-center bg-zinc-100`}
      >
        <h1
          className={`${bebasNeue.className} text-3xl text-gray-700 sm:text-4xl md:text-5xl lg:text-6xl`}
        >
          Nathan Buskirk | Front-end Developer
        </h1>
      </section>
    </>
  );
}
