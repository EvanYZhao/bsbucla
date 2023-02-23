import React from "react";
import { useParams, useLocation } from "react-router-dom";

export default function CoursePage() {
  const { id } = useParams(); // id of the class in the database
  const location = useLocation();
  return (
    <div>
      {location.state.subjectLabel} {location.state.number}
      <div>{location.state.name}</div>
      <div style={{textAlign: 'center'}}>
        Groups
      </div>
    </div>
  );
}
