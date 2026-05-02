import svgPaths from '../../public/svg-gfj0lalzlp';
import Image from 'next/image';

const imgLogo = '/logo.svg';
const imgThePresentDefault1 = '/template1.png';
const imgThePresentTerminal1 = '/template2.png';
const imgThePresentNostalgic1 = '/template4.png';
const imgAlbumArt = '/riverMan.png';
const imgDancingDuckKarlo1 = '/duck.png';
const imgThePresentMinecraft1 = '/template3.png';
const imgFacebook1 = '/facebook.png';
const imgInstagram1 = '/instagram.png';

export default function Landing() {
  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden font-sans text-black flex flex-col items-center">
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-16 px-4 md:mt-24">
        {/* Logo */}
        <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56">
          <Image 
            src={imgLogo} 
            alt="logo" 
            fill 
            className="object-contain" 
            priority 
          />
        </div>
        
        
        {/* Descrição */}
        <p className="font-['Inter'] font-light text-[15px] max-w-[340px] tracking-tight mt-6 text-center leading-relaxed">
          A personal space to showcase your current obsessions and crowdsource your next favorite thing. Share what you’re into and get curated recommendations.
        </p>
        
        {/* Botão */}
        <button className="bg-[#d9d9d9] rounded-[20px] px-8 py-3 mt-8 font-['Inter'] font-bold text-[12px] tracking-[-0.5px] hover:bg-gray-300 transition">
          Create your profile
        </button>
      </section>

      {/* 2. MY SONG SECTION */}
      <section className="flex flex-col items-center w-full mt-24 px-4">
        {/* Caixas de Música */}
        <div className="flex items-center justify-center gap-2 md:gap-4 overflow-hidden w-full max-w-lg">
          <div className="w-[50px] h-[50px] md:w-[67px] md:h-[67px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-50" />
          <div className="w-[60px] h-[60px] md:w-[75px] md:h-[75px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-75" />
          
          <div className="w-[80px] h-[80px] md:w-[95px] md:h-[95px] relative rounded-[2px] shrink-0 border border-[#ddd] shadow-md">
            <img alt="Album Art" className="w-full h-full object-cover rounded-[2px]" src={imgAlbumArt} />
          </div>
          
          <div className="w-[60px] h-[60px] md:w-[75px] md:h-[75px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-75" />
          <div className="w-[50px] h-[50px] md:w-[67px] md:h-[67px] bg-[#d9d9d9] rounded-[2px] shrink-0 opacity-50" />
        </div>

        {/* Info da Música */}
        <div className="text-center mt-6">
          <p className="font-['SF_Pro'] font-bold text-[16px]">River Man (1969)</p>
          <p className="font-['SF_Pro'] font-normal text-[14px] mt-1">Nick Drake</p>
        </div>

        {/* Comentário & Pato */}
        <div className="flex items-center gap-3 mt-4">
          <div className="bg-[rgba(217,217,217,0.5)] rounded-[10px] px-4 py-2 flex items-center justify-center">
            <p className="font-['Inter'] font-normal text-[10px]">
              I can’t stop listening to this masterpiece!
            </p>
          </div>
          <img alt="Dancing Duck" className="w-[36px] h-[36px] object-cover" src={imgDancingDuckKarlo1} />
        </div>
      </section>

      {/* 3. PERSONALIZE SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4 w-full max-w-4xl">
        <h2 className="font-['Inter'] font-bold text-[20px] md:text-[24px] tracking-tight">
          Personalize Your Profile
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] max-w-[360px] mt-4 leading-relaxed">
          We respect your <span className="text-[#e47e2b] font-medium">identity</span> and style and encourage you to create the most <span className="text-[#683a14] font-medium">authentic</span> profile page you can!
        </p>

        {/* Galeria de Telefones Sobrepostos */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 mt-12 relative w-full">
          <img alt="Template Default" className="w-[200px] md:w-[238px] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] rounded-md z-10" src={imgThePresentDefault1} />
          <img alt="Template Terminal" className="w-[200px] md:w-[238px] shadow-[0px_4px_15px_rgba(0,0,0,0.25)] rounded-md z-20 md:-ml-8 md:mt-24" src={imgThePresentTerminal1} />
          <img alt="Template Nostalgic" className="w-[200px] md:w-[238px] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] rounded-md z-10 md:-ml-8" src={imgThePresentNostalgic1} />
        </div>
      </section>

      {/* 4. ADD WHAT YOU'RE ON SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4">
        <h2 className="font-['Inter'] font-bold text-[20px] md:text-[24px] tracking-tight">
          Add what you’re on
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] max-w-[360px] mt-4 leading-relaxed">
          From the book on your nightstand to the song on repeat show the world what makes you, <span className="font-bold text-[#830527]">you</span>
        </p>
        
        {/* Telefone Único */}
        <img alt="Template Terminal Single" className="w-[200px] md:w-[248px] mt-12 shadow-lg rounded-md" src={imgThePresentTerminal1} />
      </section>

      {/* 4. ADD WHAT YOU'RE ON SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4">
        <h2 className="font-['Inter'] font-bold text-[20px] md:text-[24px] tracking-tight">
          See recomendations based on you
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] max-w-[360px] mt-4 leading-relaxed">
          The more you share, the smarter it gets. Our AI learns your taste and surfaces people, books, music and ideas you'll actually care about, not just what's trending
        </p>
        
        {/* Telefone Único */}
        <img alt="Template Terminal Single" className="w-[200px] md:w-[248px] mt-12 shadow-lg rounded-md" src={imgThePresentTerminal1} />
      </section>

      {/* 4. ADD WHAT YOU'RE ON SECTION */}
      <section className="flex flex-col items-center text-center mt-32 px-4">
        <h2 className="font-['Inter'] font-bold text-[20px] md:text-[24px] tracking-tight">
          Add friends and see what they are on
        </h2>
        <p className="font-['Inter'] font-normal text-[15px] max-w-[360px] mt-4 leading-relaxed">
          See what your friends are reading, watching and obsessing over.
 in real time, no filter.
        </p>
     </section>

      {/* 5. HORIZONTAL GALLERY */}
      <section className="w-full flex justify-center mt-24 px-4 overflow-hidden">
        <div className="flex flex-row gap-6 items-center overflow-x-auto pb-8 snap-x w-full max-w-5xl">
          <img alt="Template Terminal" className="w-[200px] md:w-[238px] rounded-[20px] snap-center shrink-0 shadow-sm" src={imgThePresentTerminal1} />
          <img alt="Template Minecraft" className="w-[200px] md:w-[238px] rounded-[20px] snap-center shrink-0 shadow-sm" src={imgThePresentMinecraft1} />
          <img alt="Template Nostalgic" className="w-[200px] md:w-[238px] rounded-[20px] snap-center shrink-0 shadow-sm" src={imgThePresentNostalgic1} />
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="w-full bg-[#d9d9d9] mt-12 py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Vector Logo Esquerda */}
        <div className="w-[64px] h-[35px] relative">
          <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 35">
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
        <p className="font-['Inter'] font-normal text-[10px] sm:text-[12px] text-black">
          © 2026 what i’m on. All rights reserved.
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