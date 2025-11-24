import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { issuesService } from "../../../services/issuesService";

const DeleteIssue = ({ issue, onClose, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await issuesService.deleteIssue(issue._id);
      onDeleteSuccess(issue._id);
    } catch (error) {
      console.error("Failed to delete issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Delete Issue</DialogTitle>

      <DialogContent>
        <Typography>Are you sure you want to delete the issue:</Typography>
        <Typography sx={{ mt: 1, fontWeight: "bold" }}>
          "{issue.title}"
        </Typography>

        <Typography sx={{ mt: 2, color: "error.main", fontWeight: "bold" }}>
          ⚠️ This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          sx={{ borderRadius: 2 }}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteIssue;
