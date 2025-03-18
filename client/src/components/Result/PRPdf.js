import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../Images/logo.png'; // Adjust the path to your logo image

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
        fontSize: 10,
        lineHeight: 1.2,
        position: 'relative',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        textAlign: 'center',
        textDecoration: 'underline',
        fontWeight: 'bold',
        marginLeft: 5,
        marginTop: 5,
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        textDecoration: 'underline',
        marginBottom: 10,
    },
    logo: {
        width: 50, // Adjust logo size as needed
        height: 50,
    },
    watermark: {
        position: 'absolute',
        top: '30%', // Adjust vertical position as needed
        left: '30%', // Adjust horizontal position as needed
        width: '50%', // Adjust size as needed
        opacity: 0.1, // Adjust opacity for watermark effect
        zIndex: -1,
    },
    table: {
        width: '100%',
        border: '1px solid black',
        marginBottom: 10,
        borderCollapse: 'collapse',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid black',
    },
    tableCell: {
        border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'center',
    },  
    tableCellSub: {
        border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'left',
    },
    remarks: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 9,
    },
    signatureSection: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        textAlign: 'center',
    },
    signature: {
        width: '30%',
    },
    headerTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10, // Space between logo and text
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
                <Image src={logo} style={styles.watermark} />

                <View style={styles.headerContainer}>
                    <Image style={styles.logo} src={logo} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.header}>PAKISTAN INTERNATIONAL PUBLIC SCHOOL</Text>
                        <Text style={styles.header}>MURREE</Text>
                    </View>
                </View>

                <Text style={styles.title}>Progress Report ({invoice.month} - {invoice.year})</Text>

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
                        <Text style={styles.tableCell}>Position in Class</Text>
                        <Text style={styles.tableCell}>{invoice.position}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <Text style={styles.title}>Marks Detail</Text>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellSub}>Subjects</Text>
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
                                <Text style={styles.tableCellSub}>{subject}</Text>
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

                <View style={styles.remarks}>
                    <Text style={{ marginBottom: 20 }}>Total No. of days attended __________ out of __________.</Text>
                    <Text style={{ marginBottom: 20, fontWeight: 'bold' }}>Conduct & Discipline: </Text>
                    <Text style={{ marginBottom: 20 }}>_________________________________________________________________________________________________________</Text>
                    <Text style={{ marginBottom: 20, fontWeight: 'bold' }}>Class Teacher's Remarks: </Text>
                    <Text style={{ marginBottom: 20 }}>_________________________________________________________________________________________________________</Text>
                    <Text style={{ marginBottom: 20 }}>_________________________________________________________________________________________________________</Text>
                    <Text style={{ marginBottom: 20 }}>_________________________________________________________________________________________________________</Text>
                    <Text style={{ marginBottom: 20, fontWeight: 'bold' }}>Principal's Remarks: </Text>
                    <Text style={{ marginBottom: 20 }}>_________________________________________________________________________________________________________</Text>
                    <Text style={{ marginBottom: 20 }}>_________________________________________________________________________________________________________</Text>
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
