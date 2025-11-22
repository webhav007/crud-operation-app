"use client";

import UserTable from "@/components/users/UserTable";
import { useUsers } from "@/hooks/useUser";
import { useState, useMemo } from "react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [company, setCompany] = useState<string | null>(null);

  const { data: allUsers, isLoading } = useUsers();

  // Apply filters 
  const filteredAndSortedUsers = useMemo(() => {
    if (!allUsers) return [];

    let data = [...allUsers];

    if (company) {
      data = data.filter((u) => u.company.name === company);
    }

    if (search.trim() !== "") {
      data = data.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by email
    if (sort) {
      data.sort((a, b) =>
        sort === "asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email)
      );
    }

    return data;
  }, [allUsers, company, search, sort]);

  const paginatedData = useMemo(() => {
    const perPage = 5;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      users: filteredAndSortedUsers.slice(start, end),
      total: filteredAndSortedUsers.length,
      totalPages: Math.ceil(filteredAndSortedUsers.length / perPage),
    };
  }, [filteredAndSortedUsers, page]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Users</h2>

      <UserTable
        loading={isLoading}
        data={paginatedData}
        allUsers={allUsers || []}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        company={company}
        setCompany={setCompany}
      />
    </div>
  );
}
