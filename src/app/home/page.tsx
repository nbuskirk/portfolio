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
          className={`${bebasNeue.className} text-4xl text-black sm:text-6xl md:text-7xl`}
        >
          Nathan Buskirk | Front-end Developer
        </h1>
      </section>
    </>
  );
}
