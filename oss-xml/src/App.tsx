import './App.css'
import { FormattedText, Question } from './model/question';
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
                        let question : Question | null = null;
                        const nameElement: Element = questionElement.getElementsByTagName('name')[0];
                        let nameFormatted : FormattedText = { format: '', text: '' };
                        if (nameElement) {
                            const textElement: Element = nameElement.getElementsByTagName('text')[0];
                            if (textElement) {
                                const name = textElement.textContent;
                                if (!name) {
                                    continue;
                                }
                                const format : string | null = nameElement.getAttribute('format');
                                nameFormatted = { format: format || '', text: name || '' };
                            }
                        }
                        question = { name: nameFormatted };
                        quiz.questions.push(question);
                    }
                }
                setQuiz(quiz);
            }
        };
    }

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
