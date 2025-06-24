import { useContext, useEffect, useRef } from "react";
import { TokenContext } from "./TokenContext.jsx";
import { useGetUserTokensQuery } from "./api";
import { useNavigate } from "react-router-dom";

export default function useTokens() {
  const { data, error, isLoading, refetch } = useGetUserTokensQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }); // Добавили refetch
  const context = useContext(TokenContext);
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false);

  if (!context) {
    throw new Error("useTokens must be used within a TokenProvider");
  }

  const { tokens, setTokens } = context;

  useEffect(() => {
    if (data && !isLoading && !error) {
      setTokens(data.items);
    }
  }, [data, isLoading, error, setTokens]);

  useEffect(() => {
    if (error?.status === 401 && !hasLoggedOut.current) {
      console.log("Токен истек. Разлогиниваем пользователя...");

      hasLoggedOut.current = true;
      localStorage.removeItem("user");
      setTokens(null);
      navigate("/signin", { replace: true });
      window.location.reload();
    }
  }, [error, navigate, setTokens]);

  return { tokens, setTokens, isLoading, error, refetch }; // Возвращаем refetch
}
