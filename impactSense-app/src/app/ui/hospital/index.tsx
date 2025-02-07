"use client";
import React, { useState, useEffect } from "react";
import { RootState } from "@/store";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSharedText } from "@/store";
import { Osdk } from "@osdk/client";
import { Hospital, RoadAccident } from "@impactsense/sdk";
import client from "@/lib/client";

// Haversine formula to calculate distance between two coordinates
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  console.log("Calculating distance between", lat1, lon1, "and", lat2, lon2);
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log("Distance:", R * c);
  return R * c; // Distance in km
};

const HospitalSelect = () => {
  const sharedText = useSelector((state: RootState) => state.sharedText);
  const [nearestHospital, setNearestHospital] = useState<Osdk.Instance<Hospital> | null>(null);
  const [roadAcc, setRoadAcc] = useState<Osdk.Instance<RoadAccident> | null>(null);
  const dispatch = useDispatch();

  // Fetch road accident details
  useEffect(() => {
    const fetchRoadAccident = async () => {
      if (!sharedText) return;
      console.log(`Fetching road accident with ID: ${sharedText}`);

      try {
        const roadAccident = await client(RoadAccident).fetchOne(sharedText);
        setRoadAcc(roadAccident);
        console.log(`Road accident fetched: ${JSON.stringify(roadAccident)}`);

      } catch (error) {
        console.error("Error fetching road accident:", error);
      }
    };
    fetchRoadAccident();
  }, [sharedText]);

  // Fetch hospitals and find the nearest one
  useEffect(() => {
    const findNearestHospital = async () => {
      if (!roadAcc || !roadAcc.latitude || !roadAcc.longitud) return;
      
      try {
        let closestHospital: Osdk.Instance<Hospital> | null = null;
        let minDistance = Infinity;

        for await (const hospital of client(Hospital).asyncIter()) {
          if (hospital.latitude && hospital.longitude) {
            const distance = getDistance(
              roadAcc.latitude, roadAcc.longitud,
              hospital.latitude, hospital.longitude
            );

            if (distance < minDistance) {
              minDistance = distance;
              closestHospital = hospital;
            }
          }
        }

        setNearestHospital(closestHospital);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    findNearestHospital();
  }, [roadAcc]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Nearest Hospital</Typography>

      {roadAcc && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">Accident ID: {roadAcc.$primaryKey}</Typography>
          <Typography variant="body1">Location: {roadAcc.latitude}, {roadAcc.longitud}</Typography>
        </Box>
      )}

      {nearestHospital ? (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Closest Hospital</Typography>
          <Typography variant="body1">Name: {nearestHospital.name}</Typography>
          <Typography variant="body1">Beds: {nearestHospital.beds}</Typography>
          <Typography variant="body1">Address: {nearestHospital.address}</Typography>
          <Typography variant="body1">
            Location: {nearestHospital.latitude}, {nearestHospital.longitude}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ marginTop: 2 }}>Finding nearest hospital...</Typography>
      )}

      <Button
        onClick={() => dispatch(setSharedText(""))}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default HospitalSelect;
