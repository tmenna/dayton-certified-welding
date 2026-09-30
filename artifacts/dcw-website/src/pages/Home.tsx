import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Industries } from "@/components/Industries";
import { ProjectExperience } from "@/components/ProjectExperience";
import { Materials } from "@/components/Materials";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Industries />
        <ProjectExperience />
        <Materials />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
