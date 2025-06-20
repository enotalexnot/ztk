import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdmin() {
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication once on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          credentials: "include",
        });
        
        if (isMounted) {
          if (response.ok) {
            const adminData = await response.json();
            setAdmin(adminData);
            setIsAuthenticated(true);
          } else {
            setAdmin(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setAdmin(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAdmin(data.admin);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setAdmin(null);
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
    },
  });

  return {
    admin,
    isLoading,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}