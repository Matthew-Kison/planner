import { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Stack } from "@mui/material";
import { useThemeStore } from "@/store/theme-store";
import { Image as ImageIcon } from "@mui/icons-material";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, thumbnail?: File) => Promise<void>;
}

export default function AddCategoryModal({ open, onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useThemeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(name.trim(), thumbnail || undefined);
      setName("");
      setThumbnail(null);
      setThumbnailPreview(null);
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle className={isDarkMode ? "text-white" : ""}>새 카테고리 추가</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="카테고리 이름"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={isDarkMode ? "text-white" : ""}
              InputLabelProps={{
                className: isDarkMode ? "text-gray-400" : "",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode ? "#2d2d2d" : "white",
                  "& fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                },
              }}
            />

            <Box>
              <Typography variant="subtitle1" className={isDarkMode ? "text-white" : ""} gutterBottom>
                썸네일
              </Typography>
              <Box
                sx={{
                  border: `2px dashed ${isDarkMode ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)"}`,
                  borderRadius: 1,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <Box sx={{ position: "relative" }}>
                    <img src={thumbnailPreview} alt="Thumbnail preview" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }} />
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveThumbnail();
                      }}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      삭제
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <ImageIcon sx={{ fontSize: 40, color: isDarkMode ? "white" : "gray" }} />
                    <Typography className={isDarkMode ? "text-white" : ""}>클릭하여 이미지 업로드</Typography>
                  </Box>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} className={isDarkMode ? "text-gray-300" : ""}>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading} className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}>
            {isLoading ? "추가 중..." : "추가"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
