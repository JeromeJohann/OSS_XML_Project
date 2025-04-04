
export interface Question {
    type?: string;
    category?: string;
    info?: FormattedText;
    name: FormattedText;
    idNumber?: string;
    questionText?: FormattedText;
    defaultGrade?: number;
    penalty?: number;
    hidden?: number;
    shuffleAnswers?: boolean;
    correctFeedback?: FormattedText;
    partiallyCorrectFeedback?: FormattedTextWithFile;
    incorrectFeedback?: FormattedText;
    showNumCorrect?: string;
    subQuestions?: SubQuestion[];
    tags?: string[];
    generalFeedback?: FormattedText;
    single?: boolean;
    answerNumbering?: string;
    showStandardInstruction?: number;
    answer?: Answer[];
    unitgradingtype?: number;
    unitpenalty?: number;
    showunits?: number;
    unitsleft?: number;
    usecase?: number;
}

export interface FormattedText {
    format: string;
    text: string;
}

export interface Answer extends FormattedText {
    fraction: number;
    feedback?: FormattedText;
    tolerance?: number;
}

export interface MoodleFile {
    name: string;
    path: string;
    encoding: string;
    file: File
}

export interface FormattedTextWithFile extends FormattedText {
    file?: MoodleFile;
}

export interface SubQuestion extends FormattedText {
    answer: string;
}