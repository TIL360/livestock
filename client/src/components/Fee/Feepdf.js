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
    justifyContent: 'flex-start', // Align to the start of the container
    marginBottom: 10,
  },
  headerTextContainer: {
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'center', // Center items vertically
    alignItems: 'flex-start', // Align items to the left
    marginLeft: 5, // Space between logo and header text
  },
  header: {
    fontSize: 14,
    textAlign: 'left', // Align text to the left
    textDecoration: 'underline',
    fontWeight: 'bold',
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
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return monthNames[monthNumber - 1]; // monthNumber is 1-based
};

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

  // Array of copy titles
  const copyTitles = ['School\'s Copy', 'Bank\'s Copy', 'Student\'s Copy'];

  return (
    <Document>
      {pages.map((page, index) => (
        <Page size="A4" orientation="landscape" style={styles.page} key={index}>
          {/* Watermark logo */}
          <Image style={styles.watermark} src={logo} />
          {page.map((feeDetail, pageIndex) => (
            <View style={styles.column} key={pageIndex}>
              {/* Add this line for copy titles */}
              <View style={styles.headerContainer}>
                <Image style={styles.logo} src={logo} />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.header}>Pakistan International </Text>
                  <Text style={styles.header}>Public School, Murree</Text>
                </View>
              </View>
              <Text style={styles.title}>{copyTitles[pageIndex]}</Text>
              <Text style={styles.title}> Fee Invoice for {getMonthName(feeDetail.fmonth)} - {feeDetail.fyear} </Text>
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
                  <Text style={styles.tableCell}>Grade:</Text>
                  <Text style={styles.tableCell}>{feeDetail.FeeStandard}</Text>
                </View>
              </View>

              <Text style={styles.title}>Fee Detail</Text>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Monthly Fee:</Text>
                  <Text style={styles.tableCell}>Rs. {feeDetail.monthly_fee_feetbl}/-</Text>
                </View>

                {feeDetail.total_arrears > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Arrears:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.total_arrears}/-</Text>
                  </View>
                )}

                {feeDetail.adm_fee > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Adm Fee:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.adm_fee}/-</Text>
                  </View>
                )}

                {feeDetail.adm_arrears > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Adm Arrears:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.adm_arrears}/-</Text>
                  </View>
                )}

                {feeDetail.exam_fee > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Exam Fee:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.exam_fee}/-</Text>
                  </View>
                )}

                {feeDetail.exam_arrears > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Exam Arrears:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.exam_arrears}/-</Text>
                  </View>
                )}

                {feeDetail.fine_fee > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Fine Fee:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.fine_fee}/-</Text>
                  </View>
                )}

                {feeDetail.fine_arrears > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Fine Arrears:</Text>
                    <Text style={styles.tableCell}>Rs. {feeDetail.fine_arrears}/-</Text>
                  </View>
                )}
{feeDetail.misc_fee > 0 && (
  <View style={styles.tableRow}>
    <Text style={styles.tableCell}>{feeDetail.remakrs ? feeDetail.remakrs : "Misc Fee"}</Text>
    <Text style={styles.tableCell}>Rs. {feeDetail.misc_fee}/-</Text>
  </View>
)}

{feeDetail.fazool_misc_arrears > 0 && (
  <View style={styles.tableRow}>
    <Text style={styles.tableCell}>{feeDetail.misc_arrears ? feeDetail.misc_arrears : "Misc Fee Arrears"}:</Text>
    <Text style={styles.tableCell}>Rs. {feeDetail.misc_arrears}/-</Text>
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

              <View style={styles.footer}>
                <View style={styles.line} />
                <Text style={{ textAlign: "left", width: "90%" }}>
                  1. Fee Dues must be paid before 10th of every month.
                </Text>
                <Text style={{ textAlign: "left", width: "90%" }}>
                  2. Late fee fine (100) will be charged after due date.
                </Text>
                <Text style={{ textAlign: "left", width: "90%" }}>
                  3. Defaulters of more than two months will be struck off from the school
                </Text>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default FeePdf;
