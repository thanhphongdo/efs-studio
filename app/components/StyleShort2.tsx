import { useEffect, useState } from "react";
import { StyleProps } from "../types/style";
import { decode, encode } from 'blurhash';
import Logo from "./Logo";

export function StyleShort2(props: StyleProps) {
    const [avatar, setAvatar] = useState('');

    const scaleBg = 1.70618;
    const moveBg = -120;

    const effects = [
        'effect-move-left',
        'effect-move-right',
        'effect-move-top',
        'effect-move-bottom',
        'effect-zoom-in',
        'effect-zoom-out',
    ]

    const [effect, setEffect] = useState('');

    useEffect(() => {
        let effectIndex = 0;
        (window as any).start = () => {
            setEffect(effects[effectIndex]);
            setInterval(() => {
                effectIndex++;
                if (effectIndex >= effects.length) {
                    effectIndex = 0;
                }
                setEffect(effects[effectIndex]);
            }, 5000)
        }
    }, [])

    useEffect(() => {
        // rotateAndSaveImage(props.avatar.url, props.avatar.rotate || 0).then(url => setAvatar(url));
        setAvatar(props.avatar.url);
    }, [props.avatar.url])

    const chapNo = () => {
        const episode = props.isEnd ? 'Tập Cuối' : `Tập ${props.episode}`;
        let chap = `Chương ${props.chap.from} - ${props.chap.to}`;
        if (props.chap.from === props.chap.to) {
            chap = `Chương ${props.chap.from}`;
        }
        return chap;
    }

    const eopside = () => {
        if (props.isEnd && props?.episode == '1') {
            return '';
        }
        const episode = props.isEnd ? 'Tập Cuối' : `${props.episode?.toString().padStart(3, '0')}`;
        return episode;
    }

    async function rotateAndSaveImage(url: string, degrees: number) {
        return new Promise<string>(async (resolve, reject) => {
            const response = await fetch(url);
            const blob = await response.blob();

            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = async () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const radians = degrees * Math.PI / 180;
                    const sin = Math.abs(Math.sin(radians));
                    const cos = Math.abs(Math.cos(radians));
                    const width = img.width * cos + img.height * sin;
                    const height = img.width * sin + img.height * cos;
                    canvas.width = width;
                    canvas.height = height;

                    const x = width / 2 - img.width / 2;
                    const y = height / 2 - img.height / 2;
                    ctx!.translate(width / 2, height / 2);
                    ctx!.rotate(radians);
                    ctx!.drawImage(img, -img.width / 2, -img.height / 2);
                    const rotatedImageUrl = canvas.toDataURL('image/png');
                    resolve(rotatedImageUrl);
                }
                catch (err) {
                    reject(err);
                }
            };
        })
    }

    return <div className="tw-relative tw-w-[1080px] tw-h-[1920px] tw-flex tw-flex-col tw-gap-8 tw-justify-center tw-items-center">
        <div className={`tw-w-full tw-h-full ${effect}`} style={{
            transform: `scale(${props.scale})`,
            backgroundImage: `url(${props?.background?.url})`,
        }}></div>
    </div >
}