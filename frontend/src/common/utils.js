// import { jwtDecode} from "jwt-decode"; // Correct import for jwt-decode

// // Function to get the user from localStorage
// export const getUserFromLocalStorage = () => {
//     const userFromLS = localStorage.getItem("token"); // Get the token stored in localStorage
//     try {
//       if (userFromLS) {
//         // Return the parsed user data if found
//         return JSON.parse(userFromLS);
//       } else {
//         return null; // Return null if no user data found
//       }
//     } catch (err) {
//       console.error("Error parsing user data from localStorage:", err);
//       return null; // Return null if there's an error during parsing
//     }
//   };
  

// Function to check if the token has expired
export const isTokenExpired = (token) => {
  try {
    if (token) {
      const decodedToken = jwtDecode(token); // Use jwtDecode function here
      if (decodedToken.exp && decodedToken.exp * 1000 > new Date().getTime()) {
        return false; // Token is still valid
      }
    }
    return true; // Token is expired
  } catch (err) {
    return true; // In case decoding fails, assume the token is expired
  }
};
