'use client';
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}
export default function LoadingSpinner({ size = 'md', text = 'Đang Tải...', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-primary/10 rounded-full`}></div>
        <div className={`${sizeClasses[size]} border-4 border-transparent border-t-primary rounded-full loading-spinner absolute top-0 left-0`}></div>
        <div className={`${sizeClasses[size]} border-4 border-transparent border-r-accent rounded-full loading-spinner absolute top-0 left-0`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className={`${sizeClasses[size]} border-2 border-primary/20 rounded-full animate-pulse absolute top-1 left-1`}></div>
        <div className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  )
}