
export interface Question {
    name: string;
    type?: string;
    questionText?: QuestionText;
    generalFeedback?: string;
    defaultGrade?: number;
    penalty?: number;
    hidden?: number;
    idNumber?: string;
    single?: boolean;
    shuffleAnswers?: boolean;
    answerNumbering?: string;
    showStandardInstruction?: number;
    correctFeedback?: string;
    partiallyCorrectFeedback?: string;
    incorrectFeedback?: string;
    showNumCorrect?: string;
    answer?: Answer[];
    category?: string;
    info?: Info;
}

interface QuestionText {
    format: string;
    text: string;
}

interface Answer {
    fraction: number;
    format: string;
    text: string;
    feedback?: string;
}

interface Info {
    format: string;
    text: string;
}
