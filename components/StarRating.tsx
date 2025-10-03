import React, { FC, useState } from 'react';
import { StarIcon } from './icons/StarIcon';
import { SolidStarIcon } from './icons/SolidStarIcon';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    maxRating?: number;
}

const StarRating: FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    readOnly = false,
    maxRating = 5,
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseOver = (index: number) => {
        if (!readOnly) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(index);
        }
    };

    return (
        <div className="flex items-center">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((index) => {
                const isFilled = index <= (hoverRating || rating);
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(index)}
                        onMouseOver={() => handleMouseOver(index)}
                        onMouseLeave={handleMouseLeave}
                        disabled={readOnly}
                        className={`
                            ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                            text-yellow-400 transition-transform duration-150 ease-in-out
                            ${!readOnly && hoverRating ? 'transform scale-110' : ''}
                        `}
                        aria-label={`Rate ${index} out of ${maxRating}`}
                    >
                        {isFilled ? (
                            <SolidStarIcon className="w-6 h-6" />
                        ) : (
                            <StarIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;