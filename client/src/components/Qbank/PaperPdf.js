import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../Images/logo.jpg';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    position: 'relative',
  },
  section: {
    marginBottom: 20,
  },
  question: {
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 11,
    marginBottom: 3,
    textAlign: 'center',
  },
  options: {
    marginLeft: 20,
    marginBottom: 5,
  },
  optionText: {
    marginBottom: 2,
  },
  numbering: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 20,
    marginLeft: 15,
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    width: '50%',
    opacity: 0.1,
    zIndex: -1,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

const PaperPdf = ({ objectiveQuestions, subjectiveQuestions, selectedYear, selectedExam }) => {
  // Grouping objective questions by type
  const groupedObjectiveQuestions = objectiveQuestions.reduce((acc, question) => {
    const { q_type } = question;
    if (!acc[q_type]) {
      acc[q_type] = [];
    }
    acc[q_type].push(question);
    return acc;
  }, {});

  // Calculate total marks
  const totalObjectiveMarks = objectiveQuestions.reduce((sum, question) => sum + question.q_marks, 0);
  const totalSubjectiveMarks = subjectiveQuestions.reduce((sum, question) => sum + question.q_marks, 0);
  
  return (
    <Document>
      <Page style={styles.page}>
        <Image src={logo} style={styles.watermark} />

        <Text style={styles.header}>PIPS, Murree</Text>
        
        <Text style={{fontSize:"10px", textAlign:"center"}}>Contact: +92 315 6206302 || Website: https://www.pipsmurree.info</Text>
        
        <View style={styles.headerRow}>
          <Text style={{textAlign:'left'}}>{` ${selectedExam} - ${selectedYear} `}</Text>
        </View>

        <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', textDecoration: 'underline' }}>
          Objective Part (Marks: {totalObjectiveMarks})
        </Text>
        <Text style={{ fontSize: '11', textDecoration: 'underline', textAlign: 'left', marginBottom: '11' }}>
          Note: All questions in Objective part are compulsory. 
        </Text>
        
        {Object.keys(groupedObjectiveQuestions).map((type, typeIndex) => (
          <View style={styles.section} key={type}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'left' }}>
              {`${typeIndex + 1}. ${type} Questions`}
            </Text>

            {groupedObjectiveQuestions[type].map((question, index) => (
              <View key={question.qid} style={styles.question}>
                <View style={styles.numbering}>
                  <Text style={styles.questionNumber}>{String.fromCharCode(97 + index)}.</Text>
                  <Text>{`${question.question} (${question.q_marks} marks)`}</Text>
                </View>
                <View style={styles.options}>
                  {question.q_type === 'MCQ' && (
                    <>
                      {question.opt1 && (
                        <Text style={styles.optionText}>
                          i. {question.opt1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          ii. {question.opt2}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          iii. {question.opt3}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          iv. {question.opt4}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'left', textDecoration:'underline' }}>
              Subjective Part (Marks: {totalSubjectiveMarks})
            </Text>
          </View>
          {subjectiveQuestions.map((question, index) => (
            <View key={question.qid} style={styles.question}>
              <View style={styles.numbering}>
                <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'left' }}>{objectiveQuestions.length + index + 1}.</Text>
                <Text>{`${question.question} (${question.q_marks} marks)`}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PaperPdf;
