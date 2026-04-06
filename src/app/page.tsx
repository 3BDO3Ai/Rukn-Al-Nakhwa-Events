import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AnimatedSection from '@/components/AnimatedSection';

const StatsSection = dynamic(() => import('@/components/StatsSection'));
const Services = dynamic(() => import('@/components/Services'));
const About = dynamic(() => import('@/components/About'));
const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'));
const ContactSection = dynamic(() => import('@/components/ContactSection'));
const Partners = dynamic(() => import('@/components/Partners'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AnimatedSection delay={0.1}><StatsSection /></AnimatedSection>
        <AnimatedSection delay={0.1}><Services /></AnimatedSection>
        <AnimatedSection delay={0.1}><About /></AnimatedSection>
        <AnimatedSection delay={0.1}><WhyChooseUs /></AnimatedSection>
        <AnimatedSection delay={0.1}><ContactSection /></AnimatedSection>
        <AnimatedSection delay={0.1}><Partners /></AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
