import { Question } from "../model/question";

export default function QuestionComponent(question: Question) {

    const answers = question.answer?.map((answer) => {
        return (
            <div key={answer.text}>
                <div>
                    fraction: {answer.fraction}
                </div>
                <div>
                    format: {answer.format}
                </div>
                <div>
                    text: {answer.text}
                </div>
                <div>
                    feedback: {answer.feedback}
                </div>
            </div>
        );
    });

    return (
        <div>
            <div>
                question: {question.name}
            </div>
            <div>
                type: {question.type}
            </div>
            <div>
                questiontext: {question.questionText?.text}
            </div>
            <div>
                generalfeedback: {question.generalFeedback}
            </div>
            <div>
                defaultgrade: {question.defaultGrade}
            </div>
            <div>
                penalty: {question.penalty}
            </div>
            <div>
                hidden: {question.hidden}
            </div>
            <div>
                idnumber: {question.idNumber}
            </div>
            <div>
                single: {question.single ? "true" : "false"}
            </div>
            <div>
                shuffleanswers: {question.shuffleAnswers ? "true" : "false"}
            </div>
            <div>
                answernumbering: {question.answerNumbering}
            </div>
            <div>
                showstandardinstruction: {question.showStandardInstruction}
            </div>
            <div>
                correctfeedback: {question.correctFeedback}
            </div>
            <div>
                partiallycorrectfeedback: {question.partiallyCorrectFeedback}
            </div>
            <div>
                incorrectfeedback: {question.incorrectFeedback}
            </div>
            <div>
                shownumcorrect: {question.showNumCorrect}
            </div>
            <div>
                category: {question.category}
            </div>
            <div>
                info: {question.info?.text}
            </div>
            <div>
                answers: {answers}
            </div>
        </div>
    );
}