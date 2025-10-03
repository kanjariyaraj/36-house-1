import React, { FC } from 'react';

const ThreeDBackground: FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"></div>
      
      {/* Floating 3D shapes */}
      <div className="absolute inset-0">
        {/* Large floating sphere */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl animate-float"></div>
        
        {/* Medium floating sphere */}
        <div className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 blur-3xl animate-float-delayed"></div>
        
        {/* Small floating sphere */}
        <div className="absolute top-1/2 left-3/4 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-3xl animate-float-reverse"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-blue-300/30 rotate-45 animate-rotate-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 border border-purple-300/30 rotate-12 animate-rotate-reverse"></div>
      </div>
      
      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(360deg);
          }
        }
        
        @keyframes float-delayed {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(15px) translateX(-15px) rotate(-180deg);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(-360deg);
          }
        }
        
        @keyframes float-reverse {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) translateX(20px) rotate(90deg);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(180deg);
          }
        }
        
        @keyframes rotate-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes rotate-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 18s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-reverse {
          animation: float-reverse 12s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 25s linear infinite;
        }
        
        .animate-rotate-reverse {
          animation: rotate-reverse 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ThreeDBackground;