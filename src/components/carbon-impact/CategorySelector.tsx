
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CategoryList } from "./CategoryList";
import { carbonImpactCategories } from "./CarbonImpactData";

export const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories = selectedCategory === "all" 
    ? carbonImpactCategories 
    : carbonImpactCategories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-white border rounded-lg p-2">
        <div className="flex space-x-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
          <Button 
            variant={selectedCategory === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="whitespace-nowrap"
          >
            All Categories
          </Button>
          {carbonImpactCategories.map(category => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredCategories.map(category => (
          <CategoryList key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};
