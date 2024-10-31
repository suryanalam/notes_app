import { useState, createContext } from "react";
import axios from "axios";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState({
    _id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  const baseUrl = "http://localhost:5000/api";
  const tokenString = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: token,
    },
  };

  // Set the token when it is present in local storage but the state is null
  if (!token && tokenString) {
    setToken(tokenString);
  }

  const fetchNotes = async () => {
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

  const fetchNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/note/get/${id}`, options);
      if (resp.status !== 200 || !resp?.data?.data) {
        throw new Error("Somethng went wrong !!");
      }
      setNoteDetails(resp.data.data);
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
        showNoteForm,
        isEditForm,
        setToken,
        setNoteDetails,
        fetchNotes,
        fetchPinnedNotes,
        fetchNoteDetails,
        setShowNoteForm,
        setIsEditForm,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
