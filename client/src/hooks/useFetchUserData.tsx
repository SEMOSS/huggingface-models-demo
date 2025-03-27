import { useEffect } from "react";
import { userStore } from "../stores/userStore";

const useFetchUserData = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await userStore.fetchUserInfo();
        // await getUserProjectList();
        // await getOpenInsights();
        // await getAvailableEngines();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  return userStore;
};

export default useFetchUserData;
