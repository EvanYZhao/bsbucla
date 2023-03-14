import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import GroupCard from "../components/GroupCard";
import { queryGroupsFromCourseId } from "../database/mongodb";
import { UserAuth } from "../context/AuthContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";


export default function CoursePage() {
  const { user } = UserAuth();
  const { id } = useParams(); // id of the class in the database
  const location = useLocation();
  const [groups, setGroups] = useState([]);

  // Set groups to found groups and otherwise, set equal to empty array because could not find groups
  // That correspond to the same course id
  useEffect(() => {
    const fetchData = async () => {
      if (id !== "" && id) {
        queryGroupsFromCourseId(user.accessToken, id).then((groups) => {
          setGroups(groups);
        });
      }
    };
    fetchData();
  }, [user.accessToken, id, setGroups]);

  return (
    <div className="bg-slate-100 h-full flex flex-col items-center">
      <Grid container direction="column" alignItems="center" paddingTop="16px">
        <Box bgcolor="#e4ecf0" marginTop={2} borderRadius={8} p={2.5} mb={3}>
          <Typography fontFamily="Manrope, sans-serif" fontSize="3.8rem" color="#3a586b">
            <b>{location.state.subjectLabel} {location.state.number}</b>
          </Typography>
          <Typography fontFamily="Manrope, sans-serif" fontSize="2rem" color="#3a586b" gutterBottom>
            {location.state.name}
          </Typography>
        </Box>
        <Box width="95%" bgcolor="#e4ecf0" marginTop={2} borderRadius={4} p={2.5} mb={3}>
          <Typography fontFamily="Manrope, sans-serif" fontSize="2rem" color="#3a586b" gutterBottom>
            Groups
          </Typography>

          <Grid container spacing={2}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <div style={{ padding: "16px" }}>
                  <GroupCard groupID={group._id} place="course"/>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box width="95%" display="flex" justifyContent="center" mb={3}>
        <Button component={Link} to="/creategroup" variant="contained" startIcon={<AddIcon />} color="primary"
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "2rem",
            color: "#3a586b",
            backgroundColor: "#e4ecf0",
            textTransform: "none"
          }}>
          Create a group!
        </Button>
        </Box>
      </Grid>
    </div>
  );
}
