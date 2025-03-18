import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../Images/logo.png'; // Adjust the path to your logo image

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
        fontSize: 10,
        lineHeight: 1.2,
        position: 'relative', // Allow absolute positioning for watermark
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
    logo: {
        width: 40, // Adjust logo size
        height: 40,
        marginBottom: 5,
    },
    watermark: {
        position: 'absolute',
        top: '30%',
        left: '30%',
        opacity: 0.1, // Lighten the watermark
        width: '40%',  // Adjust width for watermark
        height: '40%', // Adjust height for watermark
    },
    table: {
        margin: '10px 0',
        border: '1px solid black',
        borderCollapse: 'collapse',
        width: '100%',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        border: '1px solid black',
        padding: 5,
        textAlign: 'center',
        flex: 1,
    },
});

const DateSheetPdf = ({ dateSheetData, standardOptions, selectedExam, selectedYear }) => {
    const groupedData = dateSheetData.reduce((acc, item) => {
        const dateKey = item.date;
        const standardKey = item.standard;

        if (!acc[dateKey]) {
            acc[dateKey] = {};
        }
        if (!acc[dateKey][standardKey]) {
            acc[dateKey][standardKey] = [];
        }
        acc[dateKey][standardKey].push(item.subject);
        return acc;
    }, {});

    return (
        <Document>
            <Page size="A4" orientation='landscape' style={styles.page}>
                {/* Watermark logo */}
                <Image style={styles.watermark} src={logo} />

                <View style={styles.headerContainer}>
                    <Image style={styles.logo} src={logo} />
                    <Text style={styles.header}>Pakistan International School, Murree (PIPS)</Text>
                    <Text style={styles.title}>Contact: +92 370 5057482, +92 315 6206302 || Website: https://www.rahbarschool.com</Text>
                    
                    <Text style={styles.title}>Date Sheet for {selectedExam} - {selectedYear}</Text>
                </View>
                
                <View style={styles.table}>
                    {/* Header Row */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Date</Text>
                        {standardOptions.map((standard, index) => (
                            <Text style={styles.tableCell} key={index}>{standard}</Text>
                        ))}
                    </View>
                    {/* Data Rows */}
                    {Object.keys(groupedData).map((date, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{new Date(date).toLocaleDateString('en-GB')}</Text>
                            {standardOptions.map((standard, idx) => (
                                <Text style={styles.tableCell} key={idx}>
                                    {groupedData[date][standard] ? groupedData[date][standard].join(', ') : '-'}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default DateSheetPdf;
