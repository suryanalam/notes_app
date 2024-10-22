import React, { useState, createContext } from "react";
import axios from "axios";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const baseUrl = "http://localhost:5000/api";
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: token,
    },
  };

  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState({
    id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  const fetchNotes = async () => {
    console.log("fetch - Notes");
    try {
      const resp = await axios.get(`${baseUrl}/note/getAll`, options);
      if (resp.status !== 200 || !resp?.data?.data) {
        throw new Error("Something went wrong !!");
      }
      setNotes(resp.data.data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const fetchPinnedNotes = async () => {
    console.log("fetch - Pinned Notes");
    try {
      const resp = await axios.get(`${baseUrl}/pinned_note/getAll`, options);
      if (resp.status !== 200 || !resp?.data?.data) {
        throw new Error("Something went wrong !!");
      }
      setPinnedNotes(resp.data.data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <CommonContext.Provider
      value={{
        baseUrl,
        options,
        notes,
        pinnedNotes,
        noteDetails,
        setNoteDetails,
        fetchNotes,
        fetchPinnedNotes,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
