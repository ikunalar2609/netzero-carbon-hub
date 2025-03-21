
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getStatusColor, getStatusIcon } from "./CategoryUtils";

interface CategoryProps {
  category: {
    id: string;
    name: string;
    subcategories: {
      name: string;
      status: string;
      info: string;
    }[];
  };
}

export const CategoryList = ({ category }: CategoryProps) => {
  return (
    <Card key={category.id}>
      <CardHeader className="pb-2">
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.subcategories.map((subcat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">{subcat.name}</span>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">{subcat.info}</p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(subcat.status)}`}>
                {getStatusIcon(subcat.status)}
                <span>
                  {subcat.status === "verified" 
                    ? "Verified" 
                    : subcat.status === "pending" 
                      ? "Pending" 
                      : "At Risk"}
                </span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
