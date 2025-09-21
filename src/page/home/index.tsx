import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { usePoolListQuery, type PoolType } from "@/hooks/api/pool";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { ArrowUpDown as ArrowUpDownIcon, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();
  const { data, isPending, status, error } = usePoolListQuery();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    if (status === "error") {
      toast.error(error.message);
    }
  }, [status, error]);

  if (status === "error") return <p className="text-center">Error</p>;

  return (
    <div className="overflow-hidden rounded-md space-y-5">
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <Input
          placeholder="Search Token"
          value={(table.getColumn("pool_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("pool_name")?.setFilterValue(event.target.value)}
          className="pl-8"
        />
      </div>
      <Table className="border-spacing-y-[20px] border-separate border-spacing-x-0">
        <colgroup>
          <col className="w-[5%]" />
          <col className="w-[8%]" />
          <col className="w-[8%]" />
          <col className="w-[40%]" />
        </colgroup>

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header, index) => {
                const isFirst = index === 0;
                const isLast = index === headerGroup.headers.length - 1;

                return (
                  <TableHead
                    key={header.id}
                    className={`
                          bg-neutral-800 py-3 px-4
                          ${isFirst ? "rounded-tl-md rounded-bl-md" : ""}
                          ${isLast ? "rounded-tr-md rounded-br-md" : ""}
                        `}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="[&>tr>td]:border-0 [&>tr>td]:bg-neutral-800 [&>tr>td]:transition-colors [&>tr>td]:duration-200 [&>tr>td]:ease-out motion-reduce:[&>tr>td]:transition-none [&>tr:hover>td]:bg-neutral-700 [&>tr>td:first-child]:rounded-l-md [&>tr>td:last-child]:rounded-r-md">
          {isPending && (
            <>
              {Array.from({ length: 20 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-none">
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-[30px] w-full rounded-2xl bg-neutral-700" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}

          {!isPending && (
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-0 cursor-pointer"
                    onClick={() => navigate(`/detail/${row.original.network_name}/${row.original.pool_address}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-0">
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HomePage;

const columns: ColumnDef<PoolType>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    header: "Network",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex -space-x-4 items-center">
          <>
            {r.token0_logo && (
              <Avatar>
                <AvatarImage src={r.token0_logo} />
              </Avatar>
            )}
            {r.token1_logo && (
              <Avatar>
                <AvatarImage src={r.token1_logo} />
              </Avatar>
            )}
          </>
        </div>
      );
    },
  },

  {
    header: "Name",
    accessorKey: "pool_name",
    cell: ({ row }) => {
      return `${row.original.token0_symbol} / ${row.original.token1_symbol}`;
    },
  },

  {
    header: "Protocol",
    accessorKey: "dex_version",
    cell: ({ row }) => {
      return row.getValue("dex_version");
    },
  },

  {
    accessorKey: "fee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0! cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fee
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fee = row.getValue("fee") as number;
      return `${(fee / 10000).toFixed(1)}%`;
    },
  },

  {
    accessorKey: "reserve_in_usd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0! cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TVL
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return `$${formatUSD(row.getValue("reserve_in_usd"))}`;
    },
  },
  {
    accessorKey: "volume_24h",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0! cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          24H Volume
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      return `$${formatUSD(row.getValue("volume_24h"))}`;
    },
  },
];
