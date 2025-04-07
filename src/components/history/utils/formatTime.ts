
export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Convert seconds to a more readable format for display in summary stats
export const formatTimeDisplay = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  
  if (minutes === 0) {
    return `${seconds} sec`;
  } else if (seconds === 0) {
    return `${minutes} min`;
  }
  
  return `${minutes} min ${seconds} sec`;
};
