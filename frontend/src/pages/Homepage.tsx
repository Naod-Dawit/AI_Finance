import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAppDispatch } from "../store/store";
import { fetchDetails, ProfileDetails } from "../features/auth/authSlice";

export default function Homepage() {
  const [data, setData] = useState<ProfileDetails | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You are not logged in ");
      navigate("/signup");
    } else {
      dispatch(fetchDetails()).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          setData(response.payload as ProfileDetails);
        } else {
          alert("Failed to fetch profile details.");
        }
      });
    }
  }, [dispatch, navigate, token]);

  return (
    <div>
      <h1 className="flex justify-center text-2xl ">
        Welcome to AI Finance Management {data ? data.name : "Guest"}
      </h1>
    </div>
  );
}
