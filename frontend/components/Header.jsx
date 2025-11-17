import React from 'react';

const Header = () => {
    return (
        <header className="flex items-center justify-end p-4 md:p-6 bg-brand-gray border-b border-gray-800">
            <div className="relative">
                <button className="flex items-center space-x-2">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src="https://picsum.photos/100"
                        alt="User"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;