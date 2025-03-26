export const Fetching = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return { success: false, message: "Please login to view complaints" };
  }

  try {
    console.log("Fetching complaints with token:", token);

    const response = await fetch('http://localhost:5000/auth/complain', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
        return { success: false, message: "Session expired. Please login again." };
      }
      throw new Error("Failed to fetch in fetching complaints");
    }

    const data = await response.json();
    console.log("Fetched Complaints Data:", data);
    return data;
  } catch (error) {
    console.error("Error in fetching complaints:", error);
    return { success: false, message: "Failed to fetch complaints" };
  }
};
