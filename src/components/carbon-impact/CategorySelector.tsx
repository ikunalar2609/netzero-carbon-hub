
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CategoryList } from "./CategoryList";
import { ImpactCategory } from "@/models/carbon-impact.model";
import { getImpactCategories } from "@/services/carbon-impact.service";

export const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<ImpactCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getImpactCategories();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = selectedCategory === "all" 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-500">{error}</p>
        <Button 
          className="mt-2" 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

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
          {categories.map(category => (
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
