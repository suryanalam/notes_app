import React, { useState, createContext } from "react";

export const ToggleContext = createContext();

export const ToggleProvider = ({ children }) => {
  const [notesData, setNotesData] = useState([]);
  const [msg, setMsg] = useState("");
  const [updatingNote, setUpdatingNote] = useState({});
  return (
    <ToggleContext.Provider
      value={{
        notesData,setNotesData,
        updatingNote,setUpdatingNote,
        msg, setMsg
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};
