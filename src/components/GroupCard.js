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
      <CardContent sx={{ 
        fontFamily: "Manrope, sans-serif",
        fontWeight: "bold",
      }}>
        <Typography sx={{fontFamily: "Manrope, sans-serif", fontSize: 20, color: "#3a586b" }}>{group?.name}</Typography>
        <Typography sx={{fontFamily: "Manrope, sans-serif", color: "#3a586b" }}>
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
        <Button sx={{ color: "#3a586b", border: "1px solid rgba(58, 88, 107, 0.5)" }} onClick={() => navigate(`/group/${groupID}`)}>
          {group?.members?.at(0)?.hasOwnProperty("email") ? "View" : "Join"}
        </Button>
      </CardActions>
    </Card>
  );
}