
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20 px-6 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,194,194,0.05)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,194,194,0.08)_0%,rgba(0,0,0,0)_70%)]"></div>
      <div className="container-width">
        <div className="max-w-3xl animate-fade-in">
          <p className="text-lg text-turquoise font-medium mb-3">Hi, I'm Youssef Ahmed</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
            Turning Complex Data <br />
            Into <span className="text-turquoise">Actionable Insights</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl">
            Senior Data Engineer @ Software House specializing in building scalable data platforms and pipelines that drive business decisions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="button-primary">
              View Projects
            </a>
            <a href="#contact" className="px-6 py-3 border border-border rounded-md hover:bg-muted transition duration-200">
              Contact Me
            </a>
          </div>
          
          <div className="mt-20 flex justify-center">
            <a href="#about" className="flex flex-col items-center text-sm text-muted-foreground hover:text-turquoise">
              <span className="mb-2">Scroll Down</span>
              <ArrowDown className="animate-bounce w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
