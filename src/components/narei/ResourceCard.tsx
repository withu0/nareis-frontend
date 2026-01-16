import React from 'react';
import { FileText, Download } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  category: string;
  description: string;
  downloads: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, category, description, downloads }) => {
  const handleDownload = () => {
    alert(`Downloading: ${title}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-blue-900 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-amber-400" />
        </div>
        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          {category}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{downloads} downloads</span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
