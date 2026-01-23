import { useForm } from "react-hook-form";
import { useCreateChannel } from "@/hooks/use-channels";
import { type InsertChannel } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChannelSchema } from "@shared/schema";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Extend schema for form to handle string -> number coercion
const formSchema = insertChannelSchema.extend({
  subscribers: z.coerce.number(),
  views: z.coerce.number(),
  err: z.coerce.number(),
  price: z.coerce.number(),
});

export default function Admin() {
  const createChannel = useCreateChannel();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      username: "@",
      avatarUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=200&fit=crop",
      category: "Tech",
      subscribers: 0,
      views: 0,
      err: 0,
      price: 0,
      verified: false,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    createChannel.mutate(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Channel created successfully" });
        form.reset();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] pb-20">
      <Navigation onSearch={() => {}} searchValue="" />
      
      <div className="container max-w-xl mx-auto px-4 py-8">
        <div className="bg-[#2c2c2e] rounded-3xl p-6 md:p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6">Add New Channel</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Channel Name</FormLabel>
                      <FormControl>
                        <Input className="bg-zinc-800 border-none text-white focus:ring-primary" placeholder="Tech Daily" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Username</FormLabel>
                      <FormControl>
                        <Input className="bg-zinc-800 border-none text-white focus:ring-primary" placeholder="@techdaily" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Description</FormLabel>
                    <FormControl>
                      <Textarea className="bg-zinc-800 border-none text-white focus:ring-primary min-h-[100px]" placeholder="Channel about..." {...field} />
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
                      <FormLabel className="text-zinc-400">Category</FormLabel>
                      <FormControl>
                        <Input className="bg-zinc-800 border-none text-white focus:ring-primary" placeholder="Tech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-zinc-800 border-none text-white focus:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="subscribers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs">Subscribers</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-zinc-800 border-none text-white focus:ring-primary h-9" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="views"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs">Avg Views</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-zinc-800 border-none text-white focus:ring-primary h-9" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="err"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs">ERR (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" className="bg-zinc-800 border-none text-white focus:ring-primary h-9" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Avatar URL</FormLabel>
                    <FormControl>
                      <Input className="bg-zinc-800 border-none text-white focus:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl mt-4"
                disabled={createChannel.isPending}
              >
                {createChannel.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Create Channel
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
