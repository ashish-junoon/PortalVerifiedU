import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { UploadVendorDocument } from "../services/Services_API";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const FileUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  userVendorCode,
  fetchDocuments,
}) => {
  if (!isOpen) return null;
  const { AdminToken } = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(false);
  const CreatedBy = AdminToken?.data?.VendorCode;

  const formik = useFormik({
    initialValues: {
      fileName: "",
      file: null,
    },
    validationSchema: Yup.object({
      fileName: Yup.string().required("File name is required"),
      //   file: Yup.mixed().required("File is required"),

      //   file: Yup.mixed()
      //     .required("File is required")
      //     .test(
      //       "fileType",
      //       "Only images are allowed (PNG, JPG, JPEG)",
      //       (value) => {
      //         if (!value) return false;
      //         const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      //         return allowedTypes.includes(value.type);
      //       },
      //     )
      //     .test("fileSize", "File size must be less than 5MB", (value) => {
      //       if (!value) return false;
      //       return value.size <= 20 * 1024 * 1024; // 20MB
      //     }),

      file: Yup.mixed()
        .required("File is required")
        .test("fileType", "Only images and PDF are allowed", (value) => {
          if (!value) return false;

          return (
            value.type.startsWith("image/") || value.type === "application/pdf"
          );
        })
        .test("fileSize", "File size must be less than 5MB", (value) => {
          if (!value) return false;

          return value.size <= 5 * 1024 * 1024;
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("document_name", values.fileName);
      formData.append("file", values.file);
      formData.append("vendor_code", userVendorCode);
      formData.append("created_by", CreatedBy);

      try {
        setisLoading(true);
        const response = await UploadVendorDocument(formData);
        if (response.status) {
          toast.success("Document uploaded successfully.");
          fetchDocuments();
        } else {
          toast.error(response.message || "Failed to upload document!");
        }
      } catch (error) {
        console.error("Error in FIle Upload: ", error);
      } finally {
        resetForm();
        onClose();
        setisLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-md shadow-xl p-6 space-y-5">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Upload Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* File Name */}
          <div>
            <label className="text-sm text-gray-500">File Name</label>
            <input
              type="text"
              name="fileName"
              value={formik.values.fileName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-1 border border-gray-300 rounded-sm px-3 py-2 text-sm"
            />
            {formik.touched.fileName && formik.errors.fileName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.fileName}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="relative bg-primary/10 rounded-md h-[80px] flex items-center justify-center">
            <label className="text-sm text-gray-500 font-semibold">
              Upload File
            </label>

            <input
              type="file"
              name="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                formik.setFieldValue("file", e.currentTarget.files[0])
              }
              onBlur={formik.handleBlur}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {formik.values.file && (
              <p className="text-xs text-gray-500 absolute bottom-1">
                {formik.values.file.name}
              </p>
            )}
          </div>

          {formik.touched.file && formik.errors.file && (
            <p className="text-red-500 text-xs">{formik.errors.file}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-primary hover:bg-primary/70 text-white cursor-pointer"
            >
              {!isLoading ? "Upload" : "Uploading..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
