import React, { useState, useEffect, useRef } from 'react';

interface MatrixLogoProps {
  version: string;
}

const MatrixLogo: React.FC<MatrixLogoProps> = ({ version }) => {
  const [matrixText, setMatrixText] = useState('M A T R I X');
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const originalText = 'M A T R I X';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&';

  const scrambleEffect = () => {
    let iteration = 0;
    
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
        const scrambled = originalText
            .split('')
            .map((_char, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        setMatrixText(scrambled);

        if (iteration >= originalText.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        iteration += 1 / 3;
    }, 40);
  };
  
  useEffect(() => {
    scrambleEffect(); // Initial scramble
    timeoutRef.current = window.setInterval(scrambleEffect, 5000); // Scramble every 5 seconds
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);


  const glowStyle = {
    textShadow: '0 0 5px currentColor, 0 0 10px currentColor',
  };

  return (
    <div className="font-mono uppercase text-green-400 flex flex-col items-center justify-center tracking-widest p-2 relative">
      <span className="text-lg sm:text-xl md:text-2xl" style={{ ...glowStyle, color: '#ccc' }}>
        FUTURE TASK
      </span>
      <span className="text-4xl sm:text-5xl md:text-6xl font-bold" style={glowStyle}>
        {matrixText}
      </span>
       <span className="absolute bottom-0 right-0 text-xs text-green-700" style={{...glowStyle, color: '#054e05'}}>
        {version}
      </span>
    </div>
  );
};

export default MatrixLogo;