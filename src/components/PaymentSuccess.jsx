import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const type = state?.type || "movie";

  const message =
    type === "event"
      ? "Payment Successful, Enjoy your Event!"
      : "Payment Successful, Enjoy your Movie!";

  return (
    <div className="success-page">

      <div className="success-card">

        <div className="success-circle">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1>{message}</h1>

        <button
          className="success-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>

      </div>

    </div>
  );
}