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
        lineHeight: 1.5, // Increased line height for better spacing
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
        top: '30%', 
        left: '30%', 
        width: '50%', 
        opacity: 0.1, 
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
        marginTop: 20,
    },
    tableCellHeadingUrdu: {
        padding: 3,
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Jameel Noori Nastaleeq', 
        fontWeight: 'bold',
    },
    tableCellUrdu: {
        padding: 3,
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Jameel Noori Nastaleeq', 
        fontWeight: 'bold',
    },
    tableCellHeading: {
        padding: 3,
        flex: 1,
        textAlign: 'left',
    },
    tableCell: {
        padding: 3,
        flex: 1,
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize:'12px',
        textDecoration:'underline',
    },
    urduText: {
        fontFamily: 'Jameel Noori Nastaleeq', 
        fontSize: 16,
        textAlign: 'right', 
        textDecoration:'underline',
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
        // border: '1px solid black',
        padding: 3,
        flex: 3, 
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize:'14px',
        textDecoration:'underline',
    },
    line: {
        borderBottom: '1px solid black',
        marginVertical: 5, // Space around the line
    },
});

const StudentPdf = ({ student }) => { 
    return ( 
        <Document style={styles.table}> 
            <Page size="A4" style={styles.page}> 
                <Image src={logo} style={styles.watermark} />

                <View style={styles.headerContainer}> 
                    <Image style={styles.logo} src={logo} /> 
                    <Text style={styles.header}>Rahbar Public School</Text> 
                </View>
                <Text style={styles.title}>Admission Form</Text>
                
                <View>
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
                        <Text style={[styles.tableCell]}>{student.mother_cnic}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Father Profession</Text>
                        <Text style={styles.tableCell}>{student.father_profession}</Text>
                        <Text style={[styles.tableCellHeading]}>Religion</Text>
                        <Text style={[styles.tableCell]}>{student.religion}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Caste</Text>
                        <Text style={styles.tableCell}>{student.caste}</Text>
                        <Text style={[styles.tableCellHeading]}>Admission Class</Text>
                        <Text style={[styles.tableCell]}>{student.adm_standard}</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeading}>Previous School</Text>
                        <Text style={[styles.tableCell, styles.tableCellSpan]}>{student.previous_school}</Text>
                    </View>
                    <View style={StyleSheet.line}/>
                    <Text style={{textAlign:'left'}}>Note: Copies of Form 'B', CNIC of Father and School Leaving Certificate in case of student is being transfer 
                        from other school be attached with admission form.
                    </Text>
                </View>
                
                <View style={styles.footer}>
                    <View style={styles.signature}>
                        <Text>Signature of Parents / Guardian:____________________  Dated: ____________</Text>

                <View style={styles.line} /> {/* Horizontal line */}
                        <Text>Address: Garhi Habibullah, Tehsil Balakot, District Mansehra</Text>
                        <Text>Contact: +92 3151436832 || Website: https://www.rahbarschool.com</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default StudentPdf;
