// Temporarily comment out imports until dependencies are fixed
// import { clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

// Create a simple implementation of the cn function that doesn't rely on external dependencies
export function cn(...inputs) {
  // Simple implementation that joins class names with spaces
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim();
}
