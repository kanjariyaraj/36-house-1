import React, { FC, SVGProps } from 'react';

export const TrophyIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 16.5c-1.493 0-2.703-.977-3.237-2.331h-6.276c-.534 1.354-1.744 2.331-3.237 2.331s-2.703-.977-3.237-2.331h-.634a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75h.634C2.86 6.169 4.07 5.192 5.563 5.192s2.703.977 3.237 2.331h6.398c.534-1.354 1.744-2.331 3.237-2.331s2.703.977 3.237 2.331h.634a.75.75 0 0 1 .75.75v5.169a.75.75 0 0 1-.75.75h-.634c-.534 1.354-1.744 2.331-3.237 2.331Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.25v3.75m6-3.75v3.75" />
    </svg>
);