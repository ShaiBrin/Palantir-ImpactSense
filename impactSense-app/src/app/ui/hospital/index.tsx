"use client";
import React, { useState } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSharedText } from "@/store";
import { Osdk } from "@osdk/client";
import { Hospital } from "@impactsense/sdk";
import client from "@/lib/client";


const HospitalSelect = () => {
  const [selectedValue, setSelectedValue] = useState("0");
  const[hospital, setHospital] =  useState<Osdk.Instance<Hospital>>();

  const fetchHospitals = async (ind: number) => {
    const hospitals: Osdk.Instance<Hospital>[] = [];
    for await (const obj of client(Hospital).asyncIter()) {
      hospitals.push(obj);
    }
    setHospital(hospitals[ind])
  };

  const dispatch = useDispatch();
  const handleEnter = () => {
    fetchHospitals(Number(selectedValue))
    dispatch(setSharedText(selectedValue));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Select a hospital</Typography>
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

      {hospital && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Hospital:</Typography>
          <div className="road-accident">
            
            <div className="info">
              <Typography variant="body1">name: {hospital.name}</Typography>
            </div>


            <div className="info">
              <Typography variant="body1">beds: {hospital.beds}</Typography>
            </div>

            <div className="info">
              <Typography variant="body1">add: {hospital.address}</Typography>
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

export default HospitalSelect;