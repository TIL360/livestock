import React from 'react'; 
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'; 
import logo from '../Images/logo.png'; 
import fontfile from '../Fonts/Jameel Noori Nastaleeq Kasheeda.ttf';

// Register the font 
Font.register({ family: 'Jameel Noori Nastaleeq', src: fontfile });

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
        fontSize: 14, 
        textAlign: 'center', 
        textDecoration: 'underline', 
        fontWeight: 'bold', 
        marginLeft: 5, 
    }, 
    title: { 
        fontSize: 14, 
        textAlign: 'center', 
        textDecoration: 'underline', 
        marginBottom: 10, 
    }, 
    logo: { 
        width: 50, 
        height: 50, 
    }, 
    table: { 
        width: '100%', 
        border: '1px solid black', 
        marginBottom: 10, 
        borderCollapse: 'collapse', 
    }, 
    tableRow: { 
        flexDirection: 'row', 
    },
    tableCellHeadingUrdu: {
        border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Jameel Noori Nastaleeq', // Set the font for Urdu headings
        fontWeight: 'bold',
    },
    tableCellUrdu: {
        border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Jameel Noori Nastaleeq', // Set the font for Urdu text
        fontWeight: 'bold',
    },
    tableCellHeading: {
        border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'left',
    },
    tableCell: {
        border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    urduText: {
        fontFamily: 'Jameel Noori Nastaleeq', 
        fontSize: 16,
        textAlign: 'right', // Align Urdu text to the right
    },
});

const StudentPdf = ({ student }) => { 
    return ( 
        <Document> 
            <Page size="A4" style={styles.page}> 
                <View style={styles.headerContainer}> 
                    <Image style={styles.logo} src={logo} /> 
                    <Text style={styles.header}>Rahbar Public School</Text> 
                </View>
                <Text style={styles.title}>Student Report</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Admission No</Text>
                        <Text style={styles.tableCell}>{student.adm_no}</Text>
                        <Text style={styles.tableCellHeading}>Admission Date</Text>
                        <Text style={styles.tableCell}>{student.adm_date}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Name</Text>
                        <Text style={styles.tableCell}>{student.name}</Text>
                        <Text style={[styles.tableCellHeading]}>In Urdu</Text>
                        <Text style={[styles.tableCellUrdu, styles.urduText]}>{student.name_urdu}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Father's Name</Text>
                        <Text style={styles.tableCell}>{student.father}</Text>
                        <Text style={[styles.tableCellHeading]}>In Urdu</Text>
                        <Text style={[styles.tableCellUrdu, styles.urduText]}>{student.fname_urdu}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Date of Birth</Text>
                        <Text style={styles.tableCell}>{student.dob}</Text>
                        <Text style={[styles.tableCellHeading]}>In Urdu</Text>
                        <Text style={[styles.tableCellUrdu, styles.urduText]}>{student.dob_urdu}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default StudentPdf;
