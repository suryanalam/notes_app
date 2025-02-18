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
      if (!resp?.data?.data) {
        toast.error("Notes not found");
        return;
      }
      setNotes(resp.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const fetchPinnedNotes = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/pinned_note/getAll`, options);
      if (!resp?.data?.data) {
        toast.error("Pinned Notes not found");
        return;
      }
      setPinnedNotes(resp.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const fetchNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/note/get/${id}`, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      setNoteDetails({ ...resp.data.data, id: resp.data.data?._id });
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const fetchSharedNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/shared_note/get/${id}`, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      setSharedNoteDetails({ ...resp.data.data, id: resp.data.data?._id });
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const createNote = async (payload) => {
    try {
      const resp = await axios.post(`${baseUrl}/note/create`, payload, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      setShowNoteForm(false);
      toast.success("Note Created Successfully");
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const updateNote = async (id, payload) => {
    try {
      const resp = await axios.put(
        `${baseUrl}/note/update/${id}`,
        payload,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      setIsEditForm(false);
      setShowNoteForm(false);
      toast.success("Note updated successfully !!");
      setNoteDetails({ ...resp?.data?.data, id: resp.data.data?._id });
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const deleteNote = async (id) => {
    try {
      const resp = await axios.delete(`${baseUrl}/note/delete/${id}`, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      toast.success("Note deleted Successfully");
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
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
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const removePinnedNote = async (id) => {
    try {
      const resp = await axios.delete(
        `${baseUrl}/pinned_note/delete/${id}`,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const findSharedNote = async (noteId) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/shared_note/find/${noteId}`,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      const link = resp.data.data?.link;
      if (!link) {
        setSharedNoteLink("http://localhost:3000/share/...");
        return;
      }
      setSharedNoteLink(`http://localhost:3000/share/${link}`);
      return link;
    } catch (err) {
      if (err?.response?.status === 404) return;
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const getSharedNote = async (link) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/shared_note/get/${link}`,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }

      setSharedNoteDetails({
        ...resp.data.data.nid,
        id: resp.data.data.nid._id,
      });
      return resp.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
    }
  };

  const createSharedNote = async (payload) => {
    try {
      const resp = await axios.post(
        `${baseUrl}/shared_note/create`,
        payload,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong!!");
        return;
      }
      const link = resp.data.data?.link;
      link && setSharedNoteLink(`http://localhost:3000/share/${link}`);
      return link;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!!");
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
        findSharedNote,
        getSharedNote,
        createSharedNote,
        resetStore,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
