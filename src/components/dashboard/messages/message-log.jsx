"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { mapLogRow, LOG_PDF_COLUMNS } from "./message-constants";

function buildLogColumns() {
  return [
    {
      header: "Time",
      accessorKey: "time",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("time") || "\u2014"}</span>,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("name") || "\u2014"}</span>,
    },
    {
      header: "Number",
      accessorKey: "number",
      cell: ({ row }) => <span className="text-sm">{row.getValue("number") || "\u2014"}</span>,
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: ({ row }) => {
        const ch = row.getValue("channel");
        return (
          <Badge variant={ch === "whatsapp" ? "default" : "secondary"} className="text-xxs">
            {ch || "\u2014"}
          </Badge>
        );
      },
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-[300px] truncate block">
          {row.getValue("message") || "\u2014"}
        </span>
      ),
    },
  ];
}

export function MessageLog({ messages, isLoading }) {
  const columns = useMemo(() => buildLogColumns(), []);

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight mb-4">Message Log</h2>
      <DataTable
        columns={columns}
        data={messages.map(mapLogRow)}
        loading={isLoading}
        rowCount="messages"
        defaultSort={[]}
        emptyMessage="No messages sent yet."
        emptyIcon={<MessageSquare size={40} />}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search messages..."
            selectedLabel="messages"
            filters={[]}
            actions={
              <ExportMenu
                table={table}
                filename="message-log"
                mapRow={mapLogRow}
                pdfTitle="ColdFlyer \u2014 Message Log"
                pdfColumns={LOG_PDF_COLUMNS}
              />
            }
          />
        )}
      />
    </div>
  );
}
