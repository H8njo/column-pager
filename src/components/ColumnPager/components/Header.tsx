import type { HTMLAttributes, PropsWithChildren } from 'react';
import { KEY } from './keys';

const Header = ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div data-cp={KEY.HEADER} {...props}>
    {children}
  </div>
);

export default Header;
