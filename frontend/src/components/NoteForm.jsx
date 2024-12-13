import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

// custom hooks
import useDevice from "../hooks/useDevice";

// store
import { CommonContext } from "../contexts/CommonContext";

// Components
import Dialog from "./Dialog";
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
    setNoteDetails,
    showNoteForm,
    setShowNoteForm,
    isEditForm,
    setIsEditForm,
    fetchNotes,
    fetchPinnedNotes,
  } = useContext(CommonContext);

  const { device } = useDevice();

  const handleCloseForm = () => {
    reset();
    setShowNoteForm(false);
    if (isEditForm) {
      setIsEditForm(false);
    }
  };

  const createNote = async (payload) => {
    try {
      await axios.post(`${baseUrl}/note/create`, payload, options);
      toast.success("Note Created Successfully");
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error while creating note");
    } finally {
      handleCloseForm();
    }
  };

  const updateNote = async (id, payload) => {
    try {
      const resp = await axios.put(
        `${baseUrl}/note/update/${id}`,
        payload,
        options
      );
      setNoteDetails({ ...resp.data.data });
      toast.success("Note Updated Successfully");
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error while updating note");
    } finally {
      handleCloseForm();
    }
  };

  const onSubmit = async (data) => {
    const { title, content } = data;
    const payload = { title, content };

    if (isEditForm) {
      updateNote(noteDetails?._id,payload);
      return;
    }

    await createNote(payload);
  };

  // set the form values with note details if the edit form is opened
  useEffect(() => {
    if (isEditForm && noteDetails) {
      setValue("title", noteDetails?.title);
      setValue("content", noteDetails?.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditForm]);

  return (
    <>
      {device === "mobile" && (
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
                className="btn w-100 btn-outline"
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
      )}

      {device === "desktop" && (
        <Dialog
          showDialog={showNoteForm}
          handleClose={handleCloseForm}
          dialogTitle={isEditForm ? "Update Note" : "Create Note"}
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
                className="btn w-100 btn-outline"
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
        </Dialog>
      )}
    </>
  );
};

export default NoteForm;
