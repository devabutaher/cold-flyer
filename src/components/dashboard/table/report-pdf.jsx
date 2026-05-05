import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { padding: 32, fontFamily: "Helvetica", fontSize: 8 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: { fontSize: 8, color: "#6b7280", marginBottom: 16 },
  table: {
    flexDirection: "column",
    border: "1pt solid #e5e7eb",
    borderRadius: 3,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottom: "1pt solid #e5e7eb",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    borderBottom: "1pt solid #f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  rowEven: { backgroundColor: "#fafafa" },
  rowLast: { borderBottom: "none" },
  headerCell: {
    fontWeight: "bold",
    color: "#111827",
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    overflow: "hidden",
  },
  cell: {
    color: "#374151",
    fontSize: 8,
    overflow: "hidden",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7, color: "#9ca3af" },
});

export function ReportPDF({ title, columns, data }) {
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        {/* Header */}
        <Text style={s.title}>{title}</Text>
        <Text style={s.subtitle}>
          Generated {generatedAt} · {data.length} record
          {data.length !== 1 ? "s" : ""}
        </Text>

        {/* Table */}
        <View style={s.table}>
          {/* Column headers */}
          <View style={s.headerRow}>
            {columns.map((col) => (
              <Text
                key={col.accessorKey}
                style={[s.headerCell, { flex: col.width ?? 1 }]}
              >
                {col.header}
              </Text>
            ))}
          </View>

          {/* Data rows */}
          {data.map((row, ri) => (
            <View
              key={ri}
              style={[
                s.row,
                ri % 2 === 0 ? s.rowEven : {},
                ri === data.length - 1 ? s.rowLast : {},
              ]}
            >
              {columns.map((col) => {
                const raw = row[col.accessorKey];
                const value = raw != null ? String(raw) : "—";
                return (
                  <Text
                    key={col.accessorKey}
                    style={[s.cell, { flex: col.width ?? 1 }]}
                  >
                    {value}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>ColdFlyer</Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
