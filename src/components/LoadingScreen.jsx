function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black"
      data-testid="loading-screen"
      aria-label="Loading"
      role="status"
    >
      {/* Big open spinning circle */}
      <svg className="h-16 w-16 mb-4 animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Outer open circle (arc) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="150"
          strokeDashoffset="80"
          className="text-primary-500"
        />
      </svg>

      {/* Loading text */}
      <span className="text-sm font-medium text-black dark:text-white">Loading...</span>
    </div>
  );
}

export default LoadingScreen;
