
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import GridBackground from "./GridBackground";
import GradientDot from "./GradientDot";

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
    <section className="relative py-20 px-4 md:px-8 bg-white">
      <GridBackground gridSize={20} opacity={0.03} />
      <GradientDot x="20%" y="20%" size={350} color="rgba(0, 0, 0, 0.02)" />
      <GradientDot x="75%" y="75%" size={250} color="rgba(0, 200, 0, 0.02)" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">From My Blog Idler Writing Everyday</h2>
            <p className="text-muted-foreground max-w-2xl">
               Idler Writing Everyday gives you access to in-depth analysis and expert insights into the world of carbon finance, carbon markets and environmental legislation, detailed reports from the UNFCCC, COP summits, Emissions Gap Report, World Economic Outlook and much more.
            </p>
          </motion.div>
          
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://idlerwritingeveryday.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Idler Writing Everyday
          </motion.a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <motion.img 
                    initial={{ scale: 1.05 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
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
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full flex justify-between">
                        <span>Read Article</span>
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a 
            href="https://idlerwritingeveryday.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" className="gap-2 shadow-sm">
                View All Articles
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SubstackSection;
