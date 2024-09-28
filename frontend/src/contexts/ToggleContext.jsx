import React, { useState, createContext } from "react";

export const ToggleContext = createContext();

export const ToggleProvider = ({ children }) => {
  const [notesData, setNotesData] = useState([]);
  const [msg, setMsg] = useState("");
  const [updatingNote, setUpdatingNote] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [baseUrl, setBaseUrl]=useState("https://notes-app-cl3y.onrender.com")
  return (
    <ToggleContext.Provider
      value={{
        notesData,
        setNotesData,
        updatingNote,
        setUpdatingNote,
        confirmDelete, 
        setConfirmDelete,
        msg,
        setMsg,
        baseUrl,
        setBaseUrl
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};
