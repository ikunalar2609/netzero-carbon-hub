import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, CheckCircle, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ProfileUpdateData {
  name: string;
  email: string;
  phone: string;
}

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure name is always provided to match ProfileUpdateData requirements
    const updatedProfile = {
      name: formData.name || user?.name || '', // Ensure name is always provided
      email: formData.email,
      phone: formData.phone
    };
    
    updateUserProfile(updatedProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>
      <p className="text-muted-foreground">Manage your profile information to keep your account secure and up-to-date</p>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
          <CardDescription>
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            {isEditing ? (
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">
                  Update Profile
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
                <User className="w-4 h-4 ml-2" />
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
