"use client"
import { useEffect, useState } from 'react';
import { loadFont } from '../components/SelectFont';
import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { defaultTemplate } from '../components/DesignWidget';
import { EnglishPhraseProps } from '../types/english-phrase';
import { EnglishPhraseLong } from './components/EnglishPhraseLong';

const defaultStyle: EnglishPhraseProps = {
    lessons: '200_phrase_common',
    phrase_idx: '00001',
    phrase_en: 'grow apart',
    phrase_vn: 'trở nên xa cách, cách xa',
    pronunciation: 'ɡroʊ əˈpɑːrt',
    tense_en_pronunciation: 'ðeɪ juːzd tuː biː kloʊs frɛndz bət ˈoʊvər taɪm ðeɪ ɡroʊ əˈpɑːrt',
    tense_en: 'They used to be close friends, but over time they grew apart.',
    tense_vn: 'Họ từng là bạn thân, nhưng dần dần họ trở nên xa cách.',
    style: {
        background: 'http://localhost:3300/images/english/pharse-001.jpg',
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
    const [enPharseProps, setEnPhraseProps] = useDebouncedState<EnglishPhraseProps>(null as any, 0);

    useEffect(() => {
        if (enPharseProps) {
            localStorage.setItem('en_phrase_props', JSON.stringify(enPharseProps));
            enPharseProps?.style?.fonts?.forEach(font => loadFont(`https://fonts.googleapis.com/css?family=${font}`));
        }
    }, [enPharseProps]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const propsData = localStorage.getItem('en_phrase_props');
            const isView = JSON.parse(params.get('view') || 'false');
            if (propsData) {
                setEnPhraseProps({
                    ...JSON.parse(propsData)
                });
            } else {
                setEnPhraseProps({
                    ...defaultStyle
                });
            }
        }
    }, [])

    return <>
        {!!enPharseProps && <div className='tw-w-screen tw-h-screen'>
            <EnglishPhraseLong {...enPharseProps} scale={params.get('scale') || '1'} />
        </div>}
    </>
}