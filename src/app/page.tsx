import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import Partners from '@/components/Partners';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Partners />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
