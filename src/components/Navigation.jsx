import { Link, useLocation } from 'react-router-dom';
import '../styles/navigation.css';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-items">
          <Link
            to="/dashboard"
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            📊 Dashboards
          </Link>
          <Link
            to="/insights"
            className={`nav-item ${location.pathname === '/insights' ? 'active' : ''}`}
          >
            💡 Insights
          </Link>
        </div>
      </div>
    </nav>
  );
}
