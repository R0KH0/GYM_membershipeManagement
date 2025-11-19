import React from 'react';

const PandaLogo = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="white"/>
        <path d="M50 89.5C28.24 89.5 10.5 71.76 10.5 50C10.5 28.24 28.24 10.5 50 10.5C71.76 10.5 89.5 28.24 89.5 50C89.5 71.76 71.76 89.5 50 89.5Z" fill="white"/>
        <path d="M30 30C25.58 30 22 26.42 22 22C22 17.58 25.58 14 30 14C34.42 14 38 17.58 38 22C38 26.42 34.42 30 30 30Z" fill="black"/>
        <path d="M70 30C65.58 30 62 26.42 62 22C62 17.58 65.58 14 70 14C74.42 14 78 17.58 78 22C78 26.42 74.42 30 70 30Z" fill="black"/>
        <path d="M41 53C38.24 53 36 50.76 36 48C36 45.24 38.24 43 41 43C43.76 43 46 45.24 46 48C46 50.76 43.76 53 41 53Z" fill="black"/>
        <path d="M59 53C56.24 53 54 50.76 54 48C54 45.24 56.24 43 59 43C61.76 43 64 45.24 64 48C64 50.76 61.76 53 59 53Z" fill="black"/>
        <path d="M50 70C46.69 70 44 67.31 44 64C44 63.45 44.45 63 45 63H55C55.55 63 56 63.45 56 64C56 67.31 53.31 70 50 70Z" fill="black"/>
        <path d="M35 50L65 45" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 43L30 38" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M60 43L70 38" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        {/* Headphones */}
        <path d="M20 50C20 33.43 33.43 20 50 20C66.57 20 80 33.43 80 50" stroke="#E60000" strokeWidth="6" strokeLinecap="round"/>
        <rect x="15" y="45" width="15" height="20" rx="5" fill="#E60000" />
        <rect x="70" y="45" width="15" height="20" rx="5" fill="#E60000" />
    </svg>
);

export default Logo;