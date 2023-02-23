import React from "react";
import { useParams } from "react-router-dom";

export default function GroupPage() {
  const { id } = useParams();
  return <div>Group {id}</div>;
}
