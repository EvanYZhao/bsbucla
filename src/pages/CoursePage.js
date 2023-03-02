import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import GroupCard from "../components/GroupCard";
import { UserAuth } from "../context/AuthContext";
import { queryGroupsFromCourseId } from "../database/mongodb";
import { Typography, Grid } from "@mui/material";
import HomeLogo from "../components/HomeLogo";

export default function CoursePage() {
  const { user } = UserAuth();
  const { id } = useParams(); // id of the class in the database
  const location = useLocation();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const curGroups = await queryGroupsFromCourseId(id, user.accessToken);
      setGroups(curGroups);
    };
    fetchData();
  }, [user.accessToken, id]);

  return (
    <Grid container direction="column" alignItems="center">
      <HomeLogo />
      <Typography variant="h5" gutterBottom>
        {location.state.subjectLabel} {location.state.number}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {location.state.name}
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Groups
      </Typography>
      <Grid container spacing={2} justify="center">
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group._id}>
            <GroupCard
              groupName={group.name}
              peopleNum={group.memberCount}
              peopleTotal={5}
              groupID={group._id}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
