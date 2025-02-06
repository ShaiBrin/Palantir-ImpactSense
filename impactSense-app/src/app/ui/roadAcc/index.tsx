"use client";
import React, { useState } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSharedText } from "@/store";
import { Osdk } from "@osdk/client";
import { RoadAccident } from "@impactsense/sdk";
import client from "@/lib/client";


const RoadAccSelect = () => {
  const [selectedValue, setSelectedValue] = useState("0");
  const[roadAcc, setRoadAcc] =  useState<Osdk.Instance<RoadAccident>>();

  const fetchRoadAcc = async (ind: number) => {
    const roadAccidents: Osdk.Instance<RoadAccident>[] = [];
    for await (const obj of client(RoadAccident).asyncIter()) {
      roadAccidents.push(obj);
    }
    setRoadAcc(roadAccidents[ind])
  };

  const dispatch = useDispatch();
  const handleEnter = () => {
    fetchRoadAcc(Number(selectedValue))
    dispatch(setSharedText(selectedValue));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Select an accident</Typography>
      <Select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        fullWidth
        sx={{ marginTop: 2, marginBottom: 2 }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              overflowY: 'auto',
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        {Array.from({ length: 476 }, (_, i) => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>

      {roadAcc && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Road Accident:</Typography>
          <div className="road-accident">
            
            <div className="info">
              <Typography variant="body1">Date: {roadAcc.date}</Typography>
            </div>


            <div className="info">
              <Typography variant="body1">Event: {roadAcc.harmEvname}</Typography>
            </div>

            <div className="info">
              <Typography variant="body1">Fatalities: {roadAcc.fatals}</Typography>
            </div>
          </div>
        </Box>
      )}

      <Button
        onClick={handleEnter}
        variant="contained"
        color="primary"
        fullWidth
      >
        Enter
      </Button>
    </Box>
  );
};

export default RoadAccSelect;