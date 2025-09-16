import React from "react";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const UserStartups = async ({ startupUserData }: { startupUserData: StartupTypeCard[] }) => {

  return (
    <>
      {startupUserData.length > 0 ? (
        startupUserData.map((startup: StartupTypeCard) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserStartups;
