import React, { FC, SVGProps } from 'react';

export const ShieldCheckIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.956 11.956 0 0 1 12 3c2.345 0 4.547.632 6.363 1.718l-3.636 3.636m-2.727-2.727-3.636 3.636M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    </svg>
);