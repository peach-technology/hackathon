import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { usePoolListQuery, type PoolType } from "@/hooks/api/pool";
import { toast } from "sonner";

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
  },
  {
    accessorKey: "volume_1h",
    header: "1H Volume",
  },
  {
    accessorKey: "volume_6h",
    header: "6H Volume",
  },
  {
    accessorKey: "volume_24h",
    header: "24H Volume",
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

  if (isPending) return null; // 로딩화면 혹은 스켈레톤
  if (status === "error") return null; // 에러 화면

  return (
    <Card>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/detail/${row.original.network_name}/${row.original.pool_address}`
                      )
                    }
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePage;
