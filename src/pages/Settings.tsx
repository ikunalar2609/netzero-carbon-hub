
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDarkMode } from "@/context/DarkModeContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <p className="text-muted-foreground">Configure your FarmlyCarbon dashboard preferences</p>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Display Settings</CardTitle>
          <CardDescription>
            Customize your dashboard appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch to dark mode for reduced eye strain and better nighttime viewing
              </p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
