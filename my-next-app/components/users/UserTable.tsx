"use client";

import * as Select from "@radix-ui/react-select";
import { User } from "@/types/user";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirm from "./DeleteConfirm";
import UserForm from "./UserForm";
import { useDeleteUser, useUpdateUser, useCreateUser } from "@/hooks/useUserMutations";

interface Props {
    loading: boolean;
    data?: {
        users: User[];
        totalPages: number;
    };
    allUsers: User[];
    page: number;
    setPage: (p: number) => void;
    search: string;
    setSearch: (v: string) => void;
    sort: "asc" | "desc" | null;
    setSort: (v: "asc" | "desc" | null) => void;
    company: string | null;
    setCompany: (v: string | null) => void;
}

export default function UserTable({
    loading,
    data,
    allUsers,
    page,
    setPage,
    search,
    setSearch,
    sort,
    setSort,
    company,
    setCompany,
}: Props) {
    const router = useRouter();
    const users = data?.users ?? [];
    const companies = [...new Set(allUsers.map((u) => u.company.name))];

    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const deleteMutation = useDeleteUser();
    const updateMutation = useUpdateUser();
    const createMutation = useCreateUser();

    const handleDelete = () => {
        if (deleteUser) {
            deleteMutation.mutate(deleteUser.id, {
                onSuccess: () => setDeleteUser(null),
            });
        }
    };

    const handleUpdate = (user: User) => {
        updateMutation.mutate(user, {
            onSuccess: () => setEditUser(null),
        });
    };

    const handleCreate = (user: Omit<User, "id">) => {
        createMutation.mutate(user, {
            onSuccess: () => setCreateOpen(false),
        });
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div
                            className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
                            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
                        />
                        <p style={{ color: 'var(--muted)' }}>Loading users...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* FILTERS */}
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search */}
                            <input
                                className="px-4 py-2.5 rounded-lg w-64 focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    border: '1px solid var(--input-border)',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--foreground)',
                                    boxShadow: '0 1px 2px var(--shadow)'
                                }}
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            {/* Sort */}
                            <select
                                className="px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all cursor-pointer"
                                style={{
                                    border: '1px solid var(--input-border)',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--foreground)',
                                    boxShadow: '0 1px 2px var(--shadow)'
                                }}
                                value={sort ?? ""}
                                onChange={(e) =>
                                    setSort(e.target.value ? (e.target.value as any) : null)
                                }
                            >
                                <option value="">Sort by Email</option>
                                <option value="asc">A → Z</option>
                                <option value="desc">Z → A</option>
                            </select>

                            {/* Company Filter (Radix Select) */}
                            <Select.Root
                                value={company ?? "all"}
                                onValueChange={(v) => setCompany(v === "all" ? null : v)}
                            >
                                <Select.Trigger
                                    className="px-4 py-2.5 rounded-lg w-48 flex justify-between items-center focus:outline-none focus:ring-2 transition-all"
                                    style={{
                                        border: '1px solid var(--input-border)',
                                        backgroundColor: 'var(--input-bg)',
                                        color: 'var(--foreground)',
                                        boxShadow: '0 1px 2px var(--shadow)'
                                    }}
                                >
                                    <Select.Value placeholder="Filter by company">
                                        {company || "Filter by company"}
                                    </Select.Value>
                                    <FaChevronDown />
                                </Select.Trigger>

                                <Select.Content
                                    className="rounded-lg z-50 overflow-hidden"
                                    position="popper"
                                    sideOffset={5}
                                    style={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        boxShadow: '0 4px 6px var(--shadow-md)'
                                    }}
                                >
                                    <Select.Item
                                        value="all"
                                        className="px-4 py-2.5 cursor-pointer hover:opacity-80 outline-none transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                    >
                                        All Companies
                                    </Select.Item>

                                    {companies.map((c) => (
                                        <Select.Item
                                            key={c}
                                            value={c}
                                            className="px-4 py-2.5 cursor-pointer hover:opacity-80 outline-none transition-colors"
                                            style={{ color: 'var(--foreground)' }}
                                        >
                                            {c}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>

                            {/* Clear Filters Button */}
                            {(search || sort || company) && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setSort(null);
                                        setCompany(null);
                                        setPage(1);
                                    }}
                                    className="px-4 py-2.5 rounded-lg transition-all font-medium"
                                    style={{
                                        border: '1px solid var(--input-border)',
                                        color: 'var(--muted)',
                                        boxShadow: '0 1px 2px var(--shadow)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--card-hover)';
                                        e.currentTarget.style.color = 'var(--foreground)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--muted)';
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Create Button */}
                        <button
                            className="px-6 py-2.5 text-white rounded-lg transition-all font-semibold shadow-md"
                            style={{ backgroundColor: "var(--primary)" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 4px 6px var(--shadow-md)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--primary)";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 4px var(--shadow)";
                            }}
                            onClick={() => setCreateOpen(true)}
                        >
                            Create User
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="rounded-xl overflow-hidden shadow-lg" style={{ border: '1px solid var(--border)' }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--card)' }}>
                                    <th className="text-left p-4 font-semibold">Avatar</th>
                                    <th className="text-left p-4 font-semibold">Name</th>
                                    <th className="text-left p-4 font-semibold">Email</th>
                                    <th className="text-left p-4 font-semibold">Phone</th>
                                    <th className="text-left p-4 font-semibold">Company</th>
                                    <th className="text-left p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody style={{ backgroundColor: 'var(--background)' }}>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center" style={{ color: 'var(--muted)' }}>
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="transition-colors hover:bg-opacity-50"
                                            style={{ borderTop: '1px solid var(--border)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td className="p-4">
                                                <div
                                                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold shadow-md"
                                                    style={{ backgroundColor: 'var(--avatar-bg)' }}
                                                >
                                                    {u.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                            </td>
                                            <td
                                                className="p-4 cursor-pointer font-medium transition-colors"
                                                style={{ color: 'var(--primary)' }}
                                                onClick={() => router.push(`/users/${u.id}`)}
                                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                            >
                                                {u.name}
                                            </td>
                                            <td className="p-4" style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                                            <td className="p-4" style={{ color: 'var(--muted-foreground)' }}>{u.phone}</td>
                                            <td className="p-4">{u.company.name}</td>
                                            <td className="p-4 flex gap-2">
                                                <button
                                                    className="px-4 py-2 text-white rounded-lg transition-all font-medium shadow-sm"
                                                    style={{ backgroundColor: 'var(--primary)' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--primary)';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                    onClick={() => setEditUser(u)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-4 py-2 text-white rounded-lg transition-all font-medium shadow-sm"
                                                    style={{ backgroundColor: 'var(--danger)' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--danger-hover)';
                                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--danger)';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                    onClick={() => setDeleteUser(u)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex gap-3">
                        <button
                            className="px-5 py-2.5 rounded-lg disabled:opacity-50 font-medium transition-all shadow-sm"
                            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--card-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                        >
                            Previous
                        </button>

                        <button
                            className="px-5 py-2.5 rounded-lg disabled:opacity-50 font-medium transition-all shadow-sm"
                            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                            disabled={page >= (data?.totalPages ?? 1)}
                            onClick={() => setPage(page + 1)}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--card-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                        >
                            Next
                        </button>
                    </div>

                    {/* Delete Confirmation Dialog */}
                    {deleteUser && (
                        <DeleteConfirm
                            user={deleteUser}
                            open={!!deleteUser}
                            onOpenChange={(open) => !open && setDeleteUser(null)}
                            onConfirm={handleDelete}
                            isDeleting={deleteMutation.isPending}
                        />
                    )}

                    {/* Edit User Dialog */}
                    {editUser && (
                        <UserForm
                            user={editUser}
                            open={!!editUser}
                            onOpenChange={(open) => !open && setEditUser(null)}
                            onSubmit={handleUpdate}
                            isSubmitting={updateMutation.isPending}
                        />
                    )}

                    {/* Create User Dialog */}
                    <UserForm
                        open={createOpen}
                        onOpenChange={setCreateOpen}
                        onSubmit={handleCreate}
                        isSubmitting={createMutation.isPending}
                    />
                </>
            )}
        </div>
    );
}
