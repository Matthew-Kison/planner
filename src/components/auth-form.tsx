import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { TextField, Button, Stack, Typography, Alert } from "@mui/material";
import { useThemeStore } from "@/store/theme-store";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, isLoading, error } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push("/");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-lg" style={{ backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }}>
      <Typography variant="h5" component="h1" className="mb-6 text-center" style={{ color: isDarkMode ? 'white' : 'inherit' }}>
        {isLogin ? "로그인" : "회원가입"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            className={isDarkMode ? "text-white" : ""}
            InputLabelProps={{
              className: isDarkMode ? "text-gray-400" : ""
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              },
            }}
          />

          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            className={isDarkMode ? "text-white" : ""}
            InputLabelProps={{
              className: isDarkMode ? "text-gray-400" : ""
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isLoading ? "처리중..." : isLogin ? "로그인" : "회원가입"}
          </Button>

          <Button
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
            className={isDarkMode ? "text-gray-300" : ""}
          >
            {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
          </Button>
        </Stack>
      </form>
    </div>
  );
} 