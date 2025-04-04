import { useState } from "react";
import { Question } from "../model/question";
import { Quiz } from "../model/quiz";
import QuestionComponent from "./QuestionComponent";
import { Button, Checkbox } from "@mui/material";

export default function QuizComponent(props : QuizComponentProps) {
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    const questionMap: Map<string, Question> = new Map<string, Question>();

    props.quiz.questions.map((question: Question) => {
        questionMap.set(question.name.text, question);
    });

    function handleQuestionClick(name: string) {
        setSelectedQuestion(name);
    }

    function handleMarkQuestion(question: Question, event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        props.selectHandler(question, checked);
    }

    const overview = props.quiz.questions.map((question: Question) => {
        return (
            <div>
                <Checkbox key={"checkbox" + question.name.text + props.quiz.questions.indexOf(question)} onChange={(event) => handleMarkQuestion(question, event)}></Checkbox>
                <Button key={question.name.text + props.quiz.questions.indexOf(question)} onClick={() => handleQuestionClick(question.name.text)}>{question.name.text}</Button>
            </div>
        )
        

    });

    if (selectedQuestion === null) {
        return (
            <div>
                {overview}
            </div>
        );
    }

    return (
        <div>
            <div>
                {overview}
            </div>
            <QuestionComponent {...questionMap.get(selectedQuestion)!}></QuestionComponent>
        </div>
    );
}

export type QuizComponentProps = {
    quiz: Quiz;
    selectHandler: (question: Question, selected: boolean) => void;
};