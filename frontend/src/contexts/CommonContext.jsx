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
    headers: { Authorization: `Bearer ${token}` },
  };

  // Toggling States
  const [disableBtn, setDisableBtn] = useState(false);
  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Notes Data
  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState(null);
  const [sharedNoteLink, setSharedNoteLink] = useState("");
  const [sharedNoteDetails, setSharedNoteDetails] = useState(null);

  const login = async (data) => {
    setDisableBtn(true);
    try {
      const resp = await axios.post(`${baseUrl}/login`, data);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      localStorage.setItem("token", resp.data.data?.accessToken);
      setToken(resp?.data.data?.accessToken);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login Failed");
    } finally {
      setDisableBtn(false);
    }
  };

  const signup = async (data) => {
    setDisableBtn(true);
    try {
      const resp = await axios.post(`${baseUrl}/signup`, data);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Your account is created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup Failed");
    } finally {
      setDisableBtn(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/note`, options);
      if (!resp?.data?.data) {
        toast.error("Notes not found");
        return;
      }
      setNotes(resp?.data?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const fetchPinnedNotes = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/pinned_note`, options);
      if (!resp?.data?.data) {
        toast.error("Pinned Notes not found");
        return;
      }
      setPinnedNotes(resp?.data?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const fetchNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/note/${id}`, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      setNoteDetails({ ...resp?.data?.data, id: resp?.data?.data?._id });
      return resp?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const fetchSharedNoteDetails = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/shared_note/${id}`, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      setSharedNoteDetails({ ...resp?.data?.data, id: resp?.data?.data?._id });
      return resp?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const createNote = async (payload) => {
    setDisableBtn(true);
    try {
      const resp = await axios.post(`${baseUrl}/note`, payload, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Note Created Successfully");
      await Promise.allSettled([fetchNotes(), fetchPinnedNotes()]);
      return resp?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDisableBtn(false);
      setShowNoteForm(false);
    }
  };

  const updateNote = async (id, payload) => {
    setDisableBtn(true);
    try {
      const resp = await axios.put(
        `${baseUrl}/note/${id}`,
        payload,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Note updated successfully");
      setNoteDetails({ ...resp?.data?.data, id: resp?.data?.data?._id });
      await Promise.allSettled([fetchNotes(), fetchPinnedNotes()]);
      return resp?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDisableBtn(false);
      setIsEditForm(false);
      setShowNoteForm(false);
    }
  };

  const deleteNote = async (id) => {
    setDisableBtn(true);
    try {
      const resp = await axios.delete(`${baseUrl}/note/${id}`, options);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Note deleted Successfully");
      await Promise.allSettled([fetchNotes(), fetchPinnedNotes()]);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDisableBtn(false);
      setShowDeleteDialog(false);
    }
  };

  const addPinnedNote = async (payload) => {
    try {
      const resp = await axios.post(
        `${baseUrl}/pinned_note`,
        payload,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      await Promise.allSettled([fetchNotes(), fetchPinnedNotes()]);
      return resp?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const removePinnedNote = async (id) => {
    try {
      const resp = await axios.delete(
        `${baseUrl}/pinned_note/${id}`,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      await Promise.allSettled([fetchNotes(), fetchPinnedNotes()]);
      return resp?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const findSharedNote = async (noteId) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/shared_note/find/${noteId}`,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      return resp?.data?.data?.link;
    } catch (err) {
      if (err?.response?.status === 404) return;
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const getSharedNote = async (link) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/shared_note/${link}`,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      setSharedNoteDetails({
        ...resp?.data?.data.nid,
        id: resp?.data?.data.nid._id,
      });
      return resp?.data?.data;
    } catch (err) {
      if (err?.response?.status === 404) return;
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const createSharedNote = async (payload) => {
    setDisableBtn(true);
    try {
      const resp = await axios.post(
        `${baseUrl}/shared_note`,
        payload,
        options
      );
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        setShowShareDialog(false);
        return;
      }
      return resp?.data?.data?.link;
    } catch (err) {
      setShowShareDialog(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDisableBtn(false);
    }
  };

  const resetStore = () => {
    setToken(null);
    setIsAuthenticated(false);
    setNotes(null);
    setPinnedNotes(null);
    setNoteDetails(null);
    setSharedNoteLink("");
    setSharedNoteDetails(null);
  };

  return (
    <CommonContext.Provider
      value={{
        baseUrl,
        options,
        token,
        isAuthenticated,
        disableBtn,
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
        setIsAuthenticated,
        setDisableBtn,
        setIsEditForm,
        setShowNoteForm,
        setShowShareDialog,
        setShowDeleteDialog,
        setNoteDetails,
        setSharedNoteLink,
        setSharedNoteDetails,
        login,
        signup,
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
