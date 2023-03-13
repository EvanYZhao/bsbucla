import { Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { getUserProfile } from "../database/mongodb";

export default function ProfilePage() {
  const { user } = UserAuth();
  const [dbUser, setDbUser] = useState(null);
  console.log(user?.accessToken);

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user?.accessToken);
        setDbUser(profile);
      }
    }
    getProfile();
  }, [user]);

  return(
    <div className="m-10 flex flex-col items-center">
      {JSON.stringify(dbUser)}
      <Card className="
        w-4/5 sm:w-3/5 md:w-2/4 lg:w-2/5 xl:w-2/6 2xl:w-1/4
        flex flex-col
        items-center
        space-y-4
        p-5
        " 
        variant="outlined">
        <img className="w-1/5 rounded-full" src={dbUser?.picture} referrerPolicy='no-referrer' />
        <Typography variant="h4">{dbUser?.name}</Typography>
        <Typography>{dbUser?.email}</Typography>
        <Typography>Major: {dbUser?.major !== '' ? dbUser?.major : 'None'}</Typography>
        <Typography variant="h5">Groups:</Typography>
        
      </Card>
    </div>
  )
}