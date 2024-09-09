import { useEffect, useState } from "react";
import { StyleProps } from "../types/style";
import { decode, encode } from 'blurhash';
import Logo from "./Logo";

export function Style2(props: StyleProps) {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        // rotateAndSaveImage(props.avatar.url, props.avatar.rotate || 0).then(url => setAvatar(url));
        setAvatar(props.avatar.url);
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

    return <div className="tw-relative tw-w-[1920px] tw-h-[1080px] tw-bg-gradient-to-tl tw-from-blue-500 tw-to-blue-900 tw-flex tw-flex-col tw-gap-8 tw-justify-center tw-items-center" style={{
        transform: `scale(${props.scale})`,
    }}>
        <div className="slogan tw-text-7xl tw-flex tw-items-center tw-justify-center tw-text-center tw-h-[150px] tw-font-bold">
            Cậu Bé Nhút Nhát Thắp Nhan Cầu Đạo Lại Bước Lên Con Đường Trường Sinh
        </div>
        <div className="tw-relative tw-flex">
            <div className="left-banner tw-relative tw-shadow-2xl" style={{
                backgroundImage: `url("${props.background.url}")`,
                backgroundSize: `auto ${props.background.bgScale}%`,
                backgroundPosition: `calc(50% - ${props.background.position.x ?? 0}px) calc(50% - ${props.background.position.y ?? 0}px)`
            }}>
                {/* <div className="tw-skew-y-12 tw-skew-x-12 tw-p-4 tw-absolute tw-bottom-[-54px] tw-left-[-12px] tw-bg-red-500">
                    <div className="like-share-sub tw-text-8xl tw-font-bold" style={{
                        fontFamily: 'Bungee Shade'
                    }}>001</div>
                </div> */}
                <div className="tw-text-6xl font-5">
                    Nhất Niệm Vĩnh Hằng
                </div>
                <div className="like-share-sub tw-text-8xl tw-font-bold tw-absolute !tw-bottom-[24px] !tw-left-[24px]" style={{
                    fontFamily: 'Bungee Shade'
                }}>001</div>
            </div>
            <div className="right-banner tw-relative" style={{
                backgroundImage: `url("${avatar}")`,
                backgroundSize: `auto ${props.avatar.bgScale}%`,
                backgroundPosition: `calc(50% - ${props.avatar.position.x ?? 200}px) calc(50% - ${props.avatar.position.y ?? 100}px)`,
            }}>
                <Logo className="tw-absolute tw-right-0 tw-bottom-0" />
            </div>
        </div>
        <div className="tw-absolute tw-w-2/3 tw-bottom-40 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
            <img className="tw-h-20" src="/images/tl.png" />
            <div className="tw-text-5xl like-share-sub">Vui lòng nhấn Like, Share, Subscribe để ủng hộ kênh nhé 😊</div>
        </div>
        <div className="tw-w-full tw-absolute tw-bottom-0 tw-flex tw-justify-center tw-pb-8">
            <div className="genre-bg tw-bg-red-500/40 tw-font-bold">
                <div className="tw-text-6xl slogan tw-p-4">
                    Huyền Huyễn - Hài - Tiên Hiệp
                </div>
            </div>
        </div>
    </div >
}