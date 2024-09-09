export interface EnglishPhraseProps {
    lessons: string;
    phrase_idx: string;
    phrase_en: string;
    phrase_vn: string;
    pronunciation: string;
    tense_en_pronunciation: string;
    tense_en: string;
    tense_vn: string;
    style: {
        background: string;
        phrase_en_color: string;
        phrase_vn_color: string;
        pronunciation_color: string;
        tense_en_color: string;
        tense_vn_color: string;
        fonts: Array<string>;
    }
}