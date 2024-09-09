"use client"
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleProps } from '../types/style';
import { Button, Input, ScrollArea } from '@mantine/core';
import { IconZoom } from '@tabler/icons-react';
import { loadFont } from '../components/SelectFont';
import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { BackgroundModal } from '../components/BackgroundModal';
import Parse from '@/app/libs/parse-client';
import { ParseClass } from '../consts/parse-class';
import { toast } from 'react-toastify';
import StorySchedule from '../components/StorySchedule';
import DesignWidget from '../components/DesignWidget';
import { StyleShort1 } from '../components/StyleShort1';
import { StyleShort2 } from '../components/StyleShort2';

const defaultStyle: StyleProps = {
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
  title: { value: 'Nữ Phụ Muốn Ly hôn', family: 'Playball', color: '#e64980', size: 100, margin: { top: 0, left: 0 }, shadow: { enable: true, value: '#e64980' } },
  author: { value: 'Ôn Dĩ', family: 'Playball', color: '#40c057', size: 75, margin: { top: 50, left: 0 }, shadow: { enable: true, value: '#40c057' } },
  chap: { from: '1', to: '10', family: 'Playball', color: '#fd7e14', size: 75, margin: { top: 50, left: 0 }, value: '', shadow: { enable: true, value: '#fd7e14' } },
  genre: {
    value: 'Xuyên Không - Ngôn Tình - Quân Sự',
    family: 'Pacifico',
    color: '#fa5252',
    shadow: {
      enable: true,
      value: '#fa5252'
    },
    size: 48,
    margin: { top: 0, left: 0 }
  },
  slogan: {
    value: `Chó độc thân chính cống\nSống lại phải yêu sớm thôi!!!`,
    family: 'Pacifico',
    color: '#fa5252',
    shadow: {
      enable: true,
      value: '#fa5252'
    },
    size: 48,
    margin: { top: 0, left: 0 }
  },
  background: {
    url: 'https://r4.wallpaperflare.com/wallpaper/917/376/41/golden-life-wallpaper-e930a83d811abdabf68728afb0e1966d.jpg',
    position: { x: 0, y: 0 },
    bgScale: 100
  },
  scale: 0.5
}

export default function Home() {
  const params = useSearchParams();
  const [isView, setIsView] = useState(JSON.parse(params.get('view') || 'false'));
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
      }
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
          scale: isView ? 1 : 0.5,
          genre: JSON.parse(styleData)?.genre || defaultStyle.genre
        });
      } else {
        setStyle({
          ...defaultStyle,
          chap: {
            ...defaultStyle.chap,
            from,
            to
          },
          scale: isView ? 1 : 0.5,
          genre: defaultStyle.genre
        });
      }
    }
  }, []);

  const [storyURL, setStoryURL] = useState(style?.general?.url || 'https://truyenfull.vn/');
  const [bgURL, setBgURL] = useState(style?.background?.url || '');
  const [bgModalOpened, setBgModalOpened] = useState(false);

  const getStoryId = () => {
    return new URL(storyURL).pathname.split('/').slice(-2)[0];
  }

  const applyBackground = (bg?: string) => {
    setStyle({
      ...style,
      background: {
        ...style.background,
        url: bg || bgURL
      }
    })
  }

  const zoom = (value: number) => {
    setStyle({
      ...style,
      scale: value
    })
  }

  const zoomStick = () => {
    if (style.scale <= 0.224) {
      setStyle({
        ...style,
        scale: 1
      })
    }
    else if (style.scale <= 0.5) {
      setStyle({
        ...style,
        scale: 0.224
      })
    }
    else if (style.scale == 1) {
      setStyle({
        ...style,
        scale: 0.5
      })
    }
    else {
      setStyle({
        ...style,
        scale: 1
      })
    }
  }

  const getBgById = async (id: string) => {
    return await new Parse.Query(ParseClass.StoryBackground).equalTo('storyId', id).first();
  }

  const changeStyle = useCallback((styleChanged: StyleProps) => {
    setStyle({
      ...style,
      ...styleChanged
    });
  }, [])

  return <>
    {!!style && <div className='tw-flex tw-flex-1 tw-w-screen tw-h-screen'>
      <ScrollArea type='never' className='tw-flex-1'>
        <StyleShort2
          {...style}
          episode='1'
        ></StyleShort2>
      </ScrollArea>
      <div className={`tw-w-[480px] tw-p-2 tw-h-full tw-flex tw-flex-col ${isView ? 'tw-hidden' : ''}`}>
        <div className='tw-grid tw-grid-cols-3 tw-gap-2 tw-p-2'>
          <Button onClick={async () => {
            try {
              const bg = await getBgById(getStoryId());
              if (bg) {
                bg.set('config', JSON.stringify(style));
                await bg.save(null);
              } else {
                const bg = new Parse.Object(ParseClass.StoryBackground);
                bg.set('storyId', getStoryId());
                bg.set('config', JSON.stringify({
                  ...style,
                  author: {
                    ...style.author,
                    value: style.author?.value
                  }
                }));
                switch (storyURL?.split('/')[2]) {
                  case 'truyenfull.vn':
                    bg.set('source', 'TruyenFullVN')
                    break;
                  case 'truyenfull.com':
                    bg.set('source', 'TruyenFullCom')
                    break;
                  case 'sstruyen.vn':
                    bg.set('source', 'SSTruyen')
                    break;
                }
                await bg.save(null);
              }
              toast.success('Save Background Config Success');
            }
            catch (err) {
              toast.error('Save Background Config Failed');
            }
          }}>Save Settings</Button>
          <StorySchedule url={storyURL} name={style.title.value} />
          <Button.Group className='tw-w-full tw-flex'>
            <Button variant="default" onClick={() => zoom(style.scale - 0.1)}>-</Button>
            <Button variant="default" className='tw-flex-1' onClick={() => zoomStick()}>
              <IconZoom size={16} />
            </Button>
            <Button variant="default" onClick={() => zoom(style.scale + 0.1)}>+</Button>
          </Button.Group>
          <div className='tw-flex tw-flex-col tw-gap-4 tw-w-full tw-col-span-5'>
            <div className='tw-flex tw-gap-2 tw-w-full'>
              <div className='tw-flex tw-justify-center tw-items-center tw-gap-2 tw-flex-1 tw-w-full'>
                <div className='tw-flex tw-gap-2 tw-flex-1'>
                  <Input className='tw-flex-1' type='url' placeholder='Input Story URL' value={storyURL} onChange={(e) => setStoryURL(e.target.value)}></Input>
                  <Button onClick={async () => {
                    const bg = await new Parse.Query(ParseClass.StoryBackground).equalTo('storyId', getStoryId()).first();
                    if (bg) {
                      setStyle({
                        ...JSON.parse(bg.get('config'))
                      })
                    }
                  }}>Apply</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollArea className='tw-flex-1 tw-max-h-[calc(100%_-_104px)]' type='never'>
          <DesignWidget {...style} changeStyle={changeStyle}></DesignWidget>
        </ScrollArea>
      </div>
    </div>}
  </>
}