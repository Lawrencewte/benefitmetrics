import { AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import React from 'react';

interface InsightCalloutProps {
  type: 'info' | 'warning' | 'urgent' | 'strategic';
  title: string;
  content: string;
  color: 'blue' | 'red' | 'green' | 'orange' | 'purple';
  size?: 'small' | 'normal';
}

export default function InsightCallout({ type, title, content, color, size = 'normal' }: InsightCalloutProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="mr-1" />;
      case 'urgent':
        return <AlertTriangle size={16} className="mr-1" />;
      case 'strategic':
        return <TrendingUp size={16} className="mr-1" />;
      default:
        return <Lightbulb size={16} className="mr-1" />;
    }
  };

  const getEmoji = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'urgent':
        return '🚨';
      case 'strategic':
        return '💡';
      default:
        return '💡';
    }
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-800',
      content: 'text-blue-700'
    },
    red: {
      bg: 'bg-red-100',
      border: 'border-l-4 border-red-500',
      text: 'text-red-800',
      content: 'text-red-700'
    },
    green: {
      bg: 'bg-green-100',
      border: 'border-l-4 border-green-500',
      text: 'text-green-800',
      content: 'text-green-700'
    },
    orange: {
      bg: 'bg-orange-100',
      border: 'border-l-4 border-orange-500',
      text: 'text-orange-800',
      content: 'text-orange-700'
    },
    purple: {
      bg: 'bg-purple-100',
      border: 'border-l-4 border-purple-500',
      text: 'text-purple-800',
      content: 'text-purple-700'
    }
  };

  const classes = colorClasses[color];
  const textSize = size === 'small' ? 'text-xs' : 'text-sm';
  const padding = size === 'small' ? 'p-2' : 'p-3';

  return (
    <div className={`mt-3 ${padding} ${classes.bg} rounded ${textSize} ${classes.border}`}>
      <div className={`font-medium ${classes.text} mb-1`}>
        {getEmoji()} {title}:
      </div>
      <p className={classes.content}>{content}</p>
    </div>
  );
}