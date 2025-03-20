
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import impactMap from "../../../public/lovable-uploads/32501502-067c-46b3-b21c-5163509bf9ee.png";

export const FrameworkMap = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Carbon Impact Framework</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full">
          <img 
            src={impactMap} 
            alt="Carbon Impact Framework" 
            className="w-full object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
};
