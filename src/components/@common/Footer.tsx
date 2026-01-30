import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  pageNumber: number;
  contentsName: string;
}

const Footer = ({ pageNumber, contentsName, className, ...props }: FooterProps) => {
  return (
    <div
      className={cn('h-8.5 flex-shrink-0 px-8 pt-1 border-t border-gray-500', className)}
      {...props}
    >
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm">{contentsName}</p>
        <p className="text-sm">{pageNumber}</p>
      </div>
    </div>
  );
};

export default Footer;
