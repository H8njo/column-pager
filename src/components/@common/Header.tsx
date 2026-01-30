import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
}

const Header = ({ className, name, ...props }: HeaderProps) => {
  return (
    <div
      className={cn(
        'flex h-[52px] flex-shrink-0 flex-col px-6 justify-center items-end border-b border-gray-500',
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-end justify-between px-2">
        <div className="flex flex-row items-end gap-1.5">
          <p className="text-sm">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
