import '../styles/skeleton.css';

export function DashboardSkeleton() {
  return (
    <div className="section">
      <div className="card">
        <div className="skeleton-title"></div>
        <div className="skeleton-button"></div>
        
        <div className="dashboards-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dashboard-item skeleton-item">
              <div className="dashboard-header">
                <div className="skeleton-text skeleton-text-lg"></div>
              </div>
              <div className="skeleton-text skeleton-text-md"></div>
              <div className="skeleton-text skeleton-text-sm"></div>
              <div className="dashboard-actions">
                <div className="skeleton-button-small"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="section">
      <div className="card">
        <div className="skeleton-title"></div>
        <div className="skeleton-button"></div>
        
        <div className="insights-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="insight-item skeleton-item">
              <div className="skeleton-text skeleton-text-lg"></div>
              <div className="skeleton-text skeleton-text-md"></div>
              <div className="insight-meta">
                <div className="skeleton-badge"></div>
                <div className="skeleton-badge"></div>
              </div>
              <div className="skeleton-text skeleton-text-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
