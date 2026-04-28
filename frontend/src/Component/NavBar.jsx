import React from "react";
import { Link } from "react-router";
import { withRouter } from "../Wrapper/withRouter";

const navLinks = [
  { to: "/donations", icon: "bi-box-seam", label: "Donasi", auth: false },
  { to: "/history", icon: "bi-clock-history", label: "Riwayat", auth: true },
  { to: "/messages", icon: "bi-chat-dots", label: "Pesan", auth: true },
  { to: "/community", icon: "bi-people", label: "Komunitas", auth: true },
];

const NavLink = ({ to, icon, label, location }) => {
  const isActive = location?.pathname === to;
  return (
    <Link
      to={to}
      className="outfit"
      style={{
        position: "relative",
        textDecoration: "none",
        color: isActive ? "var(--g1)" : "var(--txt3)",
        fontWeight: isActive ? 700 : 500,
        fontSize: 15,
        padding: "6px 4px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "color 0.2s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = "var(--g1)";
        e.currentTarget.querySelector(".nav-underline").style.width = "100%";
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.color = "var(--txt3)";
        if (!isActive) e.currentTarget.querySelector(".nav-underline").style.width = "0%";
      }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: 16 }} />
      <span className="d-none d-md-inline">{label}</span>
      <span
        className="nav-underline"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: isActive ? "100%" : "0%",
          background: "linear-gradient(90deg, var(--g1), var(--g2))",
          borderRadius: 2,
          transition: "width 0.25s ease",
        }}
      />
    </Link>
  );
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: document.documentElement.getAttribute("data-theme"),
      menuOpen: false,
    };
  }

  setTheme = () => {
    const newTheme = this.state.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    this.setState({ theme: newTheme });
  };

  componentDidMount() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }

  render() {
    const { user } = this.props.auth;
    const isProvider = user?.role === "food_provider";
    const isAdmin = user?.role === "admin";
    const location = this.props.location;
    const { menuOpen } = this.state;

    const allLinks = [
      ...navLinks.filter(l => !l.auth || user),
      ...(isProvider ? [{ to: "/donations/create", icon: "bi-plus-circle", label: "Buat Donasi" }] : []),
      ...(isAdmin ? [{ to: "/admin", icon: "bi-shield-check", label: "Admin" }] : []),
    ];

    return (
      <nav
        className="sticky-top"
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          zIndex: 1050,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* ── Main Bar ── */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ padding: "10px 16px", gap: 8 }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-decoration-none d-flex align-items-center gap-2"
            style={{ flexShrink: 0 }}
          >
            <img
              src="/assets/logo/foodrescue_logo_only.png"
              width={32}
              height={28}
              alt="FoodRescue Logo"
            />
            <div style={{ lineHeight: 1.1 }}>
              <p className="syne-h1 text-green1" style={{ fontSize: 15, margin: 0 }}>
                FoodRescue
              </p>
              <p className="outfit" style={{ fontSize: 9, color: "var(--txt4)", margin: 0, letterSpacing: "0.1em" }}>
                WEB PLATFORM
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="d-none d-md-flex align-items-center"
            style={{ gap: 20, flex: 1, paddingLeft: 28 }}
          >
            {allLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                location={location}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-2">
            {/* Desktop: profile / auth buttons */}
            {user ? (
              <Link
                to="/profile"
                className="text-decoration-none d-none d-md-flex align-items-center gap-2"
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surf2)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--g2)";
                  e.currentTarget.style.background = "var(--g5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--surf2)";
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--g1)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: "#fff", flexShrink: 0,
                }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : <i className="bi bi-person-fill" />
                  }
                </div>
                <span className="outfit" style={{ fontSize: 14, fontWeight: 600, color: "var(--txt2)" }}>
                  {user.first_name} {user.last_name}
                </span>
              </Link>
            ) : (
              <div className="d-none d-md-flex align-items-center gap-2">
                <Link to="/login" className="outfit" style={{
                  padding: "7px 16px", borderRadius: 10,
                  border: "1px solid var(--border)", background: "none",
                  fontSize: 14, fontWeight: 600, color: "var(--txt2)", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--g2)"; e.currentTarget.style.color = "var(--g1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--txt2)"; }}
                >Sign In</Link>
                <Link to="/register" className="outfit" style={{
                  padding: "7px 16px", borderRadius: 10,
                  background: "var(--g1)", fontSize: 14, fontWeight: 600,
                  color: "#fff", textDecoration: "none", transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >Register</Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button className="theme-btn" onClick={this.setTheme} title="Toggle theme">
              <i className={`bi ${this.state.theme === "dark" ? "bi-moon-fill" : "bi-sun-fill"}`} />
            </button>

            {/* Mobile: Hamburger */}
            <button
              className="d-flex d-md-none theme-btn"
              onClick={() => this.setState({ menuOpen: !menuOpen })}
            >
              <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        {menuOpen && (
          <div
            className="d-md-none"
            style={{
              borderTop: "1px solid var(--border)",
              background: "var(--surface)",
              padding: "12px 16px 16px",
            }}
          >
            {/* Nav Links */}
            <div className="d-flex flex-column gap-1 mb-3">
              {allLinks.map((link) => {
                const isActive = location?.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="outfit d-flex align-items-center gap-3"
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--g1)" : "var(--txt2)",
                      background: isActive ? "var(--g5)" : "none",
                      border: isActive ? "1px solid var(--g3)" : "1px solid transparent",
                    }}
                    onClick={() => this.setState({ menuOpen: false })}
                  >
                    <i className={`bi ${link.icon}`} style={{ fontSize: 16, width: 20 }} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              {user ? (
                <Link
                  to="/profile"
                  className="outfit d-flex align-items-center gap-3"
                  style={{
                    padding: "10px 12px", borderRadius: 10,
                    textDecoration: "none", fontSize: 14, fontWeight: 600,
                    color: "var(--txt2)",
                  }}
                  onClick={() => this.setState({ menuOpen: false })}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--g1)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#fff", flexShrink: 0,
                  }}>
                    <i className="bi bi-person-fill" />
                  </div>
                  {user.first_name} {user.last_name}
                </Link>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="outfit flex-fill text-center" style={{
                    padding: "10px", borderRadius: 10,
                    border: "1px solid var(--border)", background: "none",
                    fontSize: 14, fontWeight: 600, color: "var(--txt2)", textDecoration: "none",
                  }}
                    onClick={() => this.setState({ menuOpen: false })}
                  >Sign In</Link>
                  <Link to="/register" className="outfit flex-fill text-center" style={{
                    padding: "10px", borderRadius: 10,
                    background: "var(--g1)", fontSize: 14, fontWeight: 600,
                    color: "#fff", textDecoration: "none",
                  }}
                    onClick={() => this.setState({ menuOpen: false })}
                  >Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }
}

export default withRouter(NavBar);