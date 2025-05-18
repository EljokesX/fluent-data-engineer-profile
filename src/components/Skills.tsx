
const Skills = () => {
  const skillCategories = [
    {
      title: "Data Engineering",
      skills: [
        { name: "Apache Spark", level: 95 },
        { name: "Apache Kafka", level: 90 },
        { name: "Airflow", level: 85 },
        { name: "dbt", level: 80 }
      ]
    },
    {
      title: "Cloud & Infrastructure",
      skills: [
        { name: "AWS", level: 90 },
        { name: "GCP", level: 85 },
        { name: "Docker", level: 90 },
        { name: "Kubernetes", level: 75 }
      ]
    },
    {
      title: "Databases",
      skills: [
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 85 },
        { name: "Redis", level: 80 },
        { name: "Snowflake", level: 85 }
      ]
    },
    {
      title: "Languages & Frameworks",
      skills: [
        { name: "Python", level: 95 },
        { name: "SQL", level: 90 },
        { name: "Scala", level: 75 },
        { name: "JavaScript", level: 70 }
      ]
    }
  ];

  return (
    <section id="skills" className="section-padding bg-secondary/30">
      <div className="container-width">
        <h2 className="section-title">Skills & Expertise</h2>
        <p className="section-subtitle">
          My technical skills and areas of expertise in data engineering and related fields
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <div key={category.title} className="card">
              <h3 className="text-xl font-semibold mb-6">{category.title}</h3>
              <div className="space-y-5">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-turquoise h-2.5 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 card bg-gradient-to-r from-background to-secondary/50">
          <h3 className="text-2xl font-semibold mb-4">Certifications & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-medium mb-2">AWS Certified Data Analytics</h4>
              <p className="text-sm text-muted-foreground">Specialized certification for data analytics on AWS</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-medium mb-2">GCP Professional Data Engineer</h4>
              <p className="text-sm text-muted-foreground">Professional certification for data engineering on Google Cloud</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-medium mb-2">Databricks Certified Engineer</h4>
              <p className="text-sm text-muted-foreground">Advanced certification for Spark and Databricks platform</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
