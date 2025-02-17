import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const navigate = useNavigate();

  // Authentication
  const tokenString = localStorage.getItem("token");
  const [token, setToken] = useState(tokenString);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  // CONSTANTS
  const baseUrl = "http://localhost:5000/api";
  const options = {
    headers: { Authorization: token },
  };

  // Toggling States
  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Notes Data
  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState(null);
  const [sharedNoteDetails, setSharedNoteDetails] = useState(null);
  const [sharedNoteLink, setSharedNoteLink] = useState(
    "http://localhost:3000/share/..."
  );

  const fetchNotes = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/note/getAll`, options);
      if (resp.status !== 200) {
        throw new Error("Something went wrong !!");
      }
      setNotes(resp.data.data);
    } catch (err) {
      toast.error(err.resp.data.message);
    }
  };

  const fetchPinnedNotes = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/pinned_note/getAll`, options);
      if (resp.status !== 200) {
        throw new Error("Something went wrong !!");
      }
      setPinnedNotes(resp.data.data);
    } catch (err) {
      toast.error(err.resp.data.message);
    }
  };

  const fetchNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/note/get/${id}`, options);
      if (resp.status !== 200) {
        throw new Error("Somethng went wrong !!");
      }
      setNoteDetails({ ...resp.data.data, id: resp.data.data?._id });
    } catch (err) {
      toast.error(err.resp.data.message);
    }
  };

  const fetchSharedNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/shared_note/get/${id}`, options);
      if (resp.status !== 200) {
        throw new Error("Somethng went wrong !!");
      }
      setSharedNoteDetails({ ...resp.data.data, id: resp.data.data?._id });
    } catch (err) {
      toast.error(err.resp.data.message);
    }
  };

  const createNote = async (payload) => {
    try {
      const resp = await axios.post(`${baseUrl}/note/create`, payload, options);

      if (resp.status !== 201) {
        throw new Error("something went wrong !!");
      } else {
        setShowNoteForm(false);
        toast.success("Note Created Successfully");
        await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error while creating note");
    }
  };

  const updateNote = async (id, payload) => {
    try {
      const resp = await axios.put(
        `${baseUrl}/note/update/${id}`,
        payload,
        options
      );

      if (resp.status !== 200) {
        throw new Error("something went wrong !!");
      } else {
        setIsEditForm(false);
        setShowNoteForm(false);
        toast.success("Note updated successfully !!");
        setNoteDetails({ ...resp.data.data, id: resp.data.data?._id });
        await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error while updating note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const resp = await axios.delete(`${baseUrl}/note/delete/${id}`, options);
      if (resp.status !== 200) {
        throw new Error("something went wrong !!");
      } else {
        toast.success("Note deleted Successfully");
        await Promise.all([fetchNotes(), fetchPinnedNotes()]);
        navigate("/");
      }
    } catch (err) {
      toast.error("Error while deleting note");
    } finally {
      setShowDeleteDialog(false);
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
      } else {
        await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      }
    } catch (err) {
      toast.error(err.resp.data.message);
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
      } else {
        await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      }
    } catch (err) {
      toast.error(err.resp.data.message);
    }
  };

  const getSharedNote = async (id) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/shared_note/find/${id}`,
        options
      );

      if (resp.status !== 200) {
        throw new Error("Somethng went wrong !!");
      } else {
        let link = resp?.data?.data?.link;
        if (link) {
          setSharedNoteLink(`http://localhost:3000/share/${link}`);
          return true;
        } else {
          setSharedNoteLink("http://localhost:3000/share/...");
        }
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const createSharedNote = async (payload) => {
    try {
      const resp = await axios.post(
        `${baseUrl}/shared_note/create`,
        payload,
        options
      );

      if (resp.status !== 201) {
        throw new Error("something went wrong !!");
      } else {
        const link = resp?.data?.data?.link;
        setSharedNoteLink(`http://localhost:3000/share/${link}`);
        return link;
      }
    } catch (err) {
      toast.error(err.resp.data.message);
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
        baseUrl,
        options,
        token,
        isAuthenticated,
        isEditForm,
        showNoteForm,
        showShareDialog,
        showDeleteDialog,
        notes,
        pinnedNotes,
        noteDetails,
        sharedNoteLink,
        sharedNoteDetails,
        setToken,
        setIsEditForm,
        setShowNoteForm,
        setShowShareDialog,
        setShowDeleteDialog,
        setNoteDetails,
        setSharedNoteLink,
        setSharedNoteDetails,
        fetchNotes,
        fetchPinnedNotes,
        fetchNoteDetails,
        fetchSharedNoteDetails,
        createNote,
        updateNote,
        deleteNote,
        addPinnedNote,
        removePinnedNote,
        getSharedNote,
        createSharedNote,
        resetStore,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
