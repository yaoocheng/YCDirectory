import React from "react";
import StartupCard from "@/components/StartupCard";
import { Startup } from "@/types/types";

const UserStartups = async ({ startupUserData }: { startupUserData: Startup[] }) => {

  return (
    <>
      {startupUserData.length > 0 ? (
        startupUserData.map((startup) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserStartups;
