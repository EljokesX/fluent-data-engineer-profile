
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  created_at: string;
};

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Project deleted successfully");
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise mx-auto"></div>
        <p className="mt-4">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link to="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-lg mb-4">No projects found</p>
          <Link to="/admin/projects/new">
            <Button>Create your first project</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr 
                  key={project.id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-12 w-20 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">{project.category}</td>
                  <td className="px-4 py-3">{project.year}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Link to={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
