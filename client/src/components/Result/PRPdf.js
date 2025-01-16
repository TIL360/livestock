import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20, // Reduced padding for better fit
        fontSize: 10, // Global font size adjustment
        lineHeight: 1.2,
    },
    header: {
        fontSize: 14,
        textAlign: 'center',
        textDecoration: 'underline',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        textDecoration: 'underline',
        marginBottom: 10,
    },
    table: {
        width: '100%',
        border: '1px solid black',
        marginBottom: 10,
        borderCollapse: 'collapse', // Ensures no double borders
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid black', // Adds a border to separate rows
    },
    tableCell: {
        border: '1px solid black',
        padding: 3, // Reduced padding for better fit
        flex: 1,
        textAlign: 'center', // Center content in the cells
    },
    marksTable: {
        marginTop: 10,
    },
    section: {
        marginBottom: 5,
    },
    remarks: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 9, // Smaller font for remarks
    },
    signatureSection: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signature: {
        width: '30%',
        textAlign: 'center',
        fontSize: 10,
    },
});

const PRPdf = ({ invoice }) => {
    const calculatePercentage = (obtainedMarks, totalMarks) => {
        return totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    };

    const getGrade = (percentage) => {
        if (percentage >= 85) return 'A+';
        if (percentage >= 75) return 'A';
        if (percentage >= 65) return 'B+';
        if (percentage >= 55) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'E';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>Islamic Scholar Public School</Text>
                    <Text style={styles.subHeader}>Registration No: 373420509</Text>
                    <Text style={styles.subHeader}>Post Office 26 Area C.B 203, Near Gudwal Stop, Wah Cantt</Text>
                    <Text style={styles.subHeader}>Contact: 0336-5777728, 0345-5611940</Text>
                    <Text style={styles.title}>Progress Report</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Result ID</Text>
                            <Text style={styles.tableCell}>{invoice.resultid}</Text>
                            <Text style={styles.tableCell}>Admission No</Text>
                            <Text style={styles.tableCell}>{invoice.result_adm_no}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Name</Text>
                            <Text style={styles.tableCell}>{invoice.name}</Text>
                            <Text style={styles.tableCell}>Father Name</Text>
                            <Text style={styles.tableCell}>{invoice.father}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Standard</Text>
                            <Text style={styles.tableCell}>{invoice.result_standard}</Text>
                            <Text style={styles.tableCell}>Exam</Text>
                            <Text style={styles.tableCell}>{invoice.month} - {invoice.year}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.marksTable}>
                    <Text style={styles.title}>Marks Detail</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Subjects</Text>
                            <Text style={styles.tableCell}>Total Marks</Text>
                            <Text style={styles.tableCell}>Obt Marks</Text>
                            <Text style={styles.tableCell}>Percentage</Text>
                            <Text style={styles.tableCell}>Grade</Text>
                        </View>
                        {['English', 'Urdu', 'Maths', 'Islamiat', 'Pak Study', 'Bio / Comp', 'Physics', 'Chemistry'].map((subject, index) => {
                            const totalMarks = invoice[`TMS${index + 1}`];
                            const obtainedMarks = invoice[`OM${index + 1}`];
                            const percentage = calculatePercentage(obtainedMarks, totalMarks);
                            return (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{subject}</Text>
                                    <Text style={styles.tableCell}>{totalMarks}</Text>
                                    <Text style={styles.tableCell}>{obtainedMarks}</Text>
                                    <Text style={styles.tableCell}>{percentage.toFixed(2)}%</Text>
                                    <Text style={styles.tableCell}>{getGrade(percentage)}</Text>
                                </View>
                            );
                        })}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Total</Text>
                            <Text style={styles.tableCell}>{invoice.Total_set_marks}</Text>
                            <Text style={styles.tableCell}>{invoice.Total_obt_marks}</Text>
                            <Text style={styles.tableCell}>{calculatePercentage(invoice.Total_obt_marks, invoice.Total_set_marks).toFixed(2)}%</Text>
                            <Text style={styles.tableCell}>{getGrade(calculatePercentage(invoice.Total_obt_marks, invoice.Total_set_marks))}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.remarks}>
                    <Text>Total No. of days attended __________ out of __________.</Text>
                    <Text>Conduct & Discipline ______________________________________</Text>
                    
                    <Text>Class Teacher's Remarks: ____________________________________________________________</Text>
                    <Text>_________________________________________________________________________________________________________</Text>
                    <Text>Principal's Remarks: ___________________________</Text>
                </View>

                <View style={styles.signatureSection}>
                    <View style={styles.signature}>
                        <Text>___________</Text>
                        <Text>Result Date</Text>
                    </View>
                    <View style={styles.signature}>
                        <Text>___________________</Text>
                        <Text>Class Teacher's Sig</Text>
                    </View>
                    <View style={styles.signature}>
                        <Text>____________________</Text>
                        <Text>Principal's Signature</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PRPdf;
