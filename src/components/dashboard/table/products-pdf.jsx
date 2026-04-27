import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  table: { display: "flex", flexDirection: "column" },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottom: "1pt solid #e5e7eb",
    padding: "6 4",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1pt solid #f3f4f6",
    padding: "5 4",
  },
  cell: { fontSize: 8, flex: 1, color: "#374151" },
  headerCell: { fontSize: 8, flex: 1, fontWeight: "bold", color: "#111827" },
});

const PDF_COLS = [
  "SKU",
  "Name",
  "Category",
  "Brand",
  "Price",
  "Stock",
  "Rating",
  "Warranty",
];

export function ProductsPDF({ data }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>ColdFlyer — Products Report</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.headerRow}>
            {PDF_COLS.map((col) => (
              <Text key={col} style={pdfStyles.headerCell}>
                {col}
              </Text>
            ))}
          </View>
          {data.map((p) => (
            <View key={p.id} style={pdfStyles.row}>
              <Text style={pdfStyles.cell}>{p.sku}</Text>
              <Text style={pdfStyles.cell}>{p.name}</Text>
              <Text style={pdfStyles.cell}>{p.category}</Text>
              <Text style={pdfStyles.cell}>{p.brand}</Text>
              <Text style={pdfStyles.cell}>৳{p.price}</Text>
              <Text style={pdfStyles.cell}>{p.stock}</Text>
              <Text style={pdfStyles.cell}>{p.rating}</Text>
              <Text style={pdfStyles.cell}>{p.warranty}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
