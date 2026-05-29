import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventTickets.css";

export default function EventTickets() {
  const navigate = useNavigate();

  const rows = 10;
  const cols = 14;

  const [selectedSeats, setSelectedSeats] = useState([]);

  const getPriceTier = (row) => {
    if (row < 3) return 600;
    if (row < 7) return 400;
    return 250;
  };

  const toggleSeat = (seatId, price) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seatId);

      if (exists) {
        return prev.filter((s) => s.id !== seatId);
      } else {
        return [...prev, { id: seatId, price }];
      }
    });
  };

  const renderSeats = () => {
    const seats = [];

    for (let r = 0; r < rows; r++) {
      const rowSeats = [];

      for (let c = 0; c < cols; c++) {
        const seatId = `${r}-${c}`;
        const price = getPriceTier(r);

        const isSelected = selectedSeats.find((s) => s.id === seatId);

        rowSeats.push(
          <div
            key={seatId}
            className={`seat ${isSelected ? "selected" : ""} tier-${price}`}
            onClick={() => toggleSeat(seatId, price)}
          />
        );
      }

      seats.push(
        <div className="seat-row" key={r}>
          {rowSeats}
        </div>
      );
    }

    return seats;
  };

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="book-page">

      {/* LEFT SIDE */}
      <div className="left-section">

        <div className="screen-container">
          <div className="screen">STAGE</div>
        </div>

        <div className="seat-map">
          {renderSeats()}
        </div>

        <button className="back-btn" onClick={() => window.history.back()}>
          ← Go Back
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <h2>Checkout</h2>

        <div className="checkout-box">
          <p>Seats Selected: {selectedSeats.length}</p>

          <div className="selected-list">
            {selectedSeats.map((s) => (
              <div key={s.id} className="selected-item">
                Seat {s.id} - ₹{s.price}
              </div>
            ))}
          </div>

          <hr />

          <p>Total: ₹{total}</p>
        </div>

        {/* ✅ UPDATED PAY BUTTON */}
        <button
          className="pay-btn"
          disabled={selectedSeats.length === 0}
          onClick={() =>
            navigate("/payment-success", {
              state: { type: "event" }
            })
          }
        >
          Pay ₹{total}
        </button>
      </div>

    </div>
  );
}