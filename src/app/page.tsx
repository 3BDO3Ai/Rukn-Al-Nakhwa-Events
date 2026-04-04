import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Partners from '@/components/Partners';
import Reviews from '@/components/Reviews';
import Location from '@/components/Location';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Partners />
        <Reviews />
        <Location />
      </main>
      <Footer />
    </>
  );
}
