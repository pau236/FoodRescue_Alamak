import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export function withRouter(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // custom hook
    const auth = useAuth();

    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
        auth={auth} // contains login, user, etc.
      />
    );
  };
}
