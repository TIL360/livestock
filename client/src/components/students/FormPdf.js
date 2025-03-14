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
    },
    tableCellHeadingUrdu: {
        // border: '1px solid white',
        padding: 3,
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Jameel Noori Nastaleeq', // Set the font for Urdu headings
        fontWeight: 'bold',
    },
    tableCellUrdu: {
        // border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Jameel Noori Nastaleeq', // Set the font for Urdu text
        fontWeight: 'bold',
    },
    tableCellHeading: {
        // border: '1px solid black',
        padding: 3,
        flex: 1,
        textAlign: 'left',
    },
    tableCell: {
        // border: '1px solid black',
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
    footer: {
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
        width: '100%',
    },
    tableCellSpan: {
        border: '1px solid black',
        padding: 3,
        flex: 3, // Span across three columns
        textAlign: 'center',
        fontWeight: 'bold',
      },
});

const StudentPdf = ({ student }) => { 
    return ( 
        <Document> 
            <Page size="A4" style={styles.page}> 
                <Image src={logo} style={styles.watermark} />

                <View style={styles.headerContainer}> 
                    <Image style={styles.logo} src={logo} /> 
                    <Text style={styles.header}>Rahbar Public School</Text> 
                </View>
                <Text style={styles.title}>Admission Form</Text>
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

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Father / Guardian CNIC</Text>
                        <Text style={styles.tableCell}>{student.father_cnic}</Text>
                        <Text style={[styles.tableCellHeading]}>Mother / Guardian CNIC</Text>
                        <Text style={[styles.tableCellUrdu]}>{student.mother_cnic}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Father Profession</Text>
                        <Text style={styles.tableCell}>{student.father_profession}</Text>
                        <Text style={[styles.tableCellHeading]}>Religion</Text>
                        <Text style={[styles.tableCellUrdu]}>{student.religion}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Caste</Text>
                        <Text style={styles.tableCell}>{student.caste}</Text>
                        <Text style={[styles.tableCellHeading]}>Admission Class</Text>
                        <Text style={[styles.tableCellUrdu]}>{student.adm_standard}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Previous School</Text>
                        <Text style={[styles.tableCell, styles.tableCellSpan]}>{student.previous_school}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.signature}>
                        <Text>Address: Garhi Habibullah, Tehsil Balakot, District Mansehra</Text>
                        <Text>Contact: +92 3151436832 || Website: https://www.rahbarschool.com</Text>
                        
                    </View>
                   
                </View>
            </Page>
        </Document>
    );
};

export default StudentPdf;
