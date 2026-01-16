import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Image as ImageIcon, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const materials = [
  { id: 1, title: 'Investor Rights Fact Sheet', type: 'PDF', size: '2.4 MB', downloads: 1247, icon: FileText, image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063056721_de664c4b.webp' },
  { id: 2, title: 'Tax Reform Advocacy Kit', type: 'PDF', size: '3.8 MB', downloads: 892, icon: FileText, image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063058518_ea1f52f3.webp' },
  { id: 3, title: 'Social Media Graphics Pack', type: 'ZIP', size: '15.2 MB', downloads: 634, icon: ImageIcon, image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063060261_a2039095.webp' },
  { id: 4, title: 'Advocacy Training Video', type: 'MP4', size: '124 MB', downloads: 421, icon: Video, image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063061961_1331dfa2.webp' },
  { id: 5, title: 'Letter Templates Collection', type: 'DOCX', size: '1.1 MB', downloads: 1583, icon: FileText, image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063056721_de664c4b.webp' },
  { id: 6, title: 'Talking Points Guide', type: 'PDF', size: '1.8 MB', downloads: 967, icon: FileText, image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063058518_ea1f52f3.webp' },
];

export const AdvocacyMaterials: React.FC = () => {
  const { toast } = useToast();

  const handleDownload = (title: string) => {
    toast({ title: 'Download Started', description: `Downloading ${title}...` });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Advocacy Materials</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {materials.map(material => (
          <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img src={material.image} alt={material.title} className="w-full h-40 object-cover" />
            <div className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <material.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{material.title}</h3>
                  <p className="text-sm text-gray-600">{material.type} • {material.size}</p>
                  <p className="text-xs text-gray-500 mt-1">{material.downloads.toLocaleString()} downloads</p>
                </div>
              </div>
              <Button size="sm" className="w-full" onClick={() => handleDownload(material.title)}>
                <Download className="w-4 h-4 mr-2" />Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
