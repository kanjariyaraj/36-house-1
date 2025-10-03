import React, { FC, SVGProps } from 'react';

// This is a static SVG representation for demonstration purposes.
// In a real application, you would use a library like 'qrcode.react' to generate a dynamic QR code.
export const QrCodeIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0 0h7v7H0V0Zm2 2v3h3V2H2Z" />
        <path d="M1 1h5v5H1V1Z" fillRule="evenodd" />
        <path d="M18 0h7v7h-7V0Zm2 2v3h3V2h-3Z" />
        <path d="M19 1h5v5h-5V1Z" fillRule="evenodd" />
        <path d="M0 18h7v7H0v-7Zm2 2v3h3v-3H2Z" />
        <path d="M1 19h5v5H1v-5Z" fillRule="evenodd" />
        <path d="M11 5h2v2h-2V5Zm2 2h2v2h-2V7Zm0 0h2V5h2v4h-2v2h-2V7Zm-2 4h2v2h-2v-2Zm2-2h2v2h-2V9Zm-4 0h2v2H9V9Zm-2 4h2v2H7v-2Zm0-2h2v2H7v-2Zm0-2h2v2H7V9Zm2 2h2v2H9v-2Zm2-2h2v2h-2V9Zm2 0h2v2h-2V9Zm-2-2h2v2h-2V7Zm2 2h2v2h-2V9Zm0 0h2v2h-2V9Zm2 2h2v2h-2v-2Zm-2 2h2v2h-2v-2Zm-4 0h2v2H9v-2Zm-2 0h2v2H7v-2Zm2-4h2v2H9v-2Zm4 2h2v2h-2v-2Zm0-2h2v2h-2V9Zm-2 4h2v2h-2v-2Zm-2 2h2v2h-2v-2Zm4-4h2v2h-2v-2Zm2 4h2v2h-2v-2Zm0 2h2v2h-2v-2Zm2 2h2v2h-2v-2Zm2 2h2v2h-2v-2Zm-4-2h2v2h-2v-2Zm-2-2h2v2h-2v-2Zm-2-2h2v2h-2v-2Zm-2-2h2v2H9v-2Zm-2-2h2v2H7V9Z" />
    </svg>
);