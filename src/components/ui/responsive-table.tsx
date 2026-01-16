import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      <ScrollArea className="w-full">
        <div className="min-w-full overflow-x-auto">
          <table className={`w-full ${className}`}>
            {children}
          </table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ResponsiveTable;
