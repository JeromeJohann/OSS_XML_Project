
export interface Question {
    name: string;
    type?: string;
    questiontext?: QuestionText;
    generalfeedback?: string;
    defaultgrade?: number;
    penalty?: number;
    hidden?: number;
    idnumber?: string;
    single?: boolean;
    shuffleanswers?: boolean;
    answernumbering?: string;
    showstandardinstruction?: number;
    correctfeedback?: string;
    partiallycorrectfeedback?: string;
    incorrectfeedback?: string;
    shownumcorrect?: string;
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
