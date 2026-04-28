import React from "react";
import { Link } from "react-router-dom";

const categoryLabel = {
  nasi: "🍚 Nasi",
  lauk: "🍗 Lauk",
  snack: "🍪 Snack",
  minuman: "🥤 Minuman",
  buah: "🍎 Buah",
  sayur: "🥦 Sayur",
  roti: "🍞 Roti",
  lainnya: "🍽️ Lainnya",
};

const statusConfig = {
  available: {
    label: "Tersedia",
    color: "var(--g2)",
    bg: "rgba(95,139,76,0.12)",
    border: "rgba(95,139,76,0.3)",
    dot: "var(--g2)",
  },
  claimed: {
    label: "Diklaim",
    color: "#e8b84b",
    bg: "rgba(232,184,75,0.12)",
    border: "rgba(232,184,75,0.3)",
    dot: "#e8b84b",
  },
  completed: {
    label: "Selesai",
    color: "var(--txt4)",
    bg: "rgba(0,0,0,0.06)",
    border: "var(--border)",
    dot: "var(--txt4)",
  },
  expired: {
    label: "Kedaluwarsa",
    color: "#e05050",
    bg: "rgba(224,80,80,0.1)",
    border: "rgba(224,80,80,0.3)",
    dot: "#e05050",
  },
};

class DonationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovered: false };
  }

  render() {
    const { donation } = this.props;
    const { hovered } = this.state;

    const deadline = new Date(donation.pickupDeadline);
    const isExpiringSoon = deadline - new Date() < 24 * 60 * 60 * 1000;
    const status = statusConfig[donation.status] || statusConfig.available;

    return (
      <div
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        style={{
          background: "var(--surface)",
          border: `1px solid ${hovered ? "var(--g3)" : "var(--border)"}`,
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: hovered ? "var(--shadow2)" : "var(--shadow)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          height: "100%",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative" }}>
          {donation.photo ? (
            <img
              src={donation.photo}
              alt={donation.title}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                height: 160,
                background: "var(--surf2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 48 }}>🍱</span>
            </div>
          )}

          {/* Status badge overlay */}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <span
              style={{
                background: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`,
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                backdropFilter: "blur(4px)",
                fontFamily: "inherit",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: status.dot,
                  display: "inline-block",
                }}
              />
              {status.label}
            </span>
          </div>

          {/* Expiring soon badge */}
          {isExpiringSoon && donation.status === "available" && (
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <span
                style={{
                  background: "rgba(224,80,80,0.85)",
                  color: "#fff",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 10px",
                  backdropFilter: "blur(4px)",
                }}
              >
                ⚡ Segera habis
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
          className="outfit"
        >
          {/* Title */}
          <h6
            className="syne-h1"
            style={{
              fontSize: 14,
              color: "var(--txt)",
              marginBottom: 10,
              lineHeight: 1.3,
            }}
          >
            {donation.title}
          </h6>

          {/* Category tag */}
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                background: "var(--g5)",
                color: "var(--txt3)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
              }}
            >
              {categoryLabel[donation.category] || "🍽️ Lainnya"}
            </span>
            {donation.quantity && (
              <span
                style={{
                  marginLeft: 6,
                  background: "var(--surf2)",
                  color: "var(--txt4)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  fontSize: 11,
                  padding: "3px 10px",
                }}
              >
                {donation.quantity}
              </span>
            )}
          </div>

          {/* Info rows */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 6,
              }}
            >
              <i
                className="bi bi-geo-alt"
                style={{ color: "var(--txt4)", fontSize: 12, width: 14 }}
              />
              <span style={{ fontSize: 12, color: "var(--txt3)" }}>
                {donation.location}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
              }}
            >
              <i
                className="bi bi-clock"
                style={{
                  color: isExpiringSoon ? "#e05050" : "var(--txt4)",
                  fontSize: 12,
                  width: 14,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: isExpiringSoon ? "#e05050" : "var(--txt3)",
                  fontWeight: isExpiringSoon ? 700 : 400,
                }}
              >
                {deadline.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {donation.description && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--txt4)",
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                {donation.description.length > 80
                  ? donation.description.substring(0, 80) + "..."
                  : donation.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--g5)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className="bi bi-person-fill"
                  style={{ fontSize: 12, color: "var(--txt3)" }}
                />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "var(--txt3)",
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {donation.donor?.name || "Anonim"}
                </p>
                {donation.donor?.rating > 0 && (
                  <p style={{ margin: 0, fontSize: 10, color: "#e8b84b" }}>
                    ★ {donation.donor.rating}
                  </p>
                )}
              </div>
            </div>

            <Link
              to={`/donations/${donation._id}`}
              className="btn-green-gradient outfit"
              style={{
                textDecoration: "none",
                borderRadius: 10,
                padding: "7px 16px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Detail →
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default DonationCard;
