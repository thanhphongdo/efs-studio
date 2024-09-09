import { EnglishPhraseProps } from "@/app/types/english-phrase"
import { useEffect } from "react"

export const EnglishPhraseLong = (props: EnglishPhraseProps & { scale: string }) => {
    useEffect(() => {
        console.log(props);
    }, [])
    return <div className="tw-relative tw-w-[1920px] tw-h-[1080px] tw-bg-emerald-300 tw-bg-cover tw-bg-center" style={{
        backgroundImage: `url("${props.style?.background}")`,
        transform: `scale(${props.scale})`
    }}>
        <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-p-20 tw-text-center">
            <div className="tw-text-[6rem] tw-text-pink-600 tw-font-bold">
                <span className="tw-uppercase">{props.phrase_en.slice(0, 1)}</span>
                <span>{props.phrase_en.slice(1)}</span>
            </div>
            <div className="tw-text-[3.5rem] tw-text-pink-400 tw-font-bold tw-italic">/{props.pronunciation}/</div>
            <div className="tw-text-[3.5rem] tw-text-green-500 tw-font-bold">{props.phrase_vn}</div>
            <div className="tw-text-[3.5rem] tw-text-pink-600 tw-font-bold">{props.tense_en}</div>
            <div className="tw-text-[2.5rem] tw-text-pink-400 tw-font-bold tw-italic">/{props.tense_en_pronunciation}/</div>
            <div className="tw-text-[3.5rem] tw-text-green-500 tw-font-bold">{props.tense_vn}</div>
        </div>
        <div className="tw-absolute tw-top-12 tw-left-12 tw-vintage-filter tw-text-[4rem] tw-text-amber-600 tw-font-bold tw-rounded-full tw-bg-amber-300/30 tw-px-8">
            {parseInt(props.phrase_idx).toString().padStart(3, '0')}
        </div>
    </div>
}