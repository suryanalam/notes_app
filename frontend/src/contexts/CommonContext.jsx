import React, { useState, createContext } from "react";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const [notesData, setNotesData] = useState([]);
  const [msg, setMsg] = useState("");
  const [updatingNote, setUpdatingNote] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [baseUrl, setBaseUrl]=useState("http://localhost:5000")
  return (
    <CommonContext.Provider
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
    </CommonContext.Provider>
  );
};
