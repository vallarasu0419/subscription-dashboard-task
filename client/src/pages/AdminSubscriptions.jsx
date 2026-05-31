import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../components/StatusBadge.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import {
  fetchAllSubscriptions,
  selectSubscriptions,
} from "../features/subscriptions/subscriptionsSlice.js";
import { formatDate, formatPrice, getInitials } from "../utils/format.js";
import { SUBSCRIPTION_STATUS } from "../utils/constants.js";
import styles from "./AdminSubscriptions.module.css";

const SORT_OPTIONS = [
  { value: "start_desc", label: "Newest first" },
  { value: "start_asc", label: "Oldest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "end_asc", label: "Ending soonest" },
  { value: "end_desc", label: "Ending latest" },
];

const AdminSubscriptions = () => {
  const dispatch = useDispatch();
  const { all, allStatus, error } = useSelector(selectSubscriptions);

  // Filter / search / sort UI state.
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("start_desc");

  useEffect(() => {
    dispatch(fetchAllSubscriptions());
  }, [dispatch]);

  // Unique plan names for the Plan dropdown, derived from the data.
  const planOptions = useMemo(() => {
    const names = new Set(all.map((s) => s.plan?.name).filter(Boolean));
    return Array.from(names).sort();
  }, [all]);

  // Apply search -> filters -> sort in one memoized pass.
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    let rows = all.filter((sub) => {
      const matchesSearch =
        !query ||
        sub.user?.name?.toLowerCase().includes(query) ||
        sub.user?.email?.toLowerCase().includes(query);

      const matchesPlan = planFilter === "all" || sub.plan?.name === planFilter;
      const matchesStatus =
        statusFilter === "all" || sub.status === statusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });

    const time = (v) => (v ? new Date(v).getTime() : 0);
    const price = (s) => s.plan?.price ?? 0;

    rows = [...rows].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return price(a) - price(b);
        case "price_desc":
          return price(b) - price(a);
        case "start_asc":
          return time(a.startDate) - time(b.startDate);
        case "start_desc":
          return time(b.startDate) - time(a.startDate);
        case "end_asc":
          return time(a.endDate) - time(b.endDate);
        case "end_desc":
          return time(b.endDate) - time(a.endDate);
        default:
          return 0;
      }
    });

    return rows;
  }, [all, search, planFilter, statusFilter, sortBy]);

  // Summary reflects the *filtered* view so it stays meaningful.
  const summary = useMemo(() => {
    const total = visible.length;
    const active = visible.filter(
      (s) => s.status === SUBSCRIPTION_STATUS.ACTIVE,
    ).length;
    const revenue = visible
      .filter((s) => s.status === SUBSCRIPTION_STATUS.ACTIVE)
      .reduce((sum, s) => sum + (s.plan?.price || 0), 0);
    return { total, active, revenue };
  }, [visible]);

  const resetFilters = () => {
    setSearch("");
    setPlanFilter("all");
    setStatusFilter("all");
    setSortBy("start_desc");
  };

  const hasActiveFilters =
    search ||
    planFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "start_desc";

  return (
    <div>
      <header className="page-header">
        <h1>All subscriptions</h1>
        <p>Every subscription across all members.</p>
      </header>

      {allStatus === "loading" && (
        <Spinner center label="Loading subscriptions" />
      )}

      {allStatus === "failed" && (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchAllSubscriptions())}
        />
      )}

      {allStatus === "succeeded" && all.length === 0 && (
        <EmptyState
          title="No subscriptions yet"
          description="Once members subscribe to a plan, they'll appear here."
        />
      )}

      {allStatus === "succeeded" && all.length > 0 && (
        <>
          {/* Summary first */}
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Showing</span>
              <span className={styles.summaryValue}>{summary.total}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Active</span>
              <span className={styles.summaryValue}>{summary.active}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Active MRR</span>
              <span className={styles.summaryValue}>
                {formatPrice(summary.revenue)}
              </span>
            </div>
          </div>

          {/* Search + filters: 12-col grid (3/6/12 per item) */}
          <div className={styles.toolbar}>
            <input
              type="search"
              className={`input ${styles.cell} ${styles.search}`}
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search subscriptions by member name or email"
            />

            <select
              className={`input ${styles.cell} ${styles.select}`}
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              aria-label="Filter by plan"
            >
              <option value="all">All plans</option>
              {planOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className={`input ${styles.cell} ${styles.select}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value={SUBSCRIPTION_STATUS.ACTIVE}>Active</option>
              <option value={SUBSCRIPTION_STATUS.EXPIRED}>Expired</option>
              <option value={SUBSCRIPTION_STATUS.CANCELLED}>Cancelled</option>
            </select>

            <select
              className={`input ${styles.cell} ${styles.select}`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort subscriptions"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className={`btn btn-ghost btn-sm ${styles.clearBtn}`}
                onClick={resetFilters}
              >
                Clear
              </button>
            )}
          </div>

          {/* No rows after filtering */}
          {visible.length === 0 ? (
            <EmptyState
              title="No matches"
              description="No subscriptions match your search or filters."
              action={
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={resetFilters}
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <>
              {/* Table for wide screens */}
              <div className={`card ${styles.tableWrap}`}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Plan</th>
                      <th>Price</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <div className={styles.member}>
                            <span className={styles.avatar}>
                              {getInitials(sub.user?.name)}
                            </span>
                            <div className={styles.memberMeta}>
                              <span className={styles.memberName}>
                                {sub.user?.name || "Unknown"}
                              </span>
                              <span className={styles.memberEmail}>
                                {sub.user?.email || "—"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{sub.plan?.name || "—"}</td>
                        <td>{formatPrice(sub.plan?.price ?? 0)}</td>
                        <td>{formatDate(sub.startDate)}</td>
                        <td>{formatDate(sub.endDate)}</td>
                        <td>
                          <StatusBadge status={sub.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card list for narrow screens */}
              <div className={styles.cards}>
                {visible.map((sub) => (
                  <div key={sub.id} className={`card ${styles.mobileCard}`}>
                    <div className={styles.mobileTop}>
                      <div className={styles.member}>
                        <span className={styles.avatar}>
                          {getInitials(sub.user?.name)}
                        </span>
                        <div className={styles.memberMeta}>
                          <span className={styles.memberName}>
                            {sub.user?.name || "Unknown"}
                          </span>
                          <span className={styles.memberEmail}>
                            {sub.user?.email || "—"}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                    <dl className={styles.mobileMeta}>
                      <div>
                        <dt>Plan</dt>
                        <dd>{sub.plan?.name || "—"}</dd>
                      </div>
                      <div>
                        <dt>Price</dt>
                        <dd>{formatPrice(sub.plan?.price ?? 0)}</dd>
                      </div>
                      <div>
                        <dt>Start</dt>
                        <dd>{formatDate(sub.startDate)}</dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>{formatDate(sub.endDate)}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSubscriptions;
