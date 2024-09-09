"use client"
import { useEffect, useState } from 'react';
import { loadFont } from '../components/SelectFont';
import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { defaultTemplate } from '../components/DesignWidget';
import { EnglishRobinsonProps } from '../types/english-robinson';
import { robinsonData } from './mock/data';
import { EnglishRobinson } from './components/EnglishRobinson';

const defaultStyle: EnglishRobinsonProps = {
    ...robinsonData,
    style: {
        background: 'http://localhost:3300/images/english/robinson-bg.jpg',
        phrase_en_color: '',
        phrase_vn_color: '',
        pronunciation_color: '',
        tense_en_color: '',
        tense_vn_color: '',
        fonts: []
    }
}

export default function () {
    const params = useSearchParams();
    const [enProps, setEnProps] = useDebouncedState<EnglishRobinsonProps>(null as any, 0);

    useEffect(() => {
        if (enProps) {
            localStorage.setItem('en_robinson_props', JSON.stringify(enProps));
            enProps?.style?.fonts?.forEach(font => loadFont(`https://fonts.googleapis.com/css?family=${font}`));
        }
    }, [enProps]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const propsData = localStorage.getItem('en_robinson_props');
            const isView = JSON.parse(params.get('view') || 'false');
            if (propsData) {
                setEnProps({
                    ...JSON.parse(propsData)
                });
            } else {
                setEnProps({
                    ...defaultStyle
                });
            }
        }
    }, [])

    return <>
        {!!enProps && <div className='tw-w-screen tw-h-screen'>
            <EnglishRobinson {...enProps} scale={params.get('scale') || '1'} part={parseInt(params.get('part') || '1')} />
        </div>}
    </>
}