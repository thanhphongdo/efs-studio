export interface EnglishRobinsonProps {
    title: string;
    images: Array<string>;
    texts: string;
    words: Array<string>;
    words_vn: Array<string>;
    level: number;
    chap: number;
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