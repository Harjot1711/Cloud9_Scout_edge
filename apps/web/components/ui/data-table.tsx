"use client";

import * as React from "react";
import {
    ChevronUp, ChevronDown, ChevronsUpDown, Search, X,
    SlidersHorizontal, Columns, Download, Copy
} from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type RowSelectionState,
} from "@tanstack/react-table";
import { CopyButton } from "./primitives";

// ============================================================================
// TABLE COMPONENT
// ============================================================================

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    enableRowSelection?: boolean;
    enableColumnVisibility?: boolean;
    enableSearch?: boolean;
    stickyFirstColumn?: boolean;
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Filter...",
    enableRowSelection = false,
    enableColumnVisibility = true,
    enableSearch = true,
    stickyFirstColumn = false,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [showColumnMenu, setShowColumnMenu] = React.useState(false);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                {/* Search */}
                {enableSearch && (
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="input-base pl-10 pr-8"
                        />
                        {globalFilter && (
                            <button
                                onClick={() => setGlobalFilter("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                            >
                                <X className="w-3 h-3 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {/* Selected count */}
                    {enableRowSelection && Object.keys(rowSelection).length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            {Object.keys(rowSelection).length} selected
                        </span>
                    )}

                    {/* Column visibility */}
                    {enableColumnVisibility && (
                        <div className="relative">
                            <button
                                onClick={() => setShowColumnMenu(!showColumnMenu)}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Toggle columns"
                            >
                                <Columns className="w-4 h-4" />
                            </button>

                            {showColumnMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowColumnMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 w-48 p-2 rounded-lg bg-popover border border-border shadow-lg z-50 animate-scale-in">
                                        <p className="text-overline px-2 py-1 mb-1">Toggle Columns</p>
                                        {table.getAllLeafColumns().map((column) => {
                                            if (column.id === "select") return null;
                                            return (
                                                <label
                                                    key={column.id}
                                                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={column.getIsVisible()}
                                                        onChange={column.getToggleVisibilityHandler()}
                                                        className="w-4 h-4 accent-primary"
                                                    />
                                                    <span className="text-sm text-foreground capitalize">
                                                        {column.id.replace(/_/g, " ")}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Export */}
                    <button
                        onClick={() => { }}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Export CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card-base overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="table-tactical w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, idx) => {
                                        const canSort = header.column.getCanSort();
                                        const sorted = header.column.getIsSorted();

                                        return (
                                            <th
                                                key={header.id}
                                                className={stickyFirstColumn && idx === 0 ? "sticky-left" : ""}
                                                style={{ width: header.getSize() }}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <button
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className={`flex items-center gap-1 ${canSort ? "cursor-pointer select-none" : ""}`}
                                                        disabled={!canSort}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {canSort && (
                                                            <span className="ml-1">
                                                                {sorted === "asc" ? (
                                                                    <ChevronUp className="w-3 h-3" />
                                                                ) : sorted === "desc" ? (
                                                                    <ChevronDown className="w-3 h-3" />
                                                                ) : (
                                                                    <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </button>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                                        No results found
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={`group ${onRowClick ? "cursor-pointer" : ""} ${row.getIsSelected() ? "bg-primary/5" : ""
                                            }`}
                                        onClick={() => onRowClick?.(row.original)}
                                    >
                                        {row.getVisibleCells().map((cell, idx) => (
                                            <td
                                                key={cell.id}
                                                className={stickyFirstColumn && idx === 0 ? "sticky-left" : ""}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Showing {table.getRowModel().rows.length} of {data.length} results
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1.5 text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SELECTABLE ROW CHECKBOX
// ============================================================================

export function SelectCheckbox({
    checked,
    onChange,
    indeterminate = false,
}: {
    checked: boolean;
    onChange: () => void;
    indeterminate?: boolean;
}) {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 accent-primary cursor-pointer"
            onClick={(e) => e.stopPropagation()}
        />
    );
}
