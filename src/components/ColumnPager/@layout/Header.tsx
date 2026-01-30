import type { HTMLAttributes, PropsWithChildren } from 'react';
import { DATA_KEY } from '../controls/constants';

const Header = ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div data-key={DATA_KEY.PAGE_HEADER} {...props}>
      {children}
    </div>
  );
};

export default Header;
