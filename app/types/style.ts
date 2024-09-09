export type TextProps = {
    value: string;
    template?: string;
    color: string;
    shadow: {
        enable: boolean;
        value: string;
    };
    size: number;
    family?: string;
    margin?: {
        top?: number;
        left?: number;
    };
}

export type ImageProps = {
    url: string;
    position: {
        x?: number;
        y?: number;
    };
    bgScale?: number;
    frameScale?: number;
    rotate?: number;
}

export interface StyleProps {
    general: {
        url?: string;
        maxChap: number;
        isEnd: boolean;
    }
    avatar: ImageProps;
    background: ImageProps;
    title: TextProps;
    author: TextProps;
    chap: TextProps & { from: string; to: string };
    genre?: TextProps;
    slogan?: TextProps;
    scale: number;
    isEnd?: boolean;
    episode?: string;
}