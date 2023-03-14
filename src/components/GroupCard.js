import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { queryGroupFromId } from "../database/mongodb";

/**
 * Group card displaying basic group information
 * @param {*} groupID Group ID in MongoDB 'groups' collection
 * @returns {JSX.Element}
 */
export default function GroupCard({ groupID, place }) {
  const { user } = UserAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState({});
  useEffect(() => {
    queryGroupFromId(user?.accessToken, groupID).then((group) => {
      setGroup(group);
    });
  }, [groupID]);

  return (
    <Card sx={{ minWidth: 275, minHeight: 100 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }}>{group?.name}</Typography>
        <Typography sx={{ fontSize: 14 }}>
          {group?.members?.length}
          {group?.maxMembers !== 0 ? "/" + group?.maxMembers : ""}{" "}
          {group?.maxMembers
            ? "people"
            : group?.members?.length > 1
            ? "people"
            : "person"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate(`/group/${groupID}`, { state: place })}>
          {group?.members?.at(0)?.hasOwnProperty("email") ? "View" : "Join"}
        </Button>
      </CardActions>
    </Card>
  );
}
