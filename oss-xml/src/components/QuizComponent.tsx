import { Question } from "../model/question";
import { Quiz } from "../model/quiz";
import QuestionComponent from "./QuestionComponent";

export default function QuizComponent(quiz: Quiz) {

    const quizElement = quiz.questions.map((question: Question) => {
        return <QuestionComponent key={question.name + quiz.questions.indexOf(question)} {...question}></QuestionComponent>;
    });
    return (
        <div>
            {quizElement}
        </div>
    );
}