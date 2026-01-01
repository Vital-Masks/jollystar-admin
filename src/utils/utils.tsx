export const isAuthData = () => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
        // Parse the userData JSON string
        const userData = JSON.parse(userDataString);
        // Check if userData has the _id property
        // after API
        // if (userData && userData._id) {
        //     return true;
        // } else {
        //     return false;
        // }
        return true;
    } else {
        // Redirect to login page if userData is not present in local storage
        return false;
    }
};

export function isEmpty(obj: {}) {
    return Object.keys(obj).length === 0;
}

export const formatDate = (dateString: string, format?: string): string => {
    const date = new Date(dateString);

    // Extract components
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = String(hours).padStart(2, '0');

    // If custom format is provided, use it (basic implementation)
    if (format) {
        // Simple format replacement for common patterns
        return format
            .replace('dd', day)
            .replace('MM', month)
            .replace('yyyy', String(year))
            .replace('hh', formattedHours)
            .replace('mm', minutes)
            .replace('a', ampm);
    }

    // Default format
    return `${day}-${month}-${year} ${formattedHours}.${minutes}.${seconds} ${ampm}`;
};