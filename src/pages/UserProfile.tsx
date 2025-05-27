
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

const profileSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: "",
      lastName: "",
    },
  });

  React.useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();

          if (data) {
            form.setValue('firstName', data.first_name || '');
            form.setValue('lastName', data.last_name || '');
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
        });

      if (error) {
        toast.error('Failed to update profile');
        console.error('Profile update error:', error);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitials = `${form.watch('firstName')?.[0] || ''}${form.watch('lastName')?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Confirmed</p>
                  <p className="text-sm">{user.email_confirmed_at ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Sign In</p>
                  <p className="text-sm">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your first name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
