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
    width: '40%', // Adjust width for watermark 
    height: '40%', // Adjust height for watermark 
  },
  line: { 
    borderBottomWidth: 1, 
    borderBottomColor: 'black', 
    marginVertical: 10, 
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
  totalCell: { 
    backgroundColor: 'black', // Background color for total fee 
    color: 'white', // Text color for total fee 
    padding: 3, 
    borderWidth: 0.5, 
    borderColor: 'black', 
    borderStyle: 'solid', 
    flex: 1, 
    textAlign: 'left', 
  },
  footer: { 
    position: 'absolute', 
    bottom: 20, // Distance from bottom 
    left: 0, 
    right: 0, 
    marginTop: 20, 
    fontSize: 10, 
    textAlign: 'center', 
  },
});

// Utility function to convert month number to month name
const getMonthName = (monthNumber) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return monthNames[monthNumber - 1]; // monthNumber is 1-based
};

const FeePdf = ({ feeDetails }) => {
  console.log(feeDetails); // Verify data
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
                <Text style={styles.header}>Rahbar Public School </Text>
              </View>
              <Text style={{fontSize:"10px", textAlign:"center"}}>Contact: +92 3151436832</Text>

              <Text style={styles.title}>
                Fee Invoice for {getMonthName(feeDetail.fmonth)} - {feeDetail.fyear}
              </Text>
              <Text style={styles.title}>Note: Due date is 10th of each month.</Text>

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
                  <Text style={styles.tableCell}>Program:</Text>
                  <Text style={styles.tableCell}>{feeDetail.FeeStandard}</Text>
                </View>
              </View>

              <Text style={styles.title}>Fee Detail</Text>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Monthly Fee:</Text>
                  <Text style={styles.tableCell}>Rs. {feeDetail.monthly_fee}/-</Text>
                </View>

                {feeDetail.total_arrears > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Arrears:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.total_arrears}/-</Text>
                  </View>
                )}
                {feeDetail.exam_fee > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Exam Fee:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.exam_fee}/-</Text>
                  </View>
                )}
                {feeDetail.misc_fee > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {feeDetail.remarks && feeDetail.remarks.trim() !== '' ? feeDetail.remarks : 'Misc Fee'}:
                    </Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.misc_fee}/-</Text>
                  </View>
                )}

                <View style={styles.tableRow}>
                  <Text style={styles.totalCell}>Payable Before Due Date:</Text>
                  <Text style={styles.totalCell}>Rs. {feeDetail.total_fee}</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Late Fee Fine:</Text>
                  <Text style={styles.tableCell}>Rs. 100/-</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.totalCell}>Payable After Due Date:</Text>
                  <Text style={styles.totalCell}>Rs. {feeDetail.total_fee + 100}</Text>
                </View>
              </View>

              {/* Horizontal line above bank details */}
              <View style={styles.line} />

              <View style={styles.footer}>
                <View style={styles.line} />
                <Text>Easy Paisa Account No: 0342-4449242</Text>
                <Text>
                Askari Bank, Garhi Habibullah Branch</Text>
                <Text> A/C No:
                02410100002929</Text>

                

              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default FeePdf;
