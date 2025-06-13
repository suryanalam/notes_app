import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

// custom hooks
import useDevice from "../hooks/useDevice";

// store
import { CommonContext } from "../contexts/CommonContext";

// Components
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
    isEditForm,
    setIsEditForm,
    showNoteForm,
    setShowNoteForm,
    noteDetails,
    createNote,
    updateNote,
  } = useContext(CommonContext);

  const handleCloseForm = () => {
    reset();
    setShowNoteForm(false);
    isEditForm && setIsEditForm(false);
  };

  const onSubmit = async (data) => {
    const { title, content } = data;
    const payload = { title, content };

    if (isEditForm) {
      // don't trigger update api if new form values are same as previous
      if (title === noteDetails?.title && content === noteDetails?.content) {
        reset();
        setIsEditForm(false);
        setShowNoteForm(false);
        return;
      }
      await updateNote(noteDetails?._id, payload);
    } else {
      await createNote(payload);
    }

    reset();
  };

  // set the form values with note details
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
