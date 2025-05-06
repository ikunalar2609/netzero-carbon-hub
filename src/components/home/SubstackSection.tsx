
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

interface SubstackArticle {
  title: string;
  description: string;
  date: string;
  url: string;
}

const articles: SubstackArticle[] = [
  {
    title: "The Journey Begins",
    description: "Reflections on starting a writing practice and the power of daily habits.",
    date: "May 1, 2023",
    url: "https://idlerwritingeveryday.substack.com/p/the-journey-begins"
  },
  {
    title: "Finding Your Voice",
    description: "Exploring the process of developing a unique writing style and perspective.",
    date: "May 5, 2023",
    url: "https://idlerwritingeveryday.substack.com/p/finding-your-voice"
  },
  {
    title: "The Art of Consistency",
    description: "How showing up every day transforms your writing and creative practice.",
    date: "May 10, 2023",
    url: "https://idlerwritingeveryday.substack.com/p/the-art-of-consistency"
  }
];

const SubstackSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">From Our Blog</h2>
            <p className="text-muted-foreground max-w-2xl">
              Thoughts and insights on writing, creativity, and the daily practice of showing up.
            </p>
          </div>
          
          <a 
            href="https://idlerwritingeveryday.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Idler Writing Everyday
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription className="text-sm">{article.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{article.description}</p>
                </CardContent>
                <CardFooter>
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full flex justify-between">
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://idlerwritingeveryday.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="gap-2">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default SubstackSection;
