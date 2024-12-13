import { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  // App Data
  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState(null);
  const [sharedNoteDetails, setSharedNoteDetails] = useState(null);
  const [sharedNoteLink, setSharedNoteLink] = useState(
    "http://localhost:3000/share/..."
  );

  // Toggling States
  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Authentication
  const tokenString = localStorage.getItem("token");
  const [token, setToken] = useState(tokenString);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (token === null || token === undefined) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [token]);

  // CONSTANTS VARIABLES
  const baseUrl = "http://localhost:5000/api";
  const options = {
    headers: {
      Authorization: token,
    },
  };

  const fetchNotes = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/note/getAll`, options);
      if (resp.status !== 200 || !resp?.data?.data) {
        throw new Error("Something went wrong !!");
      }
      setNotes(resp.data.data);
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.resp.data.message);
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
      toast.error(err.resp.data.message);
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
      toast.error(err.resp.data.message);
    }
  };

  const fetchSharedNoteDetails = async (link) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/shared_note/get/${link}`,
        options
      );
      const note = resp.data.data?.nid;
      return note;
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.resp.data.message);
      return null;
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
    setSharedNoteLink("http://localhost:3000/share/...");
    setSharedNoteDetails({
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
        token,
        baseUrl,
        options,
        isEditForm,
        showNoteForm,
        showDeleteDialog,
        showShareDialog,
        noteDetails,
        sharedNoteLink,
        sharedNoteDetails,
        notes,
        pinnedNotes,
        isAuthenticated,
        setToken,
        resetStore,
        setIsEditForm,
        setShowNoteForm,
        setShowDeleteDialog,
        setShowShareDialog,
        setNoteDetails,
        setSharedNoteLink,
        setSharedNoteDetails,
        addPinnedNote,
        removePinnedNote,
        fetchNotes,
        fetchPinnedNotes,
        fetchNoteDetails,
        fetchSharedNoteDetails,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
