import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../Images/logo.png'; // Adjust the path to your logo image

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    padding: 20,
    fontSize: 10,
    lineHeight: 1.2,
    position: 'relative', // Allow absolute positioning for watermark
  },
  column: {
    width: '33.33%', 
    padding: 10,
    position: 'relative', // Allow positioning of watermark
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold',
    marginLeft: 5, // Space between logo and header text
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40, // Adjusted logo width
    height: 40, // Adjusted logo height
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    opacity: 0.1, // Lighten the watermark
  },
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 3,
    borderWidth: 0.5, // Set border width
    borderColor: 'black', // Set border color
    borderStyle: 'solid', // Set border style
    flex: 1,
    textAlign: 'left',
  },
});

const FeePdf = ({ feeDetails }) => {
  const pages = [];

  feeDetails.forEach((feeDetail) => {
    for (let i = 0; i < 3; i++) {
      if (!pages.length) {
        pages.push([feeDetail]);
      } else {
        const lastPage = pages[pages.length - 1];
        if (lastPage.length < 3) {
          lastPage.push(feeDetail);
        } else {
          pages.push([feeDetail]);
        }
      }
    }
  });

  return (
    <Document>
      {pages.map((page, index) => (
        <Page size="A4" orientation="landscape" style={styles.page} key={index}>
          {/* Watermark logo */}
          <Image style={styles.watermark} src={logo} />
          
          {page.map((feeDetail, pageIndex) => (
            <View style={styles.column} key={pageIndex}>
              <View style={styles.headerContainer}>
                <Image style={styles.logo} src={logo} />
                <Text style={styles.header}>FINAHS, Rwp</Text>
              </View>
              <Text style={styles.title}>Fee Invoice for {feeDetail.fmonth} / {feeDetail.fyear} </Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Invoice No:</Text>
                  <Text style={styles.tableCell}>{feeDetail.idf}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Adm No:</Text>
                  <Text style={styles.tableCell}>{feeDetail.fee_adm_no}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Name:</Text>
                  <Text style={styles.tableCell}>{feeDetail.name}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Father:</Text>
                  <Text style={styles.tableCell}>{feeDetail.father}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Fee Standard:</Text>
                  <Text style={styles.tableCell}>{feeDetail.FeeStandard}</Text>
                </View>
               
              </View>

              <Text style={styles.title}>Fee Detail</Text>
          
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Monthly Fee:</Text>
                  <Text style={styles.tableCell}>{feeDetail.monthly_fee}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Fine:</Text>
                  <Text style={styles.tableCell}>{feeDetail.fine_fee}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Arrears:</Text>
                  <Text style={styles.tableCell}>{feeDetail.arrears}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Total Fee:</Text>
                  <Text style={styles.tableCell}>{feeDetail.total_fee}</Text>
                </View>
               
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default FeePdf;
