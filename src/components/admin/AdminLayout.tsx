
import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Grid, 
  MessageSquare, 
  LogOut,
  PlusCircle 
} from "lucide-react";

const AdminLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-secondary border-r border-border h-screen overflow-y-auto fixed">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your content</p>
        </div>
        
        <nav className="p-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md ${
                isActive
                  ? "bg-turquoise text-white"
                  : "text-muted-foreground hover:bg-secondary/80"
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md ${
                isActive
                  ? "bg-turquoise text-white"
                  : "text-muted-foreground hover:bg-secondary/80"
              }`
            }
          >
            <Grid className="h-4 w-4" />
            <span>Projects</span>
          </NavLink>
          
          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md ${
                isActive
                  ? "bg-turquoise text-white"
                  : "text-muted-foreground hover:bg-secondary/80"
              }`
            }
          >
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </NavLink>

          <Link to="/admin/projects/new">
            <Button className="mt-6 w-full gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </Link>
        </nav>
        
        <div className="p-4 mt-6 border-t border-border">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>

          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="ml-64 w-full">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
