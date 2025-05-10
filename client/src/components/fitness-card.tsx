import { FC } from "react";
import { Button } from "@/components/ui/button";

interface FitnessCardProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
}

const FitnessCard: FC<FitnessCardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url('${imageUrl}')` }}
      ></div>
      <div className="p-6">
        <h4 className="font-medium text-xl text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <Button
          variant="outline"
          className="w-full py-6 rounded-lg border-2 border-purple-500 text-purple-500 font-medium hover:bg-purple-500 hover:text-white transition-colors"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default FitnessCard;
