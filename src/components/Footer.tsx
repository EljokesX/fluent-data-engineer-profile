
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-8">
      <div className="container-width px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#home" className="text-xl font-bold">
              <span className="text-turquoise">Youssef</span> Ahmed
            </a>
            <p className="text-muted-foreground mt-2 text-sm">
              Turning complex data into actionable insights
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6 mb-4">
              <a href="#about" className="text-sm hover:text-turquoise transition-colors">
                About
              </a>
              <a href="#projects" className="text-sm hover:text-turquoise transition-colors">
                Projects
              </a>
              <a href="#skills" className="text-sm hover:text-turquoise transition-colors">
                Skills
              </a>
              <a href="#contact" className="text-sm hover:text-turquoise transition-colors">
                Contact
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Youssef Ahmed. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
