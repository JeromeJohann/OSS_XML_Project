import { Question } from "../model/question";
import "../xml.css";

export default function QuestionComponent(question: Question) {
    const answers = question.answer?.map((answer, index) => (
        <div key={index}>
            <div>fraction: {answer.fraction}</div>
            <div>format: {answer.format}</div>
            <div>text: {answer.text}</div>
            <div>feedback: {answer.feedback?.text}</div>
            <div>tolerance: {answer.tolerance}</div>
        </div>
    ));

    const subQuestions = question.subQuestions?.map((subQuestion, index) => (
        <div key={index}>
            <div>format: {subQuestion.format}</div>
            <div>text: {subQuestion.text}</div>
            <div>answer: {subQuestion.answer}</div>
        </div>
    ));

    const tags = question.tags?.map((tag, index) => (
        <div key={index}>tag: {tag}</div>
    ));

    return (
        <div className="xml-div">
            <div>question: {question.name.text}</div>
            <div>type: {question.type}</div>
            <div>category: {question.category}</div>
            <div>info: {question.info?.text}</div>
            <div>idnumber: {question.idNumber}</div>
            <div>questiontext: {question.questionText?.text}</div>
            <div>generalfeedback: {question.generalFeedback?.text}</div>
            <div>defaultgrade: {question.defaultGrade}</div>
            <div>penalty: {question.penalty}</div>
            <div>hidden: {question.hidden}</div>
            <div>shuffleanswers: {question.shuffleAnswers ? "true" : "false"}</div>
            <div>correctfeedback: {question.correctFeedback?.text}</div>
            <div>partiallycorrectfeedback: {question.partiallyCorrectFeedback?.text}</div>
            <div>incorrectfeedback: {question.incorrectFeedback?.text}</div>
            <div>shownumcorrect: {question.showNumCorrect}</div>
            <div>single: {question.single ? "true" : "false"}</div>
            <div>answernumbering: {question.answerNumbering}</div>
            <div>showstandardinstruction: {question.showStandardInstruction}</div>
            <div>unitgradingtype: {question.unitgradingtype}</div>
            <div>unitpenalty: {question.unitpenalty}</div>
            <div>showunits: {question.showunits}</div>
            <div>unitsleft: {question.unitsleft}</div>
            <div>usecase: {question.usecase}</div>
            <div>tags:</div>
            <div>{tags}</div>
            <div>answers:</div>
            <div>{answers}</div>
            <div>subquestions:</div>
            <div>{subQuestions}</div>
        </div>
    );
}