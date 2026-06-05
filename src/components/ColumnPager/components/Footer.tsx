import type { HTMLAttributes, PropsWithChildren } from 'react';
import { KEY } from './keys';

const Footer = ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div data-cp={KEY.FOOTER} {...props}>
    {children}
  </div>
);

export default Footer;
