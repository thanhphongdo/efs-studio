import { useEffect, useState } from "react";
import { StyleProps } from "../types/style";
import Logo from "./Logo";
import { applyTemplate, defaultTemplate } from "./DesignWidget";

export function Style4(props: StyleProps) {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        console.log(props)
    }, [props])

    useEffect(() => {
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

    return <div className="tw-relative tw-w-[1920px] tw-h-[1080px] tw-bg-gradient-to-tl tw-from-blue-500 tw-to-blue-900 tw-flex tw-flex-col tw-gap-8 tw-justify-center tw-items-center" style={{
        transform: `scale(${props.scale})`
    }}>
        <div className="tw-w-full tw-h-full tw-relative"
            style={{
                backgroundImage: `url("${avatar}")`,
                backgroundSize: `auto ${props.avatar.bgScale}%`,
                backgroundPosition: `calc(50% - ${props.avatar.position.x ?? 200}px) calc(50% - ${props.avatar.position.y ?? 100}px)`,
            }}>
            <div className="tw-relative tw-top-[100%]">
                <div className="tw-absolute tw-right-0 tw-bottom-8 tw-w-full tw-flex tw-flex-col tw-justify-end tw-items-center tw-gap-2">
                    <img className="tw-h-20" src="/images/tl.png" />
                    <div className="tw-text-[2.5rem] like-share-sub">Vui lòng nhấn Like, Share, Subscribe để ủng hộ kênh nhé 😊</div>
                </div>
            </div>
        </div>
        <div className="tw-absolute tw-top-0 tw-left-0 vintage-filter-140"></div>
        <div className="tw-absolute tw-bottom-0 tw-flex tw-justify-between tw-w-full tw-gap-8 tw-px-8">
            <div className="tw-text-8xl tw-font-bold !tw-p-8 tw-flex tw-items-end" style={{
                fontFamily: props.chap.family,
                color: props.chap.color,
                textShadow: props.chap.shadow.enable ? `0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px ${props.chap.shadow.value}, 0 0 10px ${props.chap.shadow.value}, 0 0 10px ${props.chap.shadow.value}, 0 0 10px ${props.chap.shadow.value}, 0 0 10px ${props.chap.shadow.value}` : '',
                fontSize: `${props.chap.size}px`,
                paddingBottom: `${props.chap?.margin?.top ?? 0}px`,
                marginLeft: `${props.chap?.margin?.left ?? 0}px`
            }}>{eopside()}</div>
            <div>
                <Logo />
            </div>
        </div>
        <div className="tw-w-full tw-absolute tw-top-2 tw-flex tw-justify-center tw-pb-8">
            <div className="tw-font-bold">
                <div className="tw-p-4" style={{
                    color: props.genre?.color,
                    textShadow: props.genre?.shadow.enable ? `0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px ${props.genre?.shadow.value}, 0 0 10px ${props.genre?.shadow.value}, 0 0 10px ${props.genre?.shadow.value}, 0 0 10px ${props.genre?.shadow.value}, 0 0 10px ${props.genre?.shadow.value}` : '',
                    fontSize: `${props.genre?.size}px`,
                    fontFamily: props.genre?.family,
                    marginTop: `${props.genre?.margin?.top ?? 0}px`,
                    marginLeft: `${props.genre?.margin?.left ?? 0}px`
                }}>
                    {props?.genre?.value}
                </div>
            </div>
        </div>
        <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-absolute">
            <div className="font-56 tw-font-bold" style={{
                color: props.title.color,
                textShadow: props.title.shadow.enable ? `0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 40px ${props.title.shadow.value}, 0 0 10px ${props.title.shadow.value}, 0 0 10px ${props.title.shadow.value}, 0 0 10px ${props.title.shadow.value}, 0 0 10px ${props.title.shadow.value}` : '',
                fontSize: `${props.title.size}px`,
                lineHeight: `${props.title.size * 1.1}px`,
                marginTop: `${props.title?.margin?.top ?? 0}px`,
                marginLeft: `${props.title?.margin?.left ?? 0}px`
            }}>
                <div dangerouslySetInnerHTML={{ __html: applyTemplate(props.title.template || defaultTemplate, props?.title?.value || '') }}></div>
            </div>
            <div style={{
                color: props.author.color,
                textShadow: props.author.shadow.enable ? `0 0 4px #fff, 0 0 4px #fff, 0 0 4px #fff, 0 0 4px ${props.author.shadow.value}, 0 0 4px ${props.author.shadow.value}, 0 0 4px ${props.author.shadow.value}, 0 0 4px ${props.author.shadow.value}, 0 0 4px ${props.author.shadow.value}` : '',
                fontSize: `${props.author.size}px`,
                fontFamily: props.author.family,
                marginTop: `${props.author?.margin?.top ?? 0}px`,
                marginLeft: `${props.author?.margin?.left ?? 0}px`
            }}>
                <div dangerouslySetInnerHTML={{ __html: (props?.author?.value?.replace('AUTHOR ', 'Tác Giả: ')) || '' }}></div>
            </div>
        </div>
    </div >
}