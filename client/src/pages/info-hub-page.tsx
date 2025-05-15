import { FC, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen } from "lucide-react";

type ArticleCategory = "All" | "Fitness" | "Nutrition" | "Cycle Insights" | "Wellness";

interface Article {
  id: number;
  title: string;
  description: string;
  category: ArticleCategory;
  readTime: string;
}

const InfoHubPage: FC = () => {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>("All");

  // Sample article data
  const articles: Article[] = [
    {
      id: 1,
      title: "How Workouts Affect Your Mood",
      description: "Discover the connection between exercise and emotional wellbeing throughout your cycle.",
      category: "Fitness",
      readTime: "4 min read"
    },
    {
      id: 2,
      title: "Nutrition Guide: Eating for Your Cycle",
      description: "Learn which foods can help balance hormones and reduce symptoms during different phases.",
      category: "Nutrition",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Understanding Your Menstrual Cycle",
      description: "A comprehensive guide to the four phases and how they affect your body and mind.",
      category: "Cycle Insights",
      readTime: "7 min read"
    },
    {
      id: 4,
      title: "Meditation Techniques for PMS",
      description: "Simple meditation practices to reduce stress and anxiety before your period.",
      category: "Wellness",
      readTime: "5 min read"
    },
    {
      id: 5,
      title: "Strength Training During Your Cycle",
      description: "How to adjust your strength workouts for optimal results throughout your cycle.",
      category: "Fitness",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Anti-Inflammatory Foods for Period Pain",
      description: "Dietary choices that can help reduce inflammation and ease menstrual cramps.",
      category: "Nutrition",
      readTime: "4 min read"
    }
  ];

  // Filter articles based on selected category
  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">FemFit</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-purple-100 p-6">
            <h2 className="text-2xl font-bold text-purple-800 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Info Hub
            </h2>
            <p className="text-purple-700 mt-2">Articles and resources for women's health</p>
          </div>

          {/* Category filters - single row, left-aligned */}
          <div className="px-6 pt-6">
            <div className="flex gap-1.5 pb-2 justify-start flex-wrap">
              {(["All", "Fitness", "Nutrition", "Cycle Insights", "Wellness"] as ArticleCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap
                    ${activeCategory === category 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="p-6">
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="mb-1 text-xs text-gray-500">{article.category}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      <Button variant="link" className="text-purple-600 p-0 h-auto text-sm">
                        Read more
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No articles found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoHubPage;