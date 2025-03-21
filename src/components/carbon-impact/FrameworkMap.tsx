
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { client } from "@/lib/appwrite";
import { Storage } from "appwrite";

export const FrameworkMap = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // For demo purposes we'll use the local image, but in production this would fetch from Appwrite Storage
        // const storage = new Storage(client);
        // const fileId = 'your-file-id';
        // const result = await storage.getFileView('your-bucket-id', fileId);
        // setImageUrl(result.href);
        
        // Using local image for now
        setImageUrl('/lovable-uploads/32501502-067c-46b3-b21c-5163509bf9ee.png');
        setLoading(false);
      } catch (err) {
        setError("Failed to load framework image");
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Carbon Impact Framework</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full">
          {loading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Loading framework map...</p>
            </div>
          ) : error ? (
            <div className="h-[300px] flex items-center justify-center p-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Carbon Impact Framework" 
              className="w-full object-contain"
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
