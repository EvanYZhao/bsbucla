//import useNavigate from "react-router-dom";
//import {CardActions, Button} from "@mui/material";
import { Card, CardContent, Typography } from "@mui/material";

//Class Info Car
export default function ClassInfoCard({ className, classDescription }) {
  //const navigate = useNavigate();
  return (
    <Card sx={{ minWidth: 275, minHeight: 100 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }}>{className}</Typography>
        <Typography sx={{ fontSize: 14 }}>{classDescription}</Typography>
      </CardContent>
    </Card>
  );
}
