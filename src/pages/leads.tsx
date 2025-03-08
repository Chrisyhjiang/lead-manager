import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/leads.module.css";
import Sidebar from "../components/sideBar";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { isAuthenticatedUser } from "../utils/auth";

export default function Leads() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortColumn, setSortColumn] = useState<string | null>("firstName"); // Default sort by firstName
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!isAuthenticatedUser()) {
      router.push("/login");
      return;
    }
    const storedLeads = JSON.parse(sessionStorage.getItem("leads") || "[]");

    if (!Array.isArray(storedLeads)) {
      console.error("Leads in sessionStorage are corrupted:", storedLeads);
      return;
    }
    setLeads(storedLeads);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedStatus]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      `${lead.firstName} ${lead.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (lead.email &&
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.linkedin &&
        lead.linkedin.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!sortColumn) return 0;

    let valueA = a[sortColumn as keyof typeof a];
    let valueB = b[sortColumn as keyof typeof b];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const currentLeads = sortedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h1 className={styles.header}>Leads</h1>

        {/* Search and Filter */}
        <div className={styles.searchFilterContainer}>
          <input
            type="text"
            placeholder="🔍 Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.statusDropdown}
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Reached Out">Reached Out</option>
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.leadsTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort("firstName")}>
                  Name{" "}
                  {sortColumn === "firstName" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("submitted")}>
                  Submitted
                  {sortColumn === "submitted" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("status")}>
                  Status
                  {sortColumn === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("country")}>
                  Country
                  {sortColumn === "country" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Action</th> {/* 🛠 Add back the Action Column */}
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td>{new Date(lead.submitted).toLocaleString()}</td>
                  <td className={styles.status}>{lead.status || "Pending"}</td>
                  <td>{lead.country || "N/A"}</td>
                  <td>
                    {lead.status !== "Reached Out" && (
                      <button
                        className={styles.reachOutButton}
                        onClick={() => {
                          setLeads((prevLeads) => {
                            const updatedLeads = prevLeads.map((l) =>
                              l.id === lead.id
                                ? { ...l, status: "Reached Out" }
                                : l
                            );
                            sessionStorage.setItem(
                              "leads",
                              JSON.stringify(updatedLeads)
                            );
                            return updatedLeads;
                          });
                        }}
                      >
                        Reach Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            className={currentPage === 1 ? styles.disabled : ""}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ◀
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? styles.active : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={currentPage === totalPages ? styles.disabled : ""}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
