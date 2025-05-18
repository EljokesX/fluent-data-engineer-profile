
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  demoUrl?: string;
  githubUrl?: string;
  year: number;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Real-time Data Pipeline for Financial Analytics",
    description: "Architected and implemented a fault-tolerant data pipeline processing 50TB+ financial data daily with sub-second latency using Apache Kafka, Spark, and MongoDB.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    technologies: ["Apache Kafka", "Spark Streaming", "MongoDB", "Docker"],
    category: "Data Engineering",
    demoUrl: "#",
    githubUrl: "#",
    year: 2023
  },
  {
    id: 2,
    title: "Machine Learning Feature Store",
    description: "Built a high-performance feature store serving 1000+ ML models with real-time feature computation, caching, and monitoring using Redis, PostgreSQL, and Python.",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1000",
    technologies: ["Redis", "PostgreSQL", "Python", "FastAPI", "Kubernetes"],
    category: "Machine Learning",
    demoUrl: "#",
    githubUrl: "#",
    year: 2022
  },
  {
    id: 3,
    title: "Analytics Dashboard for IoT Devices",
    description: "Designed and implemented a scalable IoT analytics platform handling 10M+ events per hour from connected devices with custom visualization dashboards.",
    image: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?q=80&w=1000",
    technologies: ["AWS IoT", "Elasticsearch", "Kibana", "React", "Node.js"],
    category: "IoT Analytics",
    demoUrl: "#",
    year: 2021
  },
  {
    id: 4,
    title: "ETL Framework for Healthcare Data",
    description: "Developed a HIPAA-compliant ETL framework processing structured and unstructured healthcare data from 20+ sources with data quality validation and lineage tracking.",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000",
    technologies: ["Python", "Apache Airflow", "Snowflake", "dbt", "Docker"],
    category: "Healthcare",
    githubUrl: "#",
    year: 2023
  },
  {
    id: 5,
    title: "Data Lakehouse Architecture",
    description: "Implemented a modern data lakehouse solution reducing data processing costs by 40% while enabling high-performance analytics on petabyte-scale data.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
    technologies: ["Azure Data Lake", "Databricks", "Delta Lake", "Azure Synapse"],
    category: "Cloud Architecture",
    demoUrl: "#",
    year: 2022
  },
  {
    id: 6,
    title: "Recommender System Engine",
    description: "Built a scalable, real-time recommender system using collaborative filtering and content-based techniques that increased user engagement by 28%.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    technologies: ["Python", "TensorFlow", "Redis", "FastAPI", "Docker"],
    category: "Machine Learning",
    githubUrl: "#",
    year: 2021
  }
];

export const categories = ["All", "Data Engineering", "Machine Learning", "IoT Analytics", "Healthcare", "Cloud Architecture"];
