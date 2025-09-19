import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { usePoolListQuery, type PoolType } from "@/hooks/api/pool";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/utils/format";

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<PoolType>[] = [
  {
    header: "Pool",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-4">
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
          {r.pool_name}
        </div>
      );
    },
  },
  {
    accessorKey: "dex",
    header: "Dex",
  },
  {
    accessorKey: "reserve_in_usd",
    header: "TVL",
    cell: ({ row }) => {
      return `US$${formatUSD(row.getValue("reserve_in_usd"))}`;
    },
  },
  {
    accessorKey: "volume_1h",
    header: "1H Volume",
    cell: ({ row }) => {
      return `US$${formatUSD(row.getValue("volume_1h"))}`;
    },
  },
  {
    accessorKey: "volume_6h",
    header: "6H Volume",
    cell: ({ row }) => {
      return `US$${formatUSD(row.getValue("volume_6h"))}`;
    },
  },
  {
    accessorKey: "volume_24h",
    header: "24H Volume",
    cell: ({ row }) => {
      return `US$${formatUSD(row.getValue("volume_24h"))}`;
    },
  },
  {
    accessorKey: "combined_apr",
    header: "Combined Apr",
    cell: ({ row }) => {
      return formatUSD(row.getValue("combined_apr"));
    },
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const { data, isPending, status, error } = usePoolListQuery();

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (status === "error") {
      toast(error.message);
    }
  }, [status, error]);

  if (status === "error") return <p className="text-center">Error</p>; // 에러 화면

  return (
    <Card>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {isPending && (
                <>
                  {columns.map((_, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-[20px] w-full rounded-full" />
                    </TableHead>
                  ))}
                </>
              )}
              {!isPending && (
                <>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </>
              )}
            </TableHeader>
            <TableBody>
              {isPending && (
                <>
                  {Array.from({ length: 20 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton className="h-[20px] w-full rounded-full" />
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
                        className="cursor-pointer"
                        onClick={() => navigate(`/detail/${row.original.network_name}/${row.original.pool_address}`)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
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
      </CardContent>
    </Card>
  );
};

export default HomePage;
