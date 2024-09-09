"use client"
import { useEffect, useState } from 'react';
import { Style1 } from '../components/Style1';
import { Style3 } from '../components/Style3';
import { Style4 } from '../components/Style4';
import { StyleShort1 } from '../components/StyleShort1';
import { StyleShort2 } from '../components/StyleShort2';
import { StyleProps } from '../types/style';
import { loadFont } from '../components/SelectFont';
import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { defaultTemplate } from '../components/DesignWidget';

const defaultStyle = {
    general: {
        url: '',
        maxChap: 1000,
        isEnd: false
    },
    avatar: {
        url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9beba002-126b-42b6-fd7c-e83d5cd12b00/original=true/298832.jpeg',
        position: { x: 290, y: -150 },
        bgScale: 160,
        frameScale: 120
    },
    title: { value: 'Nữ Phụ Muốn Ly hôn', template: defaultTemplate, family: 'Akronim', color: '#e64980', size: 100, margin: { top: 0, left: 0 }, shadow: { enable: true, value: '#e64980' } },
    author: { value: 'Ôn Dĩ', family: 'Akronim', color: '#40c057', size: 75, margin: { top: 50, left: 0 }, shadow: { enable: true, value: '#40c057' } },
    chap: { from: 1, to: 10, family: 'Akronim', color: '#fd7e14', size: 75, margin: { top: 50, left: 0 }, value: '', shadow: { enable: true, value: '#fd7e14' } },
    background: {
        url: 'https://r4.wallpaperflare.com/wallpaper/917/376/41/golden-life-wallpaper-e930a83d811abdabf68728afb0e1966d.jpg',
        position: { x: 0, y: 0 },
        bgScale: 100
    },
    scale: 0.5
}

export default function () {
    const params = useSearchParams();
    const [style, setStyle] = useDebouncedState<StyleProps>(null as any, 0);
    const [fonts, setFonts] = useState({
        title: '',
        author: '',
        chap: ''
    });

    useEffect(() => {
        if (style) {
            localStorage.setItem('style', JSON.stringify(style));
            loadFont(`https://fonts.googleapis.com/css?family=${style.title.family}`);
            loadFont(`https://fonts.googleapis.com/css?family=${style.author.family}`);
            loadFont(`https://fonts.googleapis.com/css?family=${style.chap.family}`);
            !!style?.genre?.family && loadFont(`https://fonts.googleapis.com/css?family=${style?.genre.family}`);
        }
    }, [style]);

    useEffect(() => {
        !!style && setStyle({
            ...style,
            title: {
                ...style.title,
                family: fonts.title || style.title.family
            },
            author: {
                ...style.author,
                family: fonts.author || style.author.family
            },
            chap: {
                ...style.chap,
                family: fonts.chap || style.chap.family
            },
            scale: 1
        })
    }, [fonts])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const styleData = localStorage.getItem('style');
            const isView = JSON.parse(params.get('view') || 'false');
            const from = params.get('from') ?? '1';
            const to = params.get('to') ?? '10';
            if (styleData) {
                setStyle({
                    ...JSON.parse(styleData),
                    chap: {
                        ...JSON.parse(styleData).chap,
                        from,
                        to
                    },
                    scale: 1
                });
            } else {
                setStyle({
                    ...defaultStyle,
                    chap: {
                        ...defaultStyle.chap,
                        from,
                        to
                    },
                    scale: 1
                });
            }
        }
    }, [])

    return <>
        {!!style && <div className='tw-flex tw-flex-1 tw-w-screen tw-h-screen'>
            {/* <Style3
                {...style}
                isEnd={JSON.parse(params.get('end') || 'false')}
                episode={params.get('episode') || '1'}
            ></Style3> */}
            <StyleShort2
                {...style}
                isEnd={JSON.parse(params.get('end') || 'false')}
                episode={params.get('episode') || '1'}
            ></StyleShort2>
        </div>}
    </>
}