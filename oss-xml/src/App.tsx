import { Button } from '@mui/material'
import './App.css'
import { Question } from './model/question';
import { Quiz } from './model/quiz';
import { useState } from 'react';

function App() {
    const [quiz, setQuiz] = useState<Quiz>({questions: []});
    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const parser: DOMParser = new DOMParser();
            const xmlDoc : Document = parser.parseFromString(await e.target.files[0].text(), "text/html");
            const quizElement = xmlDoc.getElementsByTagName('quiz')[0];
            if (!quizElement) {
                return;
            }
            const quiz: Quiz = {questions: []};
            const questionElements: HTMLCollectionOf<Element> = quizElement.getElementsByTagName('question');
            if (questionElements) {
                for (let i = 0; i < questionElements.length; i++) {
                    const questionElement: Element = questionElements[i];

                    const nameElement: Element = questionElement.getElementsByTagName('name')[0];
                    if (nameElement) {
                        const textElement: Element = nameElement.getElementsByTagName('text')[0];
                        if (textElement) {
                            const name : string | null = textElement.textContent;
                            if (!name) {
                                continue;
                            }
                            const question: Question = {name: name};
                            quiz.questions.push(question);
                        }
                    }
                }
                setQuiz(quiz);
            }
        };
    }


        function handleExport() {
            console.log("not implemented");
        };


        const quizElement = quiz.questions.map((question: Question) => {
            return <div key={question.name}>{question.name}</div>;
        });

        return (
            <>
                <Button variant="contained" onClick={handleExport}>Export</Button>
                <div className="input-group">
                    <label htmlFor="input">Import XML</label>
                    <input id='input' type="file" onChange={handleFileChange} />
                    {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" value={xmlDoc}/> */}
                </div>
                {quizElement}
            </>
        )
    }

    export default App
