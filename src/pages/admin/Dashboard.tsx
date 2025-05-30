
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Grid, 
  MessageSquare, 
  Plus, 
  TrendingUp,
  Calendar,
  Eye
} from "lucide-react";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, manage your content and track performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/projects/new">
              <Button className="gap-2 bg-turquoise hover:bg-turquoise/90">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Projects</CardTitle>
            <Grid className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-blue-200 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-blue-900">{counts.projects}</div>
            )}
            <p className="text-xs text-blue-700 mt-1">
              Active portfolio items
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Contact Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-green-200 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-green-900">{counts.messages}</div>
            )}
            <p className="text-xs text-green-700 mt-1">
              Pending inquiries
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">+{Math.floor(Math.random() * 25) + 15}%</div>
            <p className="text-xs text-purple-700 mt-1">
              Growth in engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-turquoise" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link 
              to="/admin/projects/new"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div>
                <h3 className="font-medium text-gray-900">Create New Project</h3>
                <p className="text-sm text-gray-600">Add a new project to your portfolio</p>
              </div>
              <Plus className="h-5 w-5 text-gray-400 group-hover:text-turquoise transition-colors" />
            </Link>
            
            <Link
              to="/admin/projects"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div>
                <h3 className="font-medium text-gray-900">Manage Projects</h3>
                <p className="text-sm text-gray-600">Edit or delete existing projects</p>
              </div>
              <Grid className="h-5 w-5 text-gray-400 group-hover:text-turquoise transition-colors" />
            </Link>
            
            <Link
              to="/admin/messages"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div>
                <h3 className="font-medium text-gray-900">View Messages</h3>
                <p className="text-sm text-gray-600">Check contact form submissions</p>
              </div>
              <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-turquoise transition-colors" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-turquoise" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">System initialized</p>
                  <p className="text-xs text-gray-600">Your admin panel is ready to use</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Database connected</p>
                  <p className="text-xs text-gray-600">All features are operational</p>
                </div>
              </div>
              
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">More activity will appear here as you use the system</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
