import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ResumeGameModal } from "./components/modal/ResumeGameModal";
import { useParams } from "react-router-dom";

export function GameGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    console.log(roomId)
    const playerID = localStorage.getItem("playerID");
    // Se veio do login (nova sessão), não mostra o modal
    if (location.state?.skipResume) {
      setCanEnter(true);
      return;
    }
    // Se há sessão salva, mostra o modal
    if (roomId && playerID) {
      setShowResumeModal(true);
    } else {
      // Se não houver sessão, redireciona para a tela inicial
      navigate("/");
    }
  }, [navigate, location.state]);

  if (showResumeModal) {
    return (
      <ResumeGameModal
        onConfirm={() => {
          setShowResumeModal(false);
          setCanEnter(true);
        }}
        onCancel={() => {
          setShowResumeModal(false);
          localStorage.clear();
          navigate("/");
        }}
      />
    );
  }

  if (!canEnter) return null;

  return <>{children}</>;
}