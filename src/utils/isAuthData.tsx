export const isAuthData = () => {
    const userDataString = localStorage.getItem("auth");
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