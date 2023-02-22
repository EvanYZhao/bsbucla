import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function GroupCard({
  groupName,
  peopleNum,
  peopleTotal,
  groupID,
}) {
  const navigate = useNavigate();
  return (
    <Card sx={{ minWidth: 275, minHeight: 100 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }}>{groupName}</Typography>
        <Typography sx={{ fontSize: 14 }}>
          {peopleNum}/{peopleTotal} people
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate(`/group/${groupID}`)}>Join</Button>
      </CardActions>
    </Card>
  );
}

//do an onclick for the button to route to the group page?
//would you need the group id too?
