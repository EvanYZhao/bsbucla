import { Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { getUserProfile, queryGroupFromId } from "../database/mongodb";

export default function ProfilePage() {
  const { user } = UserAuth();
  const [dbUser, setDbUser] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user?.accessToken);
        setDbUser(profile);
        const groupsData = [];
        for (const group of profile?.groups) {
          const groupData = await queryGroupFromId(user?.accessToken, group);
          groupsData.push(groupData);
        }
        setGroups(groupsData);
      }
    }
    getProfile();
  }, [user]);

  return(
    <div className="m-10 flex flex-col items-center h-max">
      <Card className="
        w-4/5 sm:w-3/5 md:w-2/4 lg:w-2/5 xl:w-2/6 2xl:w-1/4
        flex flex-col
        items-center
        space-y-4
        p-5
        " 
        variant="outlined"
        sx={{ boxShadow: 2, borderRadius: '10%' }}
        >
        <div className="
          flex flex-col
          items-center
          space-y-2
          my-5
        ">
          <img className="w-max rounded-full" src={dbUser?.picture} referrerPolicy='no-referrer' />
          <Typography variant="h5">{dbUser?.name}</Typography>
          <Typography variant="body1">{dbUser?.email}</Typography>
          {/* <Typography variant="body1">Major: {dbUser?.major !== '' ? dbUser?.major : 'None'}</Typography> */}
        </div>
        <div className="flex flex-col items-center w-1/2">
          <Typography variant="h5">My Groups:</Typography>
          {
            groups?.map(group => 
              <Link to={`/group/${group._id}`} className="py-3 w-full text-center">
                  <Card hoverable>
                    <Typography variant="h6">{group?.name}</Typography>
                  </Card>
              </Link>
            )
          }
        </div>
      </Card>
    </div>
  )
}