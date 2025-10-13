import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { NewNoteData } from "../../types/note";

 interface NoteFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at less 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be at max 500 characters")
    .required("Content is required"),
  tag: Yup.string().required("Please select a tag"),
});

export default function NoteForm({ onSuccess, onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newNoteData: NewNoteData) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });
  const handleSubmit = (formData: FormData) => {
    mutate({
      content: formData.get("content") as string,
      title: "",
      tag: ""
    });
  };
  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutate(values, {
          onSuccess: () => resetForm(),
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form} action={handleSubmit} >
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting || isPending}>
              {isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}