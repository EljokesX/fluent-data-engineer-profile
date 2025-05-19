
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const MessagesList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Message deleted successfully");
      setMessages(messages.filter(message => message.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise mx-auto"></div>
        <p className="mt-4">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>

      {messages.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-lg">No messages found</p>
          <p className="text-muted-foreground mt-2">
            When users submit the contact form, messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-medium">{message.name}</h2>
                  <a 
                    href={`mailto:${message.email}`} 
                    className="text-turquoise hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">
                    {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-line">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesList;
