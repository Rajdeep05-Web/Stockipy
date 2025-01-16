import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    // marginBottom: 10,
    // borderBottom: '1 solid #333',
    // paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2563eb',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoGroup: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  label: {
    width: 80,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  value: {
    flex: 1,
    color: '#1e293b',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 2,
    color: '#1e293b',
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  colProduct: { flex: 2 },
  colRate: { flex: 1, textAlign: 'right' },
  colQty: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalSection: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    marginRight: 20,
    color: '#1e293b',
  },
  totalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#2563eb',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
});

export const StockInPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>STOCK-IN INVOICE</Text>
        <View style={styles.invoiceInfo}>
          <View style={styles.infoGroup}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Invoice No:</Text>
              <Text style={styles.value}>{data.invoiceNo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {format(new Date(data.date), 'dd/MM/yyyy')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendor Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.vendor.name || 'NA'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.vendor.email || 'NA'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.vendor.phone || 'NA'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.vendor.address || 'NA'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>GST No:</Text>
          <Text style={styles.value}>{data.vendor.gstNo || 'NA'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colProduct}>Product</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colQty}>Quantity</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {data.products.map((product, index) => {
            const total = product.productPurchaseRate * product.quantity;
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colProduct}>{product.product.name}</Text>
                <Text style={styles.colRate}>{product.productPurchaseRate}</Text>
                <Text style={styles.colQty}>
                  {product.quantity} {product.quantity > 1 ? 'pcs' : 'pc'}
                </Text>
                <Text style={styles.colTotal}>{total}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{data.totalAmount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);