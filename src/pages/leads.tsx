import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/leads.module.css";
import Sidebar from "../components/sideBar";
import { GoArrowDown, GoArrowUp } from "react-icons/go";

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
    // DEBUG: Check what is in sessionStorage
    console.log("Retrieving leads from sessionStorage...");
    const storedLeads = JSON.parse(sessionStorage.getItem("leads") || "[]");

    if (!Array.isArray(storedLeads)) {
      console.error("Leads in sessionStorage are corrupted:", storedLeads);
      return;
    }

    console.log("Loaded leads:", storedLeads);
    setLeads(storedLeads);
  }, []);

  // Fix filtering: Ensure correct property names
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

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.header}>Leads</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.statusDropdown}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reached Out">Reached Out</option>
          </select>
        </div>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("firstName")}>
                  Name
                  {sortColumn === "firstName" && (
                    <span>
                      {sortOrder === "asc" ? <GoArrowUp /> : <GoArrowDown />}
                    </span>
                  )}
                </th>

                <th onClick={() => handleSort("email")}>
                  Email
                  {sortColumn === "email" && (
                    <span>
                      {sortOrder === "asc" ? <GoArrowUp /> : <GoArrowDown />}
                    </span>
                  )}
                </th>

                <th onClick={() => handleSort("status")}>
                  Status
                  {sortColumn === "status" && (
                    <span>
                      {sortOrder === "asc" ? <GoArrowUp /> : <GoArrowDown />}
                    </span>
                  )}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td>{lead.email}</td>
                  <td>{lead.status || "Pending"}</td>
                  <td>
                    {lead.status !== "Reached Out" && (
                      <button
                        onClick={() => {
                          setLeads((prevLeads) => {
                            const updatedLeads = prevLeads.map((l) =>
                              l.id === lead.id
                                ? { ...l, status: "Reached Out" }
                                : l
                            );

                            // Store updated leads in sessionStorage
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
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? styles.active : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
