'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import svgPaths from '../../public/svg-gfj0lalzlp';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import logo from '../../public/logo.svg';
import template1 from '../../public/template1.png';
import template2 from '../../public/template2.png';
import riverMan from '../../public/riverMan.png';
import duck from '../../public/duck.png';
import template5 from '../../public/template5.png';
import template6 from '../../public/template6.png';
import others from '../../public/others.png';
import suggestions from '../../public/suggestions.png';
import { containerVariants, itemVariants } from '@/utils/animations';

const MotionImage = motion.create(Image);

// Floating animation utility
const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export default function Landing() {
  const router = useRouter();
  const galleryRef = useRef<HTMLDivElement>(null);
  const middleCardRef = useRef<HTMLImageElement>(null);
  const personalizeRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: personalizeRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [2, -2]);

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const centerMiddleCard = () => {
      const gallery = galleryRef.current;
      const card = middleCardRef.current;
      if (!gallery || !card) return;

      const galleryWidth = gallery.offsetWidth;
      const cardWidth = card.offsetWidth;
      const cardOffset = card.offsetLeft;

      gallery.scrollLeft = cardOffset - (galleryWidth - cardWidth) / 2;
    };

    const timeout = setTimeout(centerMiddleCard, 150);
    window.addEventListener('resize', centerMiddleCard);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', centerMiddleCard);
    };
  }, []);

  return (
    <motion.div
      className="bg-white min-h-screen w-full overflow-x-hidden font-sans text-black flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. HERO SECTION */}
      <motion.section
        variants={itemVariants}
        className="flex flex-col items-center text-center mt-16 px-4 md:mt-24 relative"
      >
        <motion.div
          animate={floatingAnimation}
          className="relative w-[203px] h-[145px] md:w-[406px] md:h-[290px]"
        >
          <Image src={logo} alt="logo" className="object-contain block md:hidden w-full h-full" />
          <svg
            className="hidden md:block w-full h-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 64 35"
            aria-hidden="true"
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
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-zinc-500 text-base md:text-lg lg:text-xl max-w-[600px] tracking-tight mt-6 text-center leading-relaxed"
        >
          A personal space to showcase your current obsessions and crowdsource your next favorite
          thing. Share what you&apos;re into and get curated recommendations.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/register')}
          className="bg-black text-white rounded-lg px-8 py-3 mt-12 font-medium tracking-tight hover:bg-zinc-800 transition-colors shadow-lg"
        >
          Create your profile
        </motion.button>
      </motion.section>

      {/* 2. MY SONG SECTION */}
      <motion.section
        variants={itemVariants}
        className="flex flex-col items-center w-full mt-32 px-4"
      >
        <div className="relative flex items-center justify-center gap-3 md:gap-8 overflow-visible w-full max-w-5xl">
          {/* Background shapes for depth */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[300px] h-[300px] bg-zinc-50 rounded-full -z-10 opacity-50 blur-3xl"
          />

          <motion.div
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] bg-zinc-100 rounded-lg shrink-0 opacity-30"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="w-[75px] h-[75px] md:w-[125px] md:h-[125px] lg:w-[160px] lg:h-[160px] bg-zinc-100 rounded-lg shrink-0 opacity-60"
          />

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[240px] lg:h-[240px] relative rounded-xl shrink-0 border-4 border-white shadow-2xl overflow-hidden z-10"
          >
            <Image alt="Album Art" className="w-full h-full object-cover" src={riverMan} />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="w-[75px] h-[75px] md:w-[125px] md:h-[125px] lg:w-[160px] lg:h-[160px] bg-zinc-100 rounded-lg shrink-0 opacity-60"
          />
          <motion.div
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] bg-zinc-100 rounded-lg shrink-0 opacity-30"
          />
        </div>

        <div className="text-center mt-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-bold text-xl md:text-3xl lg:text-4xl tracking-tight"
          >
            River Man (1969)
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl lg:text-2xl mt-2 tracking-tight"
          >
            Nick Drake
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-6 mt-10"
        >
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 flex items-center justify-center shadow-md relative">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-50 border-l border-b border-zinc-100 rotate-45" />
            <p className="text-zinc-600 text-sm md:text-base lg:text-lg tracking-tight font-medium italic">
              &quot;I can&apos;t stop listening to this masterpiece!&quot;
            </p>
          </div>
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Image
              alt="Dancing Duck"
              className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] lg:w-[60px] lg:h-[60px] object-cover drop-shadow-lg"
              src={duck}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 3. PERSONALIZE SECTION */}
      <motion.section
        ref={personalizeRef}
        className="flex flex-col items-center text-center mt-48 px-4 w-full max-w-6xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight"
        >
          <span className="text-[#e47e2b]">Personalize</span> Your Profile
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-base md:text-lg max-w-[700px] mt-6 mb-20 leading-relaxed tracking-tight"
        >
          We respect your identity and style and encourage you to create the most authentic profile
          page you can!
        </motion.p>

        <div className="relative w-full flex justify-center min-h-[500px] md:min-h-[800px] mb-20">
          <motion.div
            style={{ y: y1, rotate: rotate1 }}
            className="absolute z-10 left-1/2 -translate-x-[110%] md:-translate-x-[130%] top-0"
          >
            <MotionImage
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              alt="Template Default"
              className="w-[160px] md:w-[320px] shadow-2xl rounded-2xl border border-zinc-100"
              src={template1}
            />
          </motion.div>

          <motion.div
            style={{ y: y2, rotate: rotate2 }}
            className="absolute z-20 left-1/2 -translate-x-1/2 top-20 md:top-40"
          >
            <MotionImage
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              alt="Template Terminal"
              className="w-[180px] md:w-[360px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-4 border-white rounded-2xl"
              src={template2}
            />
          </motion.div>

          <motion.div
            style={{ y: y3, rotate: rotate3 }}
            className="absolute z-30 left-1/2 translate-x-[10%] md:translate-x-[30%] top-40 md:top-80"
          >
            <MotionImage
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              alt="Template Nostalgic"
              className="w-[160px] md:w-[320px] shadow-2xl rounded-2xl border border-zinc-100"
              src={template6}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* 4. FEATURE SECTIONS */}
      <div className="w-full flex flex-col items-center gap-48 mt-32">
        {/* ADD WHAT YOU'RE ON */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col items-center text-center px-4"
        >
          <div className="max-w-xl">
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
              <span className="text-[#2AADA2]">Add </span> what you&apos;re on
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed tracking-tight">
              From the book on your nightstand to the song on repeat show the world what makes you,{' '}
              <span className="font-bold text-[#830527]">you</span>
            </p>
          </div>
          <motion.div whileHover={{ y: -10, rotate: 1 }} className="mt-16 relative">
            <div className="absolute inset-0 bg-[#2AADA2]/10 blur-3xl -z-10 rounded-full" />
            <Image
              alt="Template Terminal Single"
              className="w-[220px] md:w-[280px] shadow-2xl border-8 border-white"
              src={template2}
            />
          </motion.div>
        </motion.section>

        {/* RECOMMENDATIONS */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col items-center text-center px-4"
        >
          <div className="max-w-xl">
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
              See <span className="text-[#006A00]">recommendations</span> based on you
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed tracking-tight">
              The more you share, the smarter it gets. Our AI learns your taste and surfaces people,
              books, music and ideas you&apos;ll actually care about.
            </p>
          </div>
          <motion.div whileHover={{ y: -10, rotate: -1 }} className="mt-16 relative">
            <div className="absolute inset-0 bg-[#006A00]/10 blur-3xl -z-10 rounded-full" />
            <Image
              alt="Suggestions"
              className="w-[220px] md:w-[280px] shadow-2xl border-8 border-white"
              src={suggestions}
            />
          </motion.div>
        </motion.section>

        {/* FRIENDS */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col items-center text-center px-4"
        >
          <div className="max-w-xl">
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
              Add <span className="text-[#AB0AAB]">friends</span> and see what they are on
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed tracking-tight">
              See what your friends are reading, watching and obsessing over. In real time, no
              filter.
            </p>
          </div>
        </motion.section>
      </div>

      {/* 5. HORIZONTAL GALLERY */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="w-full mt-24 overflow-hidden"
      >
        <div
          ref={galleryRef}
          className="flex flex-row gap-8 items-center overflow-x-auto md:overflow-visible py-20 snap-x snap-mandatory md:snap-none w-full md:justify-center no-scrollbar px-[calc((100vw-240px)/2)] md:px-0"
        >
          <motion.div whileHover={{ scale: 1.02 }} className="shrink-0">
            <Image
              alt="Template Terminal"
              className="w-[240px] md:w-[280px] h-auto aspect-[1/2] object-contain snap-center shadow-xl border-4 border-white bg-white"
              src={template5}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="shrink-0 z-10">
            <Image
              ref={middleCardRef}
              alt="Template Minecraft"
              className="w-[240px] md:w-[280px] h-auto aspect-[1/2] object-contain snap-center shadow-2xl border-4 border-white bg-white"
              src={others}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="shrink-0">
            <Image
              alt="Template Nostalgic"
              className="w-[240px] md:w-[280px] h-auto aspect-[1/2] object-contain snap-center shadow-xl border-4 border-white bg-white"
              src={template6}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* 6. FOOTER */}
      <motion.footer className="w-full self-stretch bg-zinc-50 border-t border-zinc-200 mt-24 py-12 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="w-[64px] h-[35px] relative">
          <svg
            className="block w-full h-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 64 35"
            aria-hidden="true"
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
        <p className="text-zinc-500 text-sm tracking-tight font-medium">
          © 2026 what i&apos;m on. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ y: -2, color: '#000' }}
            className="text-zinc-400 cursor-pointer"
          >
            <FaInstagram className="w-6 h-6" />
          </motion.div>
          <motion.div
            whileHover={{ y: -2, color: '#000' }}
            className="text-zinc-400 cursor-pointer"
          >
            <FaFacebook className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
