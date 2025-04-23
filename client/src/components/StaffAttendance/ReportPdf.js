import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontSize: 10,
    lineHeight: 1.2,
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  table: {
    margin: '10px 0',
    border: '1px solid black',
    borderCollapse: 'collapse',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    width: '100%',
  },
  tableCell: {
    border: '1px solid black',
    padding: 5,
    textAlign: 'center',
    flex: 1,
  },
  nameCell: {
    border: '1px solid black',
    padding: 5,
    flex: 10, // Increased flex value to allow more space for names
    fontSize: 11,
    textAlign:'left'
  },
});

const ReportPdf = ({ attendanceRecords, selectedMonth, selectedYear, daysInMonth }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>PAKISTAN INTERNATIONL PUBLIC SCHOOL</Text>
          <Text style={styles.title}>Staff Attendance Report for {selectedMonth} - {selectedYear}</Text>
        </View>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Ser</Text>
            <Text style={styles.nameCell}>Name</Text>
            {Array.from({ length: daysInMonth }, (_, index) => (
              <Text style={styles.tableCell} key={index + 1}>{index + 1}</Text>
            ))}
          </View>
          {/* Data Rows */}
          {attendanceRecords.map((record, index) => (
            <View style={styles.tableRow} key={record.att_adm_no}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.nameCell}>{record.name}</Text>
              {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                const attendance = Array.isArray(record.attendance) ? record.attendance[dayIndex] : null;
                return (
                  <Text style={styles.tableCell} key={dayIndex}>
                    {attendance === 'P' ? 'P' : attendance === 'A' ? 'A' : ''}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ReportPdf;