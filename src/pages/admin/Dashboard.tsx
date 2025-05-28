
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    projects: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // Get project count
        const { count: projectCount, error: projectError } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });
          
        // Get message count
        const { count: messageCount, error: messageError } = await supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true });
          
        if (projectError) throw projectError;
        if (messageError) throw messageError;
        
        setCounts({
          projects: projectCount || 0,
          messages: messageCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-medium text-lg mb-4">Welcome, {user?.email}</h2>
          <p className="text-muted-foreground mb-6">
            This is your admin dashboard where you can manage all your projects and messages.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-secondary p-4 rounded-md">
              <h3 className="font-medium mb-1">Projects</h3>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-muted rounded"></div>
              ) : (
                <p className="text-2xl font-bold">{counts.projects}</p>
              )}
              <Link 
                to="/admin/projects"
                className="text-turquoise hover:underline text-sm mt-2 block"
              >
                View all projects →
              </Link>
            </div>
            <div className="bg-secondary p-4 rounded-md">
              <h3 className="font-medium mb-1">Messages</h3>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-muted rounded"></div>
              ) : (
                <p className="text-2xl font-bold">{counts.messages}</p>
              )}
              <Link 
                to="/admin/messages"
                className="text-turquoise hover:underline text-sm mt-2 block"
              >
                View all messages →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-medium text-lg mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              to="/admin/projects/new"
              className="block bg-turquoise hover:bg-turquoise/90 text-white p-3 rounded-md text-center"
            >
              Create New Project
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/projects"
                className="bg-secondary hover:bg-secondary/80 p-3 rounded-md text-center"
              >
                Manage Projects
              </Link>
              <Link
                to="/admin/messages"
                className="bg-secondary hover:bg-secondary/80 p-3 rounded-md text-center"
              >
                View Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
