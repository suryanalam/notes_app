import { useState, useEffect, createContext } from "react";

export const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiInProgress, setApiInProgress] = useState(false);

  const [isEditForm, setIsEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [notes, setNotes] = useState(null);
  const [noteDetails, setNoteDetails] = useState(null);
  const [sharedNoteDetails, setSharedNoteDetails] = useState(null);

  useEffect(() => {
    token ? setIsAuthenticated(true) : setIsAuthenticated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetStore = () => {
    setIsAuthenticated(false);
    setNotes(null);
    setNoteDetails(null);
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
        noteDetails,
        sharedNoteDetails,
        setIsAuthenticated,
        setApiInProgress,
        setIsEditForm,
        setShowNoteForm,
        setShowShareDialog,
        setShowDeleteDialog,
        setNotes,
        setNoteDetails,
        setSharedNoteDetails,
        resetStore,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
