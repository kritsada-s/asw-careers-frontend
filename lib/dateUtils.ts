/**
 * Checks if a given date string is not expired (is in the future)
 * @param dateString ISO date string with timezone (e.g., "2024-11-28T14:35:00.9093059+07:00")
 * @returns boolean - true if date is not expired, false if expired
 */
export function isNotExpired(dateString: string): boolean {
  try {
    // Parse the input date string
    const expiryDate = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(expiryDate.getTime())) {
      console.error('Invalid date format');
      return false;
    }

    // Get current date
    const now = new Date();

    // Compare dates
    return expiryDate > now;
  } catch (error) {
    console.error('Error checking date expiration:', error);
    return false;
  }
}

// Alternative version with more detailed error handling
export function checkExpiration(dateString: string): { 
  isValid: boolean;
  isExpired: boolean;
  error?: string;
} {
  try {
    const expiryDate = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(expiryDate.getTime())) {
      return {
        isValid: false,
        isExpired: true,
        error: 'Invalid date format'
      };
    }

    const now = new Date();
    const isExpired = expiryDate <= now;

    return {
      isValid: true,
      isExpired,
    };
  } catch (error) {
    return {
      isValid: false,
      isExpired: true,
      error: 'Error processing date'
    };
  }
}

// Utility function to get remaining time
export function getRemainingTime(dateString: string): {
  expired: boolean;
  remaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
} {
  try {
    const expiryDate = new Date(dateString);
    const now = new Date();

    if (isNaN(expiryDate.getTime())) {
      throw new Error('Invalid date');
    }

    const diffMs = expiryDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      return { expired: true };
    }

    // Calculate remaining time
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return {
      expired: false,
      remaining: {
        days,
        hours,
        minutes,
        seconds
      }
    };
  } catch (error) {
    return { expired: true };
  }
}