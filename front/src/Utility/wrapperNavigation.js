import React from "react";
import { useNavigate } from "react-router-dom";
import { EditNavigationBar } from "../Components/NavigationBar/EditNavigationBar";

export function EditNavigationWrapper(props) {
  const navigate = useNavigate();
  return <EditNavigationBar {...props} navigate={navigate}/>;
}