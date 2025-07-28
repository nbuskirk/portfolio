import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
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
      {/* <section
        id='#about'
        className='relative flex min-h-[calc(100vh-60px)] items-center justify-center border-b-3 border-dotted border-black bg-orange-500 py-15'
      >
        <div className='text-center'>
          <h2
            className={`${bebasNeue.className} absolute bottom-15 left-15 text-6xl font-bold text-orange-400`}
          >
            About Me
          </h2>
          <p className='w-[50vw] text-justify text-lg leading-relaxed text-black'>
            Praesent quis accumsan nisl, id posuere velit. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Nam finibus hendrerit risus, eget semper dui dapibus vel.
            Curabitur non nisl ex. Etiam libero nisi, congue in sagittis
            blandit, bibendum eget felis. Integer consequat tristique ligula id
            bibendum. In hac habitasse platea dictumst. Morbi pharetra nulla
            tortor, quis lacinia eros efficitur ut. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
            Praesent nisl eros, condimentum quis ex sed, eleifend porta sem.
            Praesent facilisis pharetra sem. Integer in pharetra velit, vitae
            condimentum lorem. Quisque sed enim vel nunc faucibus mattis nec
            lobortis augue. Praesent vel quam quis diam scelerisque aliquam.
            Donec eleifend rutrum interdum.
          </p>
          <p className='mt-5 w-[50vw] text-justify text-lg leading-relaxed text-black'>
            Duis urna ipsum, efficitur congue auctor commodo, facilisis a lorem.
            Phasellus tellus purus, venenatis sit amet pharetra sed, ultricies
            ut nisi. Nullam convallis, justo sed vulputate bibendum, ipsum arcu
            maximus libero, non eleifend mi massa accumsan diam. Vestibulum
            tristique dapibus leo, at ornare arcu rutrum sed. Quisque sed lacus
            neque. Suspendisse potenti. Integer placerat ex porta facilisis
            porttitor. In pellentesque ultricies lacus, in consequat ex commodo
            ac. Curabitur mattis sit amet purus pharetra laoreet. Ut eu
            porttitor erat. Donec lacinia dolor dolor, vel eleifend turpis
            molestie sit amet. Sed maximus, lorem nec lobortis pharetra, dui
            odio cursus augue, id sodales leo nunc non purus. Ut maximus nunc
            vitae tempus porttitor. Aenean pellentesque urna mi, sed auctor
            justo elementum sit amet. Maecenas non leo iaculis, efficitur ipsum
            eget, ullamcorper nulla. Ut aliquet tortor sit amet diam efficitur,
            vel aliquet justo gravida.
          </p>
        </div>
      </section>
      <section
        className={`relative flex h-[calc(100vh-60px)] items-center justify-center bg-violet-500`}
      >
        <h2
          className={`${bebasNeue.className} absolute bottom-15 left-15 text-4xl text-violet-400 sm:text-6xl md:text-7xl`}
        >
          Projects
        </h2>
        <div className='grid grid-cols-4 gap-4'>
          <div className='size-50 border-2 border-dotted border-black'>01</div>
          <div className='size-50 border-2 border-dotted border-black'>02</div>
          <div className='size-50 border-2 border-dotted border-black'>03</div>
          <div className='size-50 border-2 border-dotted border-black'>03</div>
          <div className='size-50 border-2 border-dotted border-black'>04</div>
          <div className='size-50 border-2 border-dotted border-black'>05</div>
          <div className='size-50 border-2 border-dotted border-black'>06</div>
          <div className='size-50 border-2 border-dotted border-black'>07</div>
        </div>
      </section> */}
    </>
  );
}
