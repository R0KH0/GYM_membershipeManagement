import React from 'react';

const StatCard = ({ title, value, change, changeType }) => {
    const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-brand-gray p-6 rounded-xl">
            <p className="text-sm text-brand-light-gray mb-2">{title}</p>
            <p className="text-3xl lg:text-4xl font-bold text-white mb-3">{value}</p>
            {change && (
                <p className={`text-sm ${changeColor}`}>
                    {change}
                </p>
            )}
        </div>
    );
};

export default StatCard;