import './App.css'
import { Answer, FormattedText, Question, SubQuestion } from './model/question';
import { Quiz } from './model/quiz';
import { useState } from 'react';
import QuizComponent from './components/QuizComponent';
import Navbar, { NavbarProps } from './components/Navbar';

function App() {
    const [quiz, setQuiz] = useState<Quiz>({ questions: [] });
    const handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const parser: DOMParser = new DOMParser();
            const xmlDoc: Document = parser.parseFromString(await e.target.files[0].text(), "text/html");
            const quizElement = xmlDoc.getElementsByTagName('quiz')[0];
            if (!quizElement) {
                return;
            }
            const quiz: Quiz = { questions: [] };
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
                                    text: textElement.innerHTML || ''
                                };
                            }
                        }

                        // Parse <questiontext>
                        const questionTextElement = questionElement.getElementsByTagName('questiontext')[0];
                        if (questionTextElement) {
                            const textElement = questionTextElement.getElementsByTagName('text')[0];
                            if (textElement) {
                                question.questionText = {
                                    format: questionTextElement.getAttribute('format') || '',
                                    text: textElement.innerHTML || ''
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
                                    text: textElement.innerHTML || ''
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
                                text: textElement?.innerHTML || '',
                                fraction: parseFloat(answerElement.getAttribute('fraction') || '0'),
                                feedback: feedbackElement
                                    ? {
                                          format: feedbackElement.getAttribute('format') || '',
                                          text: feedbackElement.innerHTML || ''
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
                                text: textElement?.innerHTML || '',
                                answer: answerElement?.innerHTML || ''
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

                        quiz.questions.push(question);
                    }
                }
                setQuiz(quiz);
            }
        }
    };

    const parseFormattedText = (element: Element, tagName: string): FormattedText | undefined => {
        const tagElement = element.getElementsByTagName(tagName)[0];
        if (tagElement) {
            const textElement = tagElement.getElementsByTagName('text')[0];
            return {
                format: tagElement.getAttribute('format') || '',
                text: textElement?.innerHTML || ''
            };
        }
        return undefined;
    };

    const navbarProps : NavbarProps = {
        handleFileChange: handleFileChange
    };

    return (
        <>
            <Navbar {...navbarProps}></Navbar>
            <QuizComponent {...quiz}></QuizComponent>
        </>
    )
}

export default App
