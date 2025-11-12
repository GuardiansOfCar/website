"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/v2/components/ui/table";
import { ReactNode } from "react";
import { Button } from "@/app/v2/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  data?: TData[];
  total?: number;
  rowActionButtons?: {
    label: string;
    onClick: (data: TData[]) => Promise<void>;
  }[];
  onRowClick?: (data: TData) => void;
  toolbar?: ReactNode;
  title?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  rowActionButtons,
  onRowClick,
  toolbar,
  title,
  className,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div className={"flex items-center justify-between"}>
        <h3 className={"text-lg font-bold"}>{title}</h3>

        <div className={"flex items-center space-x-4"}>
          {toolbar}
          {rowActionButtons && rowActionButtons.length > 0 && (
            <div className={"flex items-center space-x-2"}>
              {rowActionButtons.map((button, idx) => (
                <Button
                  key={idx}
                  variant="default"
                  className="bg-primary text-black hover:bg-primary/90 font-medium"
                  onClick={() => {
                    button
                      .onClick(
                        table.getSelectedRowModel().rows.map((x) => x.original)
                      )
                      .then(() => {
                        table.toggleAllPageRowsSelected(false);
                      });
                  }}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original);
                    }
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  결과 없음.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
