import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Replace with your watermark image path or import your watermark image
import watermarkImg from '../Images/logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 15,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    opacity: 0.1,
    zIndex: -1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 10,
  },
  table: {
    width: '100%', // changed from 'auto' to '100%'
    border: '1px solid black',
    borderCollapse: 'collapse',
    marginBottom: 10,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    height: 30, // Increased height for better readability
  },
  tableCell: {
    border: '1px solid black',
    padding: 6,
    fontSize: 12,
  },
  firstColumn: {
    width: '10%',
    textAlign: 'left',
  },
  serialNumberColumn: {
    width: '10%',
    textAlign: 'center',
  },
  categoryColumn: {
    width: '40%',
    textAlign: 'left',
  },
  otherColumn: {
    width: '15%',
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#d0d0d0',
    height: 35,
  },
  totalCell: {
    border: '1px solid black',
    padding: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalFirstColumn: {
    width: '30%',
    textAlign: 'left',
  },
  totalOtherColumn: {
    width: '20%',
    textAlign: 'center',
  },
});

const FeePdf = ({ feeDetails }) => {
  const data = feeDetails[0];

  // Helper to get values safely
  const getValue = (path, defaultVal = 0) => {
    return feeDetails[0]?.[path] ?? defaultVal;
  };

  // Calculate totals
  const totalFee = 
  (getValue('monthly_total_fee') || 0) +
   (getValue('total_adm_fee') || 0) + 
   (getValue('total_exam_fee') || 0) +
    (getValue('total_misc_fee') || 0) + 
    (getValue('total_fine_fee') || 0);

    //calculate total arrears
    
  const totalArrears = 
  (getValue('monthly_fee_arrears') || 0) +
  (getValue('total_adm_arrears') || 0) + 
  (getValue('total_exam_arrears') || 0) +
   (getValue('total_misc_arrears') || 0) + 
   (getValue('total_fine_arrears') || 0);


  const totalReceived = (getValue('total_collection') || 0) +
   (getValue('total_adm_collection') || 0) + 
   (getValue('total_exam_collection') || 0) + 
   (getValue('total_misc_collection') || 0) + 
   (getValue('total_fine_collection') || 0);
  
   const totalBalance = totalFee + totalArrears - totalReceived;

  // Extract month and year for heading
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = (feeDetails[0]?.month ?? 1) - 1;
  const monthName = monthNames[monthIndex] ?? '';
  const year = feeDetails[0]?.year ?? '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        {watermarkImg && (
          <Image src={watermarkImg} style={styles.watermark} />
        )}
        {/* Heading */}
        <View style={styles.headerContainer}>
        <Text style={styles.heading}>
        PIPS, Murree</Text>
  <Text style={styles.heading}>
    Fee Report - Month ({getValue('fmonth')}) & Year ({getValue('fyear')})
  </Text>
</View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.serialNumberColumn]}>S.No</Text>
            <Text style={[styles.tableCell, styles.categoryColumn]}>Category</Text>
            <Text style={[styles.tableCell, styles.otherColumn]}>Fee </Text>
            <Text style={[styles.tableCell, styles.otherColumn]}>Arrears</Text>
            <Text style={[styles.tableCell, styles.otherColumn]}>Total Fee</Text>
            <Text style={[styles.tableCell, styles.otherColumn]}>Received</Text>
            <Text style={[styles.tableCell, styles.otherColumn]}>Balance</Text>
          </View>

          {/* Data Rows */}
          {/* Monthly Fee */}
          <View style={styles.tableRow}>
  <Text style={[styles.tableCell, styles.serialNumberColumn]}>1</Text>
  <Text style={[styles.tableCell, styles.categoryColumn]}>Monthly Fee</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('monthly_total_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('monthly_fee_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('monthly_fee_arrears')+getValue('monthly_total_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_collection', 0)}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>
  {getValue('monthly_total_fee')+getValue('monthly_fee_arrears')-getValue('total_collection')}
  </Text>
</View>

{/* // Fine Fee */}
<View style={styles.tableRow}>
  <Text style={[styles.tableCell, styles.serialNumberColumn]}>2</Text>
  <Text style={[styles.tableCell, styles.categoryColumn]}>Fine Fee</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_fine_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_fine_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_fine_arrears')+getValue('total_fine_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_fine_collection', 0)}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('fine_balance', 0)}</Text>
</View>

{/* // Exam Fee */}
<View style={styles.tableRow}>
  <Text style={[styles.tableCell, styles.serialNumberColumn]}>3</Text>
  <Text style={[styles.tableCell, styles.categoryColumn]}>Exam Fee</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_exam_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_exam_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_exam_fee')+getValue('total_exam_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_exam_collection', 0)}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('exam_balance', 0)}</Text>
</View>

{/* // Admission Fee */}
<View style={styles.tableRow}>
  <Text style={[styles.tableCell, styles.serialNumberColumn]}>4</Text>
  <Text style={[styles.tableCell, styles.categoryColumn]}>Admission Fee</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_adm_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_adm_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_adm_fee')+getValue('total_adm_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_adm_collection', 0)}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('adm_balance', 0)}</Text>
</View>

{/* // Extra Fee */}
<View style={styles.tableRow}>
  <Text style={[styles.tableCell, styles.serialNumberColumn]}>5</Text>
  <Text style={[styles.tableCell, styles.categoryColumn]}>Extra Fee</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_misc_fee')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_misc_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_misc_fee')+getValue('total_misc_arrears')}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('total_misc_collection', 0)}</Text>
  <Text style={[styles.tableCell, styles.otherColumn]}>{getValue('misc_balance', 0)}</Text>
</View>

{/* // Total Row */}
<View style={styles.totalRow}>
  <Text style={[styles.tableCell, styles.serialNumberColumn]}></Text>
  <Text style={[styles.tableCell, styles.categoryColumn, styles.totalCell]}>Total</Text>
  <Text style={[styles.tableCell, styles.otherColumn, styles.totalCell]}>{totalFee}</Text>
  <Text style={[styles.tableCell, styles.otherColumn, styles.totalCell]}>{totalArrears}</Text>
  <Text style={[styles.tableCell, styles.otherColumn, styles.totalCell]}>{totalFee + totalArrears}</Text>
  <Text style={[styles.tableCell, styles.otherColumn, styles.totalCell]}>{totalReceived}</Text>
  <Text style={[styles.tableCell, styles.otherColumn, styles.totalCell]}>{totalBalance}</Text>
</View>
        </View>
      </Page>
    </Document>
  );
};

export default FeePdf;