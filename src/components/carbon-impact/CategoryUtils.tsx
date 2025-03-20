
import { CheckSquare, CircleDot, Info } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch(status) {
    case "verified":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "at-risk":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch(status) {
    case "verified":
      return <CheckSquare className="h-3.5 w-3.5" />;
    case "pending":
      return <CircleDot className="h-3.5 w-3.5" />;
    case "at-risk":
      return <Info className="h-3.5 w-3.5" />;
    default:
      return <CircleDot className="h-3.5 w-3.5" />;
  }
};
