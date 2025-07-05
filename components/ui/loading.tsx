import { cn } from '@/lib/utils';
import React from 'react';

// Each stair column is a rect. We'll animate them with different delays/speeds.
const columns = [
    { x: 0, y: 0.33, height: 14, width: 4 }, // left
    { x: 4, y: 5, height: 8.9, width: 4 },  // middle
    { x: 8, y: 9, height: 4.9, width: 4 },  // right
];

const speeds = [1.5, 1.1, 0.8].map(e => e * 1.4); // seconds for each column

export default function Loading({ text, fullHeight }: { text?: string, fullHeight?: boolean }) {
    return (
        <div className={cn('flex flex-col justify-center items-center', fullHeight ? 'flex-1' : '')}>
            {/* SVG loading animation */}
            <div className="flex justify-center items-center h-full" >
                <svg width="56" height="56" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {columns.map((col, i) => (
                        <rect
                            key={i}
                            x={col.x}
                            y={col.y}
                            width={col.width}
                            height={col.height}
                            fill="#121717"
                            style={{
                                transformOrigin: `${col.x + col.width / 2}px 14px`,
                                animation: `loading-bounce ${speeds[i]}s infinite ease-in-out`,
                            }}
                        />
                    ))}
                    {/* TODO: move the CSS animation to the correct place */}
                    <style>{`
          @keyframes loading-bounce {
             0%, 100% { transform: scaleY(1); }
             50% { transform: scaleY(0.02); }
          }
        `}</style>
                </svg>
            </div>
            {text && (
                <div className="text-center mt-4 text-muted-foreground text-sm">
                    {text}
                </div>
            )}
        </div >
    );
}
