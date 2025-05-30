
import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Grid, 
  MessageSquare, 
  LogOut,
  PlusCircle,
  User
} from "lucide-react";

const AdminLayout = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 shadow-sm h-screen overflow-y-auto fixed">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center">
              <Grid className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-sm text-gray-600">Content Management System</p>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-turquoise text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink
              to="/admin/projects"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-turquoise text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Grid className="h-4 w-4" />
              <span>Projects</span>
            </NavLink>
            
            <NavLink
              to="/admin/messages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-turquoise text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </NavLink>
          </div>

          <div className="mt-6">
            <Link to="/admin/projects/new">
              <Button className="w-full gap-2 bg-turquoise hover:bg-turquoise/90">
                <PlusCircle className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </Link>
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full gap-2 mb-3"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>

          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-turquoise transition-colors"
            >
              ← Return to Website
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="ml-72 w-full">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
