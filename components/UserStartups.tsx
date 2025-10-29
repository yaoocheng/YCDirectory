import React from "react";
import StartupCard from "@/components/StartupCard";
import { Startup } from "@/types/types";

const UserStartups = async ({ id, startupUserData }: { id: string, startupUserData: Startup[] }) => {

  return (
    <>
      {startupUserData.length > 0 ? (
        startupUserData.map((startup) => (
          <StartupCard id={id} key={startup._id} post={startup} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserStartups;
