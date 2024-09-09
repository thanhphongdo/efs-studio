import { useEffect, useState } from "react";
import { StyleProps } from "../types/style";

export function Style1(props: StyleProps) {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        rotateAndSaveImage(props.avatar.url, props.avatar.rotate || 30).then(url => setAvatar(url));
    }, [props.avatar.url])

    const chapNo = () => {
        const episode = props.isEnd ? 'Tập Cuối' : `Tập ${props.episode}`;
        let chap = `${episode} - Chương ${props.chap.from} - ${props.chap.to}`;
        if (props.chap.from === props.chap.to) {
            chap = `${episode} - Chương ${props.chap.from}`;
        }
        return chap;
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
    return <>
        {!!avatar && <div className='tw-relative tw-w-[1920px] tw-h-[1080px] tw-bg-cover' style={{
            backgroundImage: `url("${props.background.url}")`,
            backgroundSize: `auto ${props.background.bgScale}%`,
            backgroundPosition: `calc(50% - ${props.background.position.x ?? 0}px) calc(50% - ${props.background.position.y ?? 0}px)`,
            transform: `scale(${props.scale})`
        }}>
            <div className='tw-absolute tw-w-1/2 tw-h-full tw-left-0 tw-top-0 tw-bg-transparent tw-flex tw-flex-col tw-justify-center tw-items-center tw-pb-12'>
                <div className='tw-font-merienda tw-font-extrabold tw-text-center'
                    style={{
                        color: props.title.color,
                        textShadow: props.title.shadow.enable ? `0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px ${props.title.shadow.value}, 0 0 70px ${props.title.shadow.value}, 0 0 80px ${props.title.shadow.value}, 0 0 100px ${props.title.shadow.value}, 0 0 150px ${props.title.shadow.value}` : '',
                        fontSize: `${props.title.size}px`,
                        fontFamily: props.title.family,
                        marginTop: `${props.title?.margin?.top ?? 0}px`,
                        marginLeft: `${props.title?.margin?.left ?? 0}px`
                    }}>
                    {props.title.value.split('\n').map((value, index) => (
                        <div>{value}</div>
                    ))}
                </div>
                <div className='tw-font-merienda tw-font-extrabold'
                    style={{
                        color: props.chap.color,
                        textShadow: props.chap.shadow.enable ? `0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px ${props.chap.shadow.value}, 0 0 70px ${props.chap.shadow.value}, 0 0 80px ${props.chap.shadow.value}, 0 0 100px ${props.chap.shadow.value}, 0 0 150px ${props.chap.shadow.value}` : '',
                        fontSize: `${props.chap.size}px`,
                        fontFamily: props.chap.family,
                        marginTop: `${props.chap?.margin?.top ?? 0}px`,
                        marginLeft: `${props.chap?.margin?.left ?? 0}px`
                    }}>
                    {chapNo()}
                </div>
                <div className='tw-text-blue-900 tw-font-merienda tw-font-extrabold tw-text-[50px]'
                    style={{
                        color: props.author.color,
                        textShadow: props.author.shadow.enable ? `0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px ${props.author.shadow.value}, 0 0 70px ${props.author.shadow.value}, 0 0 80px ${props.author.shadow.value}, 0 0 100px ${props.author.shadow.value}, 0 0 150px ${props.author.shadow.value}` : '',
                        fontSize: `${props.author.size}px`,
                        fontFamily: props.author.family,
                        marginTop: `${props.author?.margin?.top ?? 0}px`,
                        marginLeft: `${props.author?.margin?.left ?? 0}px`
                    }}>
                    Tác Giả: {props.author.value}
                </div>
            </div>
            <div className='tw-absolute tw-w-[1080px] tw-h-[1080px] tw-bg-no-repeat tw-rounded-[160px]' style={{
                backgroundImage: `url("${avatar}")`,
                backgroundSize: `auto ${props.avatar.bgScale}%`,
                backgroundPosition: `calc(50% - ${props.avatar.position.x ?? 200}px) calc(50% - ${props.avatar.position.y ?? 100}px)`,
                transform: `rotate(-${props.avatar.rotate || 30}deg) scale(${(props.avatar.frameScale ?? 1.20) / 100})`,
                top: '-80px',
                right: '-320px',
            }}></div>
            <div className='tw-w-full tw-h-full tw-absolute tw-top-[-1000px] tw-left-[-1000px] tw-bg-transparent tw-border-[1000px] tw-border-black tw-box-content'></div>
            {!!props?.genre?.value && <div className="tw-absolute tw-w-1/2 tw-top-12 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
                <div className="tw-text-5xl tw-text-center" style={{
                    color: props.genre?.color,
                    textShadow: props.genre?.shadow.enable ? `0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px ${props.genre?.shadow.value}, 0 0 70px ${props.genre?.shadow.value}, 0 0 80px ${props.genre?.shadow.value}, 0 0 100px ${props.genre?.shadow.value}, 0 0 150px ${props.genre?.shadow.value}` : '',
                    fontSize: `${props.genre?.size}px`,
                    fontFamily: props.genre?.family,
                    marginTop: `${props.genre?.margin?.top ?? 0}px`,
                    marginLeft: `${props.genre?.margin?.left ?? 0}px`
                }}>{props.genre.value}</div>
            </div>}
            <div className="tw-absolute tw-w-1/2 tw-bottom-12 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
                <img className="tw-h-20" src="/images/tl.png" />
                <div className="tw-text-4xl like-share-sub">Vui lòng nhấn Like, Share, Subscribe để ủng hộ kênh nhé 😊</div>
            </div>
            <div className="tw-absolute tw-flex tw-flex-col tw-justify-center tw-items-center tw-bottom-0 tw-right-[calc(50%_-300px)] tw-p-8">
                <div className="tw-relative tw-w-24 tw-h-24">
                    <img className="tw-w-full tw-absolute tw-rounded-full tw-rotate-[20deg]" src="/images/logo-1.png" />
                    <img className="tw-w-[60%] tw-absolute tw-rounded-full tw-top-9 tw-right-0" src="/images/logo-2.png" />
                </div>
                <div className="tw-text-[#1fb7ed] tw-rounded-md tw-text-[1.5rem] tw-font-[LogoFont] tw-font-semibold">© Mê Truyện Full</div>
            </div>
        </div>}
    </>
}