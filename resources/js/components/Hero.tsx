import React from "react";

const Hero = () => {
  return (
    <div className="relative h-screen bg-black overflow-hidden overflow-x-hidden">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-10 py-6">
        <div className="px-6 mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-shrink-0">
              <a href="#" title="CoffeuHuy" className="inline-flex">
                {/* <img
                  className="w-auto h-16"
                  src="/logouhuy2.png"
                  alt="BakerStreet"
                /> */}
              </a>
            </div>
          </div>  
        </div>
      </header>

      {/* Background */}
      <div className="absolute top-0 left-0 right-0 bottom-0">
        <img
          className="object-cover w-full h-full"
          src="https://cdn.rareblocks.xyz/collection/bakerstreet/images/hero/3/background.png"
          alt=""
        />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-start h-full px-6 mx-auto max-w-6xl">
        <div className="w-full max-w-2xl">
          <h1 className="font-sans text-base font-normal tracking-tight text-white text-opacity-70">
            ✦ CoffeShop Uhuy ✦
          </h1>
          <p className="mt-6 tracking-tighter text-white">
            <span className="font-sans font-normal text-5xl">
              Your daily cup of 
            </span>
            <br />
            <span className="font-serif italic font-normal text-6xl">
              Happiness
            </span>
          </p>
          <p className="mt-6 font-sans text-base font-normal leading-7 text-white text-opacity-70">
            Setiap tegukan Coffee Uhuy, selalu ada cerita dan kehangatan untuk menemani hari Anda.
          </p>
          <p className="mt-6 font-sans text-lg font-normal text-white">
            Mulai dari Rp 15.000
          </p>

          <div className="flex items-center mt-6 space-x-4">
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-2 font-sans text-base font-semibold transition-all duration-200 rounded-full bg-white text-black hover:bg-opacity-90"
            >
              Menus
            </a>

            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-2 font-sans text-base font-semibold transition-all duration-200 border-2 rounded-full text-white border-white hover:bg-white hover:text-black"
            >
              Outlets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
