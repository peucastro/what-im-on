'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import svgPaths from '../public/svg-gfj0lalzlp';

const imgLogo = '/logo.svg';
const imgThePresentDefault1 = '/template1.png';
const imgThePresentTerminal1 = '/template2.png';
const imgAlbumArt = '/riverMan.png';
const imgDancingDuckKarlo1 = '/duck.png';
const imgThePresentMinecraft1 = '/template3.png';
const imgNatureTemplate = '/template5.png';
const imgPinkTempate = '/template6.png';
const imgFacebook1 = '/facebook.png';
const imgInstagram1 = '/instagram.png';
const imgOthers = '/others.png';
const imgSuggestions = '/suggestions.png';

export default function Landing() {
  const router = useRouter();
  const galleryRef = useRef<HTMLDivElement>(null);
  const middleCardRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const centerMiddleCard = () => {
      middleCardRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
    };

    const frame = requestAnimationFrame(centerMiddleCard);
    window.addEventListener('resize', centerMiddleCard);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', centerMiddleCard);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden font-sans text-black flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-16 px-4 md:mt-24">
        {/* Logo: mobile image / desktop svg (responsive) */}
        <div className="relative w-[203px] h-[145px] md:w-[406px] md:h-[290px]">
          {/* mobile: use simple img for small screens */}
          <img src={imgLogo} alt="logo" className="object-contain block md:hidden w-full h-full" />

          {/* desktop: vector logo for larger screens */}
          <svg
            className="hidden md:block w-full h-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 64 35"
            aria-hidden
          >
            <g id="Vector">
              <path d={svgPaths.p3a023d00} fill="black" />
              <path d={svgPaths.p49ea180} fill="black" />
              <path d={svgPaths.p77d0f00} fill="black" />
              <path d={svgPaths.p7424600} fill="black" />
              <path d={svgPaths.p8da6d80} fill="black" />
              <path d={svgPaths.p257400} fill="black" />
              <path d={svgPaths.p23066e20} fill="black" />
              <path d={svgPaths.p3fe22200} fill="black" />
              <path d={svgPaths.peb30200} fill="black" />
            </g>
          </svg>
        </div>

        {/* Descrição */}
        <p className="font-['Inter'] font-light text-[15px] md:text-[18px] lg:text-[20px] max-w-[600px] tracking-tight mt-6 text-center leading-relaxed">
          A personal space to showcase your current obsessions and crowdsource your next favorite
          thing. Share what you're into and get curated recommendations.
        </p>

        {/* Botão */}
        <button 
          onClick={() => router.push('/register')}
          className="bg-[#d9d9d9] rounded-[20px] px-8 py-3 mt-12 font-['Inter'] font-medium text-[12px] tracking-[-0.5px] hover:bg-orange-500 hover:text-white transition"
        >
          Create your profile
        </button>
      </section>

      {/* 2. MY SONG SECTION */}
      <section className="flex flex-col items-center w-full mt-24 px-4">
        {/* Caixas de Música */}
        <div className="flex items-center justify-center gap-3 md:gap-6 lg:gap-8 overflow-hidden w-full max-w-5xl">
          <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-50" />
          <div className="w-[75px] h-[75px] md:w-[125px] md:h-[125px] lg:w-[160px] lg:h-[160px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-75" />

          <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[190px] lg:h-[190px] relative rounded-[2px] shrink-0 border border-[#ddd] shadow-md">
            <img
              alt="Album Art"
              className="w-full h-full object-cover rounded-[2px]"
              src={imgAlbumArt}
            />
          </div>

          <div className="w-[75px] h-[75px] md:w-[125px] md:h-[125px] lg:w-[160px] lg:h-[160px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-75" />
          <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-50" />
        </div>

        {/* Info da Música */}
        <div className="text-center mt-8">
          <p className="font-['Inter'] font-bold text-[18px] md:text-[24px] lg:text-[32px]">
            River Man (1969)
          </p>
          <p className="font-['Inter'] font-normal text-[16px] md:text-[18px] lg:text-[20px] mt-2">
            Nick Drake
          </p>
        </div>

        {/* Comentário & Pato */}
        <div className="flex items-center gap-4 mt-6">
          <div className="bg-[rgba(217,217,217,0.5)] rounded-[10px] px-5 py-3 flex items-center justify-center">
            <p className="font-['Inter'] font-normal text-[11px] md:text-[13px] lg:text-[14px]">
              I can't stop listening to this masterpiece!
            </p>
          </div>
          <img
            alt="Dancing Duck"
            className="w-[25px] h-[25px] md:w-[px] md:h-[35px] lg:w-[45px] lg:h-[45px] object-cover"
            src={imgDancingDuckKarlo1}
          />
        </div>
      </section>

      {/* 3. PERSONALIZE SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4 w-full max-w-6xl mx-auto">
        <h2 className="font-['Inter'] font-bold text-[24px] md:text-[40px] lg:text-[48px] tracking-tight">
          <span className="text-[#e47e2b] font-bold">Personalize</span> Your Profile
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] md:text-[20px] max-w-[700px] mt-6 mb-16 leading-relaxed">
          We respect your identity and style and encourage you to create the most authentic profile
          page you can!
        </p>

        {/* Contentor com altura generosa para o layout em cascata */}
        <div className="relative w-full flex justify-center min-h-[700px] md:min-h-[900px] mb-20">
          {/* Foto 1 - Topo Esquerda */}
          <motion.img
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
            alt="Template Default"
            /* Aumentamos para w-[280px] no mobile e w-[320px] no desktop */
            className="absolute z-10 w-[200px] md:w-[320px] shadow-xl rounded-[30px] border border-gray-100 
                 left-1/2 -translate-x-[110%] md:-translate-x-[130%] top-0"
            src={imgThePresentDefault1}
          />

          {/* Foto 2 - Centro (Sobrepõe ligeiramente a 1) */}
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 150 }}
            transition={{ duration: 0.8, delay: 0.8 }} /* Delay maior para dar tempo à primeira */
            viewport={{ once: true, margin: '-100px' }}
            alt="Template Terminal"
            className="absolute z-20 w-[200px] md:w-[320px] shadow-2xl rounded-[30px] border-4 border-white 
                 left-1/2 -translate-x-1/2 top-0"
            src={imgThePresentTerminal1}
          />

          {/* Foto 3 - Baixo Direita (Sobrepõe ligeiramente a 2) */}
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 300 }}
            transition={{ duration: 0.8, delay: 1.4 }} /* Delay ainda maior */
            viewport={{ once: true, margin: '-100px' }}
            alt="Template Nostalgic"
            className="absolute z-30 w-[200px] md:w-[320px] shadow-xl rounded-[30px] border border-gray-100
                 left-1/2 translate-x-[10%] md:translate-x-[30%] top-0"
            src={imgPinkTempate}
          />
        </div>
      </section>
      {/* 4. ADD WHAT YOU'RE ON SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4">
        <h2 className="font-['Inter'] font-bold text-[24px] md:text-[30px] lg:text-[40px] tracking-tight">
          <span className="text-[#2AADA2] font-bold">Add</span> what you're on
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] md:text-[18px] lg:text-[20px] max-w-[600px] mt-4 leading-relaxed">
          From the book on your nightstand to the song on repeat show the world what makes you,{' '}
          <span className="font-bold text-[#830527]">you</span>
        </p>

        {/* Telefone Único */}
        <img
          alt="Template Terminal Single"
          className="w-[200px] md:w-[248px] mt-12 shadow-lg rounded-md"
          src={imgThePresentTerminal1}
        />
      </section>

      {/* 4. ADD WHAT YOU'RE ON SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4">
        <h2 className="font-['Inter'] font-bold text-[24px] md:text-[30px] lg:text-[40px] tracking-tight">
          See <span className="text-[#006A00] font-bold">recomendations</span> based on you
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] md:text-[18px] lg:text-[20px] max-w-[600px] mt-4 leading-relaxed">
          The more you share, the smarter it gets. Our AI learns your taste and surfaces people,
          books, music and ideas you'll actually care about, not just what's trending
        </p>

        {/* Telefone Único */}
        <img
          alt="Template Terminal Single"
          className="w-[00px] md:w-[248px] mt-12 shadow-lg rounded-md"
          src={imgSuggestions}
        />
      </section>

      {/* 4. ADD WHAT YOU'RE ON SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4">
        <h2 className="font-['Inter'] font-bold text-[24px] md:text-[30px] lg:text-[40px] tracking-tight">
          Add <span className="text-[#AB0AAB] font-bold">friends</span> and see what they are on
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] md:text-[18px] lg:text-[20px] max-w-[600px] mt-4 leading-relaxed">
          See what your friends are reading, watching and obsessing over. in real time, no filter.
        </p>
      </section>

      {/* 5. HORIZONTAL GALLERY */}
      <section className="w-full flex justify-center mt-24 px-4 overflow-hidden">
        <div
          ref={galleryRef}
          className="flex flex-row gap-6 items-center overflow-x-auto md:overflow-visible pb-8 snap-x snap-mandatory md:snap-none w-full max-w-5xl md:justify-center"
        >
          <div
            className="shrink-0 md:hidden"
            style={{ width: 'calc((100% - 238px) / 2)' }}
            aria-hidden
          />

          <img
            alt="Template Terminal"
            className="w-[200px] md:w-[238px] h-auto aspect-[1/2] object-cover rounded-[20px] snap-center shrink-0 shadow-sm"
            src={imgNatureTemplate}
          />
          <img
            ref={middleCardRef}
            alt="Template Minecraft"
            className="w-[200px] md:w-[238px] h-auto aspect-[1/2] object-cover rounded-[20px] snap-center shrink-0 shadow-sm"
            src={imgOthers}
          />
          <img
            alt="Template Nostalgic"
            className="w-[200px] md:w-[238px] h-auto aspect-[1/2] object-cover rounded-[20px] snap-center shrink-0 shadow-sm"
            src={imgPinkTempate}
          />

          <div
            className="shrink-0 md:hidden"
            style={{ width: 'calc((100% - 238px) / 2)' }}
            aria-hidden
          />
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="w-full bg-[#d9d9d9] mt-12 py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        {' '}
        {/* Vector Logo Esquerda */}
        <div className="w-[64px] h-[35px] relative">
          <svg
            className="block w-full h-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 64 35"
          >
            <g id="Vector">
              <path d={svgPaths.p3a023d00} fill="black" />
              <path d={svgPaths.p49ea180} fill="black" />
              <path d={svgPaths.p77d0f00} fill="black" />
              <path d={svgPaths.p7424600} fill="black" />
              <path d={svgPaths.p8da6d80} fill="black" />
              <path d={svgPaths.p257400} fill="black" />
              <path d={svgPaths.p23066e20} fill="black" />
              <path d={svgPaths.p3fe22200} fill="black" />
              <path d={svgPaths.peb30200} fill="black" />
            </g>
          </svg>
        </div>
        {/* Copyright Centro/Direita */}
        <p className="font-['Inter'] font-normal text-[8px] md:text-[10px] lg:text-[12px] sm:text-[12px] text-black">
          © 2026 what i'm on. All rights reserved.
        </p>
        {/* Redes Sociais */}
        <div className="flex items-center gap-4">
          <img alt="Instagram" className="w-4 h-4 cursor-pointer" src={imgInstagram1} />
          <img alt="Facebook" className="w-4 h-4 cursor-pointer" src={imgFacebook1} />
        </div>
      </footer>
    </div>
  );
}
