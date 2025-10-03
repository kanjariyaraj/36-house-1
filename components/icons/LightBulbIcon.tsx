import React, { FC, SVGProps } from 'react';

export const LightBulbIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421 0-2.8 0-4.125-.372a9.03 9.03 0 0 1-3.42-3.42c-.372-1.325-.372-2.704 0-4.125A9.03 9.03 0 0 1 7.5 4.5c1.325-.372 2.7-.372 4.125 0a9.03 9.03 0 0 1 3.42 3.42c.372 1.325.372 2.704 0 4.125a9.03 9.03 0 0 1-3.42 3.42Z" />
    </svg>
);