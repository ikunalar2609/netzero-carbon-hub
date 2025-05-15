
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

interface SubstackArticle {
  title: string;
  description: string;
  date: string;
  url: string;
  image: string;
}

const articles: SubstackArticle[] = [
  {
    title: "What Kunal Think: Market for Correcting Mistakes",
    description: "Human complexity is no less complex, capable of drying up lakes and making deserts bloom. But before jumping to environmental conclusions, take a closer look at the full story.",
    date: "May 1, 2023",
    url: "https://idlerwritingeveryday.substack.com/p/what-kunal-think-market-for-correcting",
    image: "/lovable-uploads/a7ee8375-2b69-4e51-840d-a877269d0037.png"
  },
  {
    title: "JSW Steel's Climate Action Report: Balancing Economic Growth and Climate Responsibility",
    description: "JSW Steel's Climate Action Report underscores critical junction of climate change and economic growth in India....",
    date: "May 5, 2023",
    url: "https://idlerwritingeveryday.substack.com/p/jsw-steels-climate-action-report",
    image: "/lovable-uploads/f5feef21-d5ea-4dfc-80ed-f9713d106f7c.png"
  },
  {
    title: "Global Carbon Council (GCC) launched two tools : GCCTA001 and GCCTA008",
    description: "Global Carbon Council (GCC) has launched two new tools aimed at improving the accuracy and standardization of GHG emissions and carbon stock estimations in Nature based Solutions (NbS) projects.",
    date: "May 10, 2023",
    url: "https://idlerwritingeveryday.substack.com/p/global-carbon-council-gcc-launched",
    image: "/lovable-uploads/f4f84a9a-0e26-4a8a-a438-50b4f12c14f0.png"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-3">From My Blog Idler Writing Everyday</h2>
            <p className="text-muted-foreground max-w-2xl">
               Idler Writing Everyday gives you access to in-depth analysis and expert insights into the world of carbon finance, carbon markets and environmental legislation, detailed reports from the UNFCCC, COP summits, Emissions Gap Report, World Economic Outlook and much more. Whether you're an industry professional, policymaker or climate enthusiast, Idler Writing Everyday ensures you stay informed about the latest trends, policies and developments shaping the global carbon landscape. Don't miss out on essential updates that influence climate action and sustainability efforts worldwide.
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
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
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
