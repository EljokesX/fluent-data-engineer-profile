
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { categories } from "@/lib/projectsData";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  year: z.string().min(4, "Year is required"),
  image: z.string().url("Image must be a valid URL"),
  technologies: z.string().min(1, "At least one technology is required"),
  demoUrl: z.string().url("Demo URL must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("GitHub URL must be a valid URL").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      year: new Date().getFullYear().toString(),
      image: "",
      technologies: "",
      demoUrl: "",
      githubUrl: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProject(parseInt(id));
    }
  }, [id, isEditMode]);

  const fetchProject = async (projectId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Convert technologies array to comma-separated string for form
        const techString = Array.isArray(data.technologies) 
          ? data.technologies.join(", ") 
          : data.technologies;
          
        form.reset({
          title: data.title,
          description: data.description,
          category: data.category,
          year: data.year,
          image: data.image,
          technologies: techString,
          demoUrl: data.demoUrl || "",
          githubUrl: data.githubUrl || "",
        });
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project");
      navigate("/admin/projects");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setLoading(true);
      
      // Convert technologies string to array
      const technologiesArray = values.technologies
        .split(",")
        .map(tech => tech.trim())
        .filter(tech => tech !== "");
      
      const projectData = {
        title: values.title,
        description: values.description,
        category: values.category,
        year: values.year,
        image: values.image,
        technologies: technologiesArray,
        demoUrl: values.demoUrl || null,
        githubUrl: values.githubUrl || null,
      };
      
      if (isEditMode) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", id);
          
        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);
          
        if (error) throw error;
        toast.success("Project created successfully");
      }
      
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(isEditMode ? "Failed to update project" : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? "Edit Project" : "New Project"}
      </h1>
      
      {loading && isEditMode ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise mx-auto"></div>
          <p className="mt-4">Loading project...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <FormControl>
                          <select
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                            {...field}
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="2023" 
                            type="number"
                            min="2000"
                            max={new Date().getFullYear() + 1}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project..." 
                        rows={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL*</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies* (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="React, TypeScript, Tailwind CSS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://demo.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username/repo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/projects")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : isEditMode ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
