import './App.css'
import { Answer, FormattedText, Question, SubQuestion } from './model/question';
import { Quiz } from './model/quiz';
import { useState } from 'react';
import QuizComponent, { QuizComponentProps } from './components/QuizComponent';
import Navbar, { NavbarProps } from './components/Navbar';

function App() {
    const [quiz, setQuiz] = useState<Quiz>({ questions: [] });
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
    const handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const parser: DOMParser = new DOMParser();
            let xmlContent: string = await e.target.files[0].text();
            xmlContent = xmlContent.substring(xmlContent.indexOf('<quiz>'));
            const xmlDoc: Document = parser.parseFromString(xmlContent, "text/xml");
            const quizElement = xmlDoc.getElementsByTagName('quiz')[0];
            if (!quizElement) {
                return;
            }
            const currentQuiz: Quiz = JSON.parse(JSON.stringify(quiz));
            const questionElements: HTMLCollectionOf<Element> = quizElement.getElementsByTagName('question');
            if (questionElements) {
                for (let i = 0; i < questionElements.length; i++) {
                    const questionElement: Element = questionElements[i];
                    if (questionElement) {
                        const question: Question = {
                            name: { format: '', text: '' },
                            type: questionElement.getAttribute('type') || '',
                            category: '',
                            info: undefined,
                            idNumber: '',
                            questionText: undefined,
                            defaultGrade: undefined,
                            penalty: undefined,
                            hidden: undefined,
                            shuffleAnswers: undefined,
                            correctFeedback: undefined,
                            partiallyCorrectFeedback: undefined,
                            incorrectFeedback: undefined,
                            showNumCorrect: undefined,
                            subQuestions: [],
                            tags: [],
                            generalFeedback: undefined,
                            single: undefined,
                            answerNumbering: undefined,
                            showStandardInstruction: undefined,
                            answer: [],
                            unitgradingtype: undefined,
                            unitpenalty: undefined,
                            showunits: undefined,
                            unitsleft: undefined,
                            usecase: undefined
                        };

                        // Parse <name>
                        const nameElement = questionElement.getElementsByTagName('name')[0];
                        if (nameElement) {
                            const textElement = nameElement.getElementsByTagName('text')[0];
                            if (textElement) {
                                question.name = {
                                    format: nameElement.getAttribute('format') || '',
                                    text: htmlEscaper(textElement.innerHTML) || ''
                                };
                            }
                        } else {
                            continue; // Skip if <name> is not found
                        }

                        // Parse <questiontext>
                        const questionTextElement = questionElement.getElementsByTagName('questiontext')[0];
                        if (questionTextElement) {
                            const textElement = questionTextElement.getElementsByTagName('text')[0];
                            if (textElement) {
                                question.questionText = {
                                    format: questionTextElement.getAttribute('format') || '',
                                    text: htmlEscaper(textElement.innerHTML) || ''
                                };
                            }
                        }

                        // Parse <generalfeedback>
                        const generalFeedbackElement = questionElement.getElementsByTagName('generalfeedback')[0];
                        if (generalFeedbackElement) {
                            const textElement = generalFeedbackElement.getElementsByTagName('text')[0];
                            if (textElement) {
                                question.generalFeedback = {
                                    format: generalFeedbackElement.getAttribute('format') || '',
                                    text: htmlEscaper(textElement.innerHTML) || ''
                                };
                            }
                        }

                        // Parse <answer>
                        const answerElements = questionElement.getElementsByTagName('answer');
                        for (let j = 0; j < answerElements.length; j++) {
                            const answerElement = answerElements[j];
                            const textElement = answerElement.getElementsByTagName('text')[0];
                            const feedbackElement = answerElement.getElementsByTagName('feedback')[0];
                            const answer: Answer = {
                                format: answerElement.getAttribute('format') || '',
                                text: htmlEscaper(textElement?.innerHTML) || '',
                                fraction: parseFloat(answerElement.getAttribute('fraction') || '0'),
                                feedback: feedbackElement
                                    ? {
                                          format: feedbackElement.getAttribute('format') || '',
                                          text: htmlEscaper(feedbackElement.innerHTML) || ''
                                      }
                                    : undefined
                            };
                            question.answer?.push(answer);
                        }

                        // Parse <subquestion>
                        const subQuestionElements = questionElement.getElementsByTagName('subquestion');
                        for (let k = 0; k < subQuestionElements.length; k++) {
                            const subQuestionElement = subQuestionElements[k];
                            const textElement = subQuestionElement.getElementsByTagName('text')[0];
                            const answerElement = subQuestionElement.getElementsByTagName('answer')[0];
                            const subQuestion: SubQuestion = {
                                format: subQuestionElement.getAttribute('format') || '',
                                text: htmlEscaper(textElement?.innerHTML) || '',
                                answer: htmlEscaper(answerElement?.innerHTML) || ''
                            };
                            question.subQuestions?.push(subQuestion);
                        }

                        // Parse other attributes
                        question.defaultGrade = parseFloat(questionElement.getElementsByTagName('defaultgrade')[0]?.innerHTML || '0');
                        question.penalty = parseFloat(questionElement.getElementsByTagName('penalty')[0]?.innerHTML || '0');
                        question.hidden = parseInt(questionElement.getElementsByTagName('hidden')[0]?.innerHTML || '0');
                        question.shuffleAnswers = questionElement.getElementsByTagName('shuffleanswers')[0]?.innerHTML === 'true';
                        question.correctFeedback = parseFormattedText(questionElement, 'correctfeedback');
                        question.partiallyCorrectFeedback = parseFormattedText(questionElement, 'partiallycorrectfeedback');
                        question.incorrectFeedback = parseFormattedText(questionElement, 'incorrectfeedback');
                        question.showNumCorrect = questionElement.getElementsByTagName('shownumcorrect')[0]?.innerHTML || '';
                        question.single = questionElement.getElementsByTagName('single')[0]?.innerHTML === 'true';
                        question.answerNumbering = questionElement.getElementsByTagName('answernumbering')[0]?.innerHTML || '';
                        question.showStandardInstruction = parseInt(questionElement.getElementsByTagName('showstandardinstruction')[0]?.innerHTML || '0');
                        question.unitgradingtype = parseInt(questionElement.getElementsByTagName('unitgradingtype')[0]?.innerHTML || '0');
                        question.unitpenalty = parseFloat(questionElement.getElementsByTagName('unitpenalty')[0]?.innerHTML || '0');
                        question.showunits = parseInt(questionElement.getElementsByTagName('showunits')[0]?.innerHTML || '0');
                        question.unitsleft = parseInt(questionElement.getElementsByTagName('unitsleft')[0]?.innerHTML || '0');
                        question.usecase = parseInt(questionElement.getElementsByTagName('usecase')[0]?.innerHTML || '0');

                        currentQuiz.questions.push(question);
                    }
                }
                setQuiz(currentQuiz);
            }
        }
    };

    const parseFormattedText = (element: Element, tagName: string): FormattedText | undefined => {
        const tagElement = element.getElementsByTagName(tagName)[0];
        if (tagElement) {
            const textElement = tagElement.getElementsByTagName('text')[0];
            return {
                format: tagElement.getAttribute('format') || '',
                text: htmlEscaper(textElement?.innerHTML) || ''
            };
        }
        return undefined;
    };

    function addOrRemoveSelectedQuestion(question: Question, selected : boolean) {
        setSelectedQuestions((prevSelectedQuestions) => {
            if (!selected) {
                const updatedSelectedQuestions = prevSelectedQuestions.filter((q) => q.name.text !== question.name.text);
                return updatedSelectedQuestions;
            } else {
                const updatedSelectedQuestions = [...prevSelectedQuestions, question];
                return updatedSelectedQuestions;
            }
        });
    }

    function exportHandler() {
        // File content and filename
        const fileName : string = "quiz.xml";

        // Create the XML content

        const xmlContent : string = createQuizXML();
        // Create a Blob object with the file content
        const blob : Blob = new Blob([xmlContent], { type: 'text/plain' });
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
    
        // Programmatically click the link to trigger the download
        link.click();
    
        // Clean up the URL object
        URL.revokeObjectURL(link.href);
    }

    function createQuizXML() {
        let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n';
        selectedQuestions.forEach((question) => {
            xmlString += '<question' + (question.type ? ` type="${question.type}"` : '') + '>\n';
            if (question.type === 'category') {
                xmlString += `<category><text>${question.category}</text></category>\n`;
            }

            xmlString += '    <name' + (question.name.format ? ` format="${question.name.format}"` : '') + `><text>${question.name.text}</text></name>\n`;
            
            if (question.questionText) {
                xmlString += '    <questiontext ' + (question.questionText?.format ? ` format="${question.questionText.format}"` : "") + `><text>${question.questionText?.text}</text></questiontext>\n`;
            }
            if (question.generalFeedback){
                xmlString += '    <generalfeedback ' + (question.generalFeedback?.format ? ` format="${question.generalFeedback.format}"` : "") + `><text>${question.generalFeedback?.text}</text></generalfeedback>\n`;
            }
            if (question.defaultGrade) {
                xmlString += `    <defaultgrade>${question.defaultGrade}</defaultgrade>\n`;
            }
            if (question.penalty) {
                xmlString += `    <penalty>${question.penalty}</penalty>\n`;
            }
            if (question.hidden) {
                xmlString += `    <hidden>${question.hidden}</hidden>\n`;
            }
            if (question.idNumber) {
                xmlString += `    <idnumber>${question.idNumber}</idnumber>\n`;
            }
            if (question.shuffleAnswers) {
                xmlString += `    <shuffleanswers>${question.shuffleAnswers}</shuffleanswers>\n`;
            }
            if (question.correctFeedback) {
                xmlString += '    <correctfeedback' + (question.correctFeedback?.format ? ` format="${question.correctFeedback.format}"` : "") + `><text>${question.correctFeedback?.text}</text></correctfeedback>\n`;
            }
            if (question.partiallyCorrectFeedback) {
                xmlString += '    <partiallycorrectfeedback ' + (question.partiallyCorrectFeedback?.format ? ` format="${question.partiallyCorrectFeedback.format}"` : "") + `><text>${question.partiallyCorrectFeedback?.text}</text></partiallycorrectfeedback>\n`;
            } 
            if (question.incorrectFeedback) {
                xmlString += '    <incorrectfeedback ' + (question.incorrectFeedback?.format ? ` format="${question.incorrectFeedback.format}"` : "") + `><text>${question.incorrectFeedback?.text}</text></incorrectfeedback>\n`;
            }
            if (question.showNumCorrect) {
                xmlString += `    <shownumcorrect>${question.showNumCorrect}</shownumcorrect>\n`;
            }
            if (question.single) {
                xmlString += `    <single>${question.single}</single>\n`;
            }
            if (question.answerNumbering) {
                xmlString += `    <answernumbering>${question.answerNumbering}</answernumbering>\n`;
            }
            if (question.showStandardInstruction) {
                xmlString += `    <showstandardinstruction>${question.showStandardInstruction}</showstandardinstruction>\n`;
            }
            if (question.unitgradingtype) {
                xmlString += `    <unitgradingtype>${question.unitgradingtype}</unitgradingtype>\n`;
            }
            if (question.unitpenalty) {
                xmlString += `    <unitpenalty>${question.unitpenalty}</unitpenalty>\n`;
            }
            if (question.showunits) {
                xmlString += `    <showunits>${question.showunits}</showunits>\n`;
            }
            if (question.unitsleft) {
                xmlString += `    <unitsleft>${question.unitsleft}</unitsleft>\n`;
            }
            if (question.usecase) {
                xmlString += `    <usecase>${question.usecase}</usecase>\n`;
            }
            if (question.tags) {
                question.tags.forEach((tag) => {
                    xmlString += `    <tags><text>${tag}</text></tags>\n`;
                });
            }
            if (question.answer) {
                question.answer.forEach((answer) => {
                    xmlString += '    <answer ' + (answer.format ? ` format="${answer.format}"` : '') + ` fraction="${answer.fraction}">\n`;
                    xmlString += `        <text>${answer.text}</text>\n`;
                    if (answer.feedback) {
                        xmlString += '        <feedback ' + (answer.feedback.format ? ` format="${answer.feedback.format}"` : '') + `><text>${answer.feedback.text}</text></feedback>\n`;
                    }
                    xmlString += '    </answer>\n';
                }
            );
            }
            if (question.subQuestions) {
                question.subQuestions.forEach((subQuestion) => {
                    xmlString += '    <subquestion' + (subQuestion.format ? ` format="${subQuestion.format}"` : '') + '>\n';
                    xmlString += `        <text>${subQuestion.text}</text>\n`;
                    xmlString += `        <answer>${subQuestion.answer}</answer>\n`;
                    xmlString += '    </subquestion>\n';
                });
            }

            xmlString += '</question>\n';
        });
        xmlString += '</quiz>';
        xmlString = xmlEscaper(xmlString);
        return xmlString;
    }

    function xmlEscaper(xmlString: string) {
        xmlString = xmlString.replace('&amp;', '&');
        xmlString = xmlString.replace('&lt;', '<');
        xmlString = xmlString.replace('&gt;', '>');
        xmlString = xmlString.replace('&quot;', '"');
        xmlString = xmlString.replace('&apos;', '\'');
        xmlString = xmlString.replace('&nbsp;', ' ');
        xmlString = xmlString.replace(/&auml;/g, 'ä');
        xmlString = xmlString.replace(/&ouml;/g, 'ö');
        xmlString = xmlString.replace(/&uuml;/g, 'ü');
        xmlString = xmlString.replace(/&Auml;/g, 'Ä');
        xmlString = xmlString.replace(/&Ouml;/g, 'Ö');
        xmlString = xmlString.replace(/&Uuml;/g, 'Ü');
        xmlString = xmlString.replace(/&szlig;/g, 'ß');
        return xmlString;
    }

    function htmlEscaper(htmlString: string) {
        htmlString = htmlString.replace(/&/g, '&amp;');
        htmlString = htmlString.replace(/</g, '&lt;');
        htmlString = htmlString.replace(/>/g, '&gt;');
        htmlString = htmlString.replace(/"/g, '&quot;');
        htmlString = htmlString.replace(/'/g, '&apos;');
        htmlString = htmlString.replace(/ä/g, '&auml;');
        htmlString = htmlString.replace(/ö/g, '&ouml;');
        htmlString = htmlString.replace(/ü/g, '&uuml;');
        htmlString = htmlString.replace(/Ä/g, '&Auml;');
        htmlString = htmlString.replace(/Ö/g, '&Ouml;');
        htmlString = htmlString.replace(/Ü/g, '&Uuml;');
        htmlString = htmlString.replace(/ß/g, '&szlig;');
        return htmlString;
    }

    const navbarProps : NavbarProps = {
        handleFileChange: handleFileChange,
        exportHandler: exportHandler
    };

    const quizProps : QuizComponentProps = {
        quiz: quiz,
        selectHandler: addOrRemoveSelectedQuestion
    };

    return (
        <>
            <Navbar {...navbarProps}></Navbar>
            <QuizComponent {...quizProps}></QuizComponent>
        </>
    )
}

export default App
