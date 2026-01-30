import type { HTMLAttributes, PropsWithChildren } from 'react';
import { DATA_KEY } from '../controls/constants';

const Footer = ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div data-key={DATA_KEY.PAGE_FOOTER} {...props}>
      {children}
    </div>
  );
};

export default Footer;
