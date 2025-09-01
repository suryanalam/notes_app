import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// custom hooks
import useDevice from "../hooks/useDevice";

// api
import { getAllNotes, createNote, updateNote } from "../services/noteService";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Dialog from "./Dialog";
import BottomSheet from "./BottomSheet";

const NoteForm = () => {
  const { device } = useDevice();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    apiInProgress,
    setApiInProgress,
    isEditForm,
    setIsEditForm,
    showNoteForm,
    setShowNoteForm,
    noteDetails,
    setNoteDetails,
    setNotes,
  } = useContext(CommonContext);

  const handleCloseForm = () => {
    reset();
    setShowNoteForm(false);
    isEditForm && setIsEditForm(false);
  };

  const handleCreateNote = async (payload) => {
    setApiInProgress(true);
    try {
      await createNote(payload);
      toast.success("Note Created Successfully");
      const data = await getAllNotes();
      setNotes(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      setShowNoteForm(false);
      reset();
    }
  };

  const handleUpdateNote = async (id, payload) => {
    setApiInProgress(true);
    try {
      const data = await updateNote(id, payload);
      setNoteDetails({
        ...data,
        isPinned: noteDetails?.isPinned,
        shareableLink: noteDetails?.shareableLink,
      });
      toast.success("Note Updated Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      setShowNoteForm(false);
      setIsEditForm(false);
      reset();
    }
  };

  const onSubmit = (data) => {
    // close the dialog if note details are not modified
    if (
      data?.title === noteDetails?.title &&
      data?.content === noteDetails?.content
    ) {
      reset();
      setIsEditForm(false);
      setShowNoteForm(false);
      return;
    }

    if (!isEditForm) {
      handleCreateNote(data);
      return;
    }

    handleUpdateNote(noteDetails?._id, data);
  };

  // Set form values with the note details
  useEffect(() => {
    if (showNoteForm && isEditForm && noteDetails) {
      setValue("title", noteDetails?.title);
      setValue("content", noteDetails?.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNoteForm]);

  return (
    <>
      {device === "mobile" && (
        <BottomSheet
          showBottomSheet={showNoteForm}
          handleClose={handleCloseForm}
          disabled={apiInProgress}
          bottomSheetTitle={isEditForm ? "Update Note" : "Create Note"}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-col gap-4"
          >
            <div className="d-flex flex-col gap-2">
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
            <div className="d-flex flex-col gap-2">
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
                className="btn btn-outline w-100"
                type="reset"
                disabled={apiInProgress}
                onClick={handleCloseForm}
              >
                Cancel
              </button>
              <button
                className="btn w-100 btn-primary"
                type="submit"
                disabled={apiInProgress}
              >
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
          disabled={apiInProgress}
          dialogTitle={isEditForm ? "Update Note" : "Create Note"}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-col gap-4"
          >
            <div className="d-flex flex-col gap-2">
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
            <div className="d-flex flex-col gap-2">
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
                className="btn btn-outline w-100"
                type="reset"
                disabled={apiInProgress}
                onClick={handleCloseForm}
              >
                Cancel
              </button>
              <button
                className="btn w-100 btn-primary"
                type="submit"
                disabled={apiInProgress}
              >
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
