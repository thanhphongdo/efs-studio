import { useEffect, useState } from "react";
import { StyleProps } from "../types/style";
import { decode, encode } from 'blurhash';
import Logo from "./Logo";

export function StyleShort1(props: StyleProps) {
    const [avatar, setAvatar] = useState('');

    const scaleBg = 1.70618;
    const moveBg = -120;

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

    return <div className="tw-relative tw-w-[1080px] tw-h-[1920px] tw-bg-gradient-to-tl tw-from-blue-500 tw-to-blue-900 tw-flex tw-flex-col tw-gap-8 tw-justify-center tw-items-center" style={{
        transform: `scale(${props.scale})`,
        backgroundImage: `url(${props?.background?.url})`,
        backgroundSize: `auto ${props.background.bgScale}%`,
        backgroundPosition: `${props.background.position.x ?? 0}px ${props.background.position.y ?? 0}px`
    }}>
        <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-8 tw-items-center tw-p-28">
            <div className="tw-aspect-[3/4] tw-w-[856px] tw-shadow-2xl tw-relative tw-p-2 box">
                <div className="tw-w-full tw-h-full tw-rounded-[8rem]" style={{
                    backgroundImage: `url(${props?.background?.url})`,
                    backgroundSize: `auto ${(props.background.bgScale || 100) * scaleBg}%`,
                    backgroundPosition: `${(props.background.position.x ?? 0) + moveBg}px ${(props.background.position.y ?? 0) + moveBg}px`
                }}></div>
                <div className="tw-w-full tw-h-full tw-rounded-[8rem] tw-shadow-2xl tw-absolute tw-top-[2%] tw-left-[2%] tw-scale-[0.92] tw-skew-y-2 tw-border-4"
                    style={{
                        backgroundImage: `url(${props?.avatar?.url})`,
                        backgroundSize: `auto ${props.avatar.bgScale}%`,
                        backgroundPosition: `calc(50% - ${props.avatar.position.x ?? 0}px) calc(50% - ${props.avatar.position.y ?? 0}px)`,
                    }}>
                </div>
                <div className="tw-w-full tw-h-full tw-rounded-[8rem] tw-shadow-2xl tw-absolute tw-top-[1%] -tw-left-[1%] tw-scale-[0.92] -tw-skew-y-3 tw-border-4"
                    style={{
                        backgroundImage: `url(${props?.avatar?.url})`,
                        backgroundSize: `auto ${props.avatar.bgScale}%`,
                        backgroundPosition: `calc(50% - ${props.avatar.position.x ?? 0}px) calc(50% - ${props.avatar.position.y ?? 0}px)`,
                    }}>
                </div>
                <div className="tw-w-full tw-h-full tw-rounded-[8rem] tw-shadow-2xl tw-absolute tw-top-[0%] tw-left-[0%] tw-scale-[0.92] -tw-skew-y-1 tw-border-4"
                    style={{
                        backgroundImage: `url(${props?.avatar?.url})`,
                        backgroundSize: `auto ${props.avatar.bgScale}%`,
                        backgroundPosition: `calc(50% - ${props.avatar.position.x ?? 0}px) calc(50% - ${props.avatar.position.y ?? 0}px)`,
                    }}>
                </div>
            </div>
        </div>
        {/* <div className="tw-absolute tw-top-0 tw-left-0 vintage-filter-120"></div> */}
    </div >
}