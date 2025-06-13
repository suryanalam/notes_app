import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/api.js";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiInProgress, setApiInProgress] = useState(false);

  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [notes, setNotes] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState(null);
  const [sharedNoteLink, setSharedNoteLink] = useState(null);
  const [sharedNoteDetails, setSharedNoteDetails] = useState(null);

  useEffect(() => {
    token ? setIsAuthenticated(true) : setIsAuthenticated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = async (payload) => {
    setApiInProgress(true);
    try {
      const response = await api.post(`/auth/signup`, payload);
      if (!response?.data?.data) {
        toast.error("Response not found while signup");
        return;
      }

      const { user, accessToken } = response.data.data;

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
      navigate("/");
      toast.success("Your account is created successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup Failed");
    } finally {
      setApiInProgress(false);
    }
  };

  const login = async (payload) => {
    setApiInProgress(true);
    try {
      const response = await api.post(`/auth/login`, payload);
      if (!response?.data?.data) {
        toast.error("Response not found while login");
        return;
      }
      const { user, accessToken } = response.data.data;

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login Failed");
    } finally {
      setApiInProgress(false);
    }
  };

  const logout = async () => {
    setApiInProgress(true);
    try {
      await api.put(`/auth/logout`);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      resetStore();
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout Failed");
    } finally {
      setApiInProgress(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const resp = await api.get(`/note`);
      if (resp?.data?.data === null || resp?.data?.data === undefined) {
        toast.error("Something went wrong");
        return;
      }

      setNotes(resp.data.data);
    } catch (err) {
      if (err?.response?.status === 401) return;
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const fetchNoteDetails = async (id) => {
    try {
      const resp = await api.get(`/note/${id}`);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      return resp.data.data;
    } catch (err) {
      if (err?.response?.status === 401) return;
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const createNote = async (payload) => {
    setApiInProgress(true);
    try {
      const resp = await api.post(`/note`, payload);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Note Created Successfully");
      await fetchNotes();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      setShowNoteForm(false);
    }
  };

  const updateNote = async (id, payload) => {
    setApiInProgress(true);
    try {
      const resp = await api.put(`/note/${id}`, payload);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Note updated successfully");
      setNoteDetails({ ...resp.data.data, id: resp.data.data?._id });
      await fetchNotes();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      setShowNoteForm(false);
      setIsEditForm(false);
    }
  };

  const deleteNote = async (id) => {
    setApiInProgress(true);
    try {
      const resp = await api.delete(`/note/${id}`);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Note deleted Successfully");
      await fetchNotes();
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      setShowDeleteDialog(false);
    }
  };

  const addPinnedNote = async (payload) => {
    try {
      const resp = await api.post(`/pinned-note`, payload);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      await fetchNotes();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const removePinnedNote = async (id) => {
    try {
      const resp = await api.delete(`/pinned-note/${id}`);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      await fetchNotes();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const getSharedNoteByLink = async (link) => {
    try {
      const resp = await api.get(`/shared-note/${link}`);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      setSharedNoteDetails({
        ...resp.data.data?.nid,
        id: resp.data.data?.nid?._id,
      });
    } catch (err) {
      if ([401, 404].includes(err?.response?.status)) return;
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const createSharedNote = async (payload) => {
    setApiInProgress(true);
    try {
      const resp = await api.post(`/shared-note`, payload);
      if (!resp?.data?.data) {
        toast.error("Something went wrong");
        return;
      }
      return resp.data.data?.link;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
    }
  };

  const resetStore = () => {
    setIsAuthenticated(false);
    setNotes(null);
    setPinnedNotes(null);
    setNoteDetails(null);
    setSharedNoteLink(null);
    setSharedNoteDetails(null);
  };

  return (
    <CommonContext.Provider
      value={{
        token,
        isAuthenticated,
        apiInProgress,
        isEditForm,
        showNoteForm,
        showShareDialog,
        showDeleteDialog,
        notes,
        pinnedNotes,
        noteDetails,
        sharedNoteLink,
        sharedNoteDetails,
        setIsAuthenticated,
        setApiInProgress,
        setIsEditForm,
        setShowNoteForm,
        setShowShareDialog,
        setShowDeleteDialog,
        setNoteDetails,
        setSharedNoteLink,
        setSharedNoteDetails,
        login,
        signup,
        logout,
        fetchNotes,
        fetchNoteDetails,
        createNote,
        updateNote,
        deleteNote,
        addPinnedNote,
        removePinnedNote,
        getSharedNoteByLink,
        createSharedNote,
        resetStore,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
