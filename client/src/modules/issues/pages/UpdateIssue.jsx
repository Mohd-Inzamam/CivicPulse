import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { issuesService } from "../../../services/issuesService";
import { useTheme } from "@mui/material/styles";

const UpdateIssue = ({ issue, onClose, onUpdate }) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        category: issue.category || "",
        location: issue.location || "",
      });
      setImagePreview(issue.image || null);
    }
  }, [issue]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload;

      if (image) {
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
          payload.append(key, value)
        );
        payload.append("image", image);
      } else {
        payload = { ...formData };
      }

      const response = await issuesService.updateIssue(issue._id, payload);

      if (onUpdate) onUpdate(response.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to update:", err);
      alert(err.message || "Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {issue && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.35, ease: "easeOut" }}>
          <Card
            sx={{
              maxWidth: 600,
              mx: "auto",
              mt: 4,
              borderRadius: theme.shape.borderRadius * 2.2, // iOS pill
              p: 1,
              backdropFilter: "blur(22px)",
            }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: "0.4px",
                }}>
                Update Issue
              </Typography>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}>
                <TextField
                  label="Title"
                  name="title"
                  fullWidth
                  value={formData.title}
                  onChange={handleChange}
                />

                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />

                <TextField
                  label="Category"
                  name="category"
                  fullWidth
                  value={formData.category}
                  onChange={handleChange}
                />

                <TextField
                  label="Location"
                  name="location"
                  fullWidth
                  value={formData.location}
                  onChange={handleChange}
                />

                {/* Image Upload */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "6px",
                  }}>
                  <Avatar
                    src={imagePreview}
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: "18px",
                      border: `2px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[2],
                    }}
                  />

                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      borderRadius: "14px",
                      py: 1.2,
                      px: 3,
                    }}>
                    Change Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "10px",
                  }}>
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                      borderRadius: "14px",
                      px: 3,
                      py: 1,
                    }}>
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      borderRadius: "14px",
                      px: 3,
                      py: 1,
                    }}>
                    {loading ? <CircularProgress size={22} /> : "Save"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateIssue;

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   CircularProgress,
//   Avatar,
// } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import { issuesService } from "../../../services/issuesService";

// const UpdateIssue = ({ issue, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     location: "",
//   });
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (issue) {
//       setFormData({
//         title: issue.title || "",
//         description: issue.description || "",
//         category: issue.category || "",
//         location: issue.location || "",
//       });
//       setImagePreview(issue.image || null);
//     }
//   }, [issue]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let payload;
//       if (image) {
//         // Send FormData if image is updated
//         payload = new FormData();
//         Object.entries(formData).forEach(([key, value]) =>
//           payload.append(key, value)
//         );
//         payload.append("image", image);
//       } else {
//         // Send JSON if no image
//         payload = { ...formData };
//       }

//       const response = await issuesService.updateIssue(issue._id, payload);
//       console.log("Issue updated:", response);

//       if (onUpdate) onUpdate(response.data);
//       if (onClose) onClose();
//     } catch (err) {
//       console.error("Failed to update issue:", err);
//       alert(err.message || "Failed to update issue");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {issue && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           transition={{ duration: 0.3 }}>
//           <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Update Issue
//               </Typography>

//               <form
//                 onSubmit={handleSubmit}
//                 className="d-flex flex-column gap-3">
//                 <TextField
//                   label="Title"
//                   name="title"
//                   fullWidth
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                 />

//                 <TextField
//                   label="Description"
//                   name="description"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                 />

//                 <TextField
//                   label="Category"
//                   name="category"
//                   fullWidth
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                 />

//                 <TextField
//                   label="Location"
//                   name="location"
//                   fullWidth
//                   value={formData.location}
//                   onChange={handleChange}
//                   required
//                 />

//                 {/* Image Upload */}
//                 <div className="d-flex align-items-center gap-3">
//                   <Avatar
//                     src={imagePreview}
//                     sx={{ width: 80, height: 80, border: "2px solid #ccc" }}
//                   />
//                   <Button variant="contained" component="label">
//                     Change Image
//                     <input
//                       type="file"
//                       hidden
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                   </Button>
//                 </div>

//                 <div className="d-flex gap-2 justify-content-end mt-2">
//                   <Button
//                     variant="outlined"
//                     onClick={onClose}
//                     disabled={loading}>
//                     Cancel
//                   </Button>
//                   <Button variant="contained" type="submit" disabled={loading}>
//                     {loading ? <CircularProgress size={22} /> : "Save Changes"}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default UpdateIssue;
