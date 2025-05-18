
const About = () => {
  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="container-width">
        <h2 className="section-title">About Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="rounded-lg overflow-hidden aspect-square bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=1000" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <h3 className="text-2xl font-semibold mb-5">Data Engineer @ Software House</h3>
            <p className="text-muted-foreground mb-6">
              With over 3 years of experience building data-intensive applications, I specialize in designing and implementing scalable, reliable data platforms and pipelines that turn raw data into valuable business insights.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Experience</h4>
                <p className="text-muted-foreground">
                  Currently leading data engineering initiatives at Lovable AI, previously worked at top tech companies developing data solutions that process petabytes of data daily.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Education</h4>
                <p className="text-muted-foreground">
                  MSc in data Science with specialization in Data Engineering and Analytics, MNU University. BSc in Computer Engineering, MIT.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Approach</h4>
                <p className="text-muted-foreground">
                  I believe in building data systems that are not only technically robust but also aligned with business objectives. My solutions focus on scalability, fault tolerance, and future adaptability.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="#contact" className="button-primary">
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
