import React from 'react';

const MoodIndicator = ({ mood }) => {
    const getMoodClass = (currentMood) => {
        const moodClasses = {
            happy: 'mood-happy',
            sad: 'mood-sad',
            angry: 'mood-angry',
            relaxed: 'mood-relaxed',
            neutral: 'mood-neutral',
            calm: 'mood-calm',
            excited: 'mood-excited',
            romantic: 'mood-romantic',
            creative: 'mood-creative',
            mysterious: 'mood-mysterious'
        };
        return moodClasses[currentMood] || 'mood-neutral';
    };

    return (
        <div className={`mood-indicator-circle ${getMoodClass(mood)}`}>
            <span className="mood-label">{mood}</span>
        </div>
    );
};

export default MoodIndicator;
