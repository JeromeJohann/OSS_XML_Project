import { useState } from "react";
import { Question } from "../model/question";
import { Quiz } from "../model/quiz";
import QuestionComponent from "./QuestionComponent";
import { Button } from "@mui/material";

export default function QuizComponent(quiz: Quiz) {
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    const questionMap: Map<string, Question> = new Map<string, Question>();

    quiz.questions.map((question: Question) => {
        questionMap.set(question.name.text, question);
    });

    function handleQuestionClick(name: string) {
        setSelectedQuestion(name);
    }
    const overview = quiz.questions.map((question: Question) => {
        return <Button key={question.name.text + quiz.questions.indexOf(question)} onClick={() => handleQuestionClick(question.name.text)}>{question.name.text}</Button>

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