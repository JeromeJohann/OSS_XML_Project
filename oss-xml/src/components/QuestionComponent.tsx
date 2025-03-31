import { Question } from "../model/question";

export default function QuestionComponent(question: Question) {
    return (
        <div>
            question: {question.name}
        </div>
    );
}