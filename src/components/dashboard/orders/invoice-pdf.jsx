"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    fontSize: 10,
  },
  col1: { width: "40%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "25%", textAlign: "right" },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 10,
    color: "#666",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default function InvoicePDF({ order, user }) {
  const CURRENCY = "BDT";

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return "0.00";
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Cold Flyer</Text>
            <Text style={styles.subtitle}>HVAC Equipment & Services</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>#{order.orderNumber || order._id}</Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Order Date</Text>
            <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{order.status?.toUpperCase()}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Payment</Text>
            <Text style={styles.infoValue}>{order.paymentStatus?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Bill To</Text>
          <Text style={styles.infoValue}>{user?.name || "Customer"}</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Price</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Total</Text>
          </View>
          {order.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {CURRENCY} {formatPrice(item.price)}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {CURRENCY} {formatPrice(item.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {CURRENCY} {formatPrice(order.subtotal)}
            </Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>
                -{CURRENCY} {formatPrice(order.discount)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>
              {order.shippingCost > 0 ? `${CURRENCY} ${formatPrice(order.shippingCost)}` : "Free"}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {CURRENCY} {formatPrice(order.tax)}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {CURRENCY} {formatPrice(order.total)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business! | www.coldflyer.com | support@coldflyer.com</Text>
      </Page>
    </Document>
  );
}
