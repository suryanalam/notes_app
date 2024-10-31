import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { CommonContext } from "../contexts/CommonContext";

// Components
import BottomSheet from "./BottomSheet";

const NoteForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    baseUrl,
    options,
    noteDetails,
    showNoteForm,
    setShowNoteForm,
    isEditForm,
    setIsEditForm,
    fetchNotes,
    fetchPinnedNotes,
  } = useContext(CommonContext);

  const handleCloseForm = () => {
    reset();
    setShowNoteForm(false);
    if (isEditForm) {
      setIsEditForm(false);
    }
  };

  const createNote = async (payload) => {
    try {
      const resp = await axios.post(`${baseUrl}/note/create`, payload, options);

      if (resp.status !== 201 || !resp?.data?.data) {
        throw new Error("Something went wrong !!");
      }

      handleCloseForm();
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const updateNote = async (payload) => {
    try {
      const resp = await axios.put(
        `${baseUrl}/note/update/${noteDetails?._id}`,
        payload,
        options
      );

      if (resp.status !== 200 || !resp?.data?.data) {
        throw new Error("Something went wrong !!");
      }

      handleCloseForm();
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const onSubmit = async (data) => {
    const { title, content } = data;
    const payload = { title, content };

    if (isEditForm) {
      updateNote(payload);
      return;
    }

    await createNote(payload);
  };

  // set the form values with note details if the edit form is opened
  useEffect(() => {
    if (isEditForm) {
      setValue("title", noteDetails?.title);
      setValue("content", noteDetails?.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditForm]);

  return (
    <BottomSheet
      showBottomSheet={showNoteForm}
      handleClose={handleCloseForm}
      bottomSheetTitle={isEditForm ? "Update Note" : "Create Note"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column gap-4"
      >
        <div className="d-flex flex-column gap-1 justify-content-start">
          <label htmlFor="title" className="input-label">
            Title
          </label>
          <input
            className="input-field"
            type="text"
            placeholder="Ex: Daily Routine"
            {...register("title", {
              required: "Title is required",
            })}
          />
          {errors.title && (
            <p role="alert" className="text-red">
              *{errors.title.message}
            </p>
          )}
        </div>
        <div className="d-flex flex-column gap-1 justify-content-start">
          <label htmlFor="content" className="input-label">
            Content
          </label>
          <textarea
            className="input-field"
            placeholder="Write something here..."
            rows={8}
            {...register("content", {
              required: "Content is required",
            })}
          ></textarea>
          {errors.content && (
            <p role="alert" className="text-red">
              *{errors.content.message}
            </p>
          )}
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn w-100 btn-white"
            type="reset"
            onClick={handleCloseForm}
          >
            Cancel
          </button>
          <button className="btn w-100 btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default NoteForm;
