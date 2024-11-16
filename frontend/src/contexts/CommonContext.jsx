import { useState, createContext } from "react";
import axios from "axios";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState({
    _id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });
  const [sharedNoteLink, setSharedNoteLink] = useState('https://localhost:5000/share/...');

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

  const addPinnedNote = async (payload) => {
    try {
      const resp = await axios.post(
        `${baseUrl}/pinned_note/create`,
        payload,
        options
      );
      if (resp.status !== 201) {
        throw new Error("something went wrong !!");
      }

      // call the GET api's to update the states synchronously !!
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const removePinnedNote = async (id) => {
    try {
      const resp = await axios.delete(
        `${baseUrl}/pinned_note/delete/${id}`,
        options
      );
      if (resp.status !== 200) {
        throw new Error("something went wrong !!");
      }

      // call the GET api's to update the states synchronously !!
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      const resp = await axios.delete(`${baseUrl}/note/delete/${id}`, options);

      if (resp.status !== 200 || !resp?.data?.data) {
        throw new Error("Something went wrong !!");
      }

      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const resetStore = () => {
    setNotes(null);
    setPinnedNotes(null);
    setNoteDetails({
      _id: "",
      title: "",
      content: "",
      createdAt: "",
      updatedAt: "",
    });
  };

  return (
    <CommonContext.Provider
      value={{
        baseUrl,
        options,
        isEditForm,
        showNoteForm,
        showDeleteDialog,
        showShareDialog, 
        noteDetails,
        sharedNoteLink,
        notes,
        pinnedNotes,
        resetStore,
        setToken,
        setIsEditForm,
        setShowNoteForm,
        setShowDeleteDialog,
        setShowShareDialog,
        setNoteDetails,
        setSharedNoteLink,
        addPinnedNote,
        removePinnedNote,
        deleteNote,
        fetchNotes,
        fetchPinnedNotes,
        fetchNoteDetails,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
