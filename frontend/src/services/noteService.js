import { api } from "./api";

const getAllNotes = async () => {
  try {
    const response = await api.get("/note");
    return response?.data?.data;
  } catch (error) {
    console.log("Error while fetching notes:", error);
    throw error;
  }
};

const getNoteDetails = async (id) => {
  try {
    const response = await api.get(`/note/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while fetching note details: ", error);
    throw error;
  }
};

const createNote = async (payload) => {
  try {
    const response = await api.post("/note", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while creating a note:", error);
    throw error;
  }
};

const updateNote = async (id, payload) => {
  try {
    const response = await api.put(`/note/${id}`, payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while updating a note: ", error);
    throw error;
  }
};

const deleteNote = async (id) => {
  try {
    const response = await api.delete(`/note/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while deleting a note: ", error);
    throw error;
  }
};

const addPinnedNote = async (payload) => {
  try {
    const response = await api.post("/pinned-note", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while pin the note:", error);
    throw error;
  }
};

const removePinnedNote = async (id) => {
  try {
    const response = await api.delete(`/pinned-note/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while un-pin the note: ", error);
    throw error;
  }
};

const getSharedNoteByLink = async (link) => {
  try {
    const response = await api.get(`/shared-note/${link}`);
    return response?.data?.data?.nid;
  } catch (error) {
    console.log("Error while fetching shared note details: ", error);
    throw error;
  }
};

const createSharedNote = async (payload) => {
  try {
    const response = await api.post("/shared-note", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while creating a shared note:", error);
    throw error;
  }
};

export {
  getAllNotes,
  getNoteDetails,
  createNote,
  updateNote,
  deleteNote,
  addPinnedNote,
  removePinnedNote,
  getSharedNoteByLink,
  createSharedNote,
};
