'use client';

import { DataTable, type DataTableSortStatus } from 'mantine-datatable';
import { sortBy, words } from 'lodash';
import { memo, useCallback, useEffect, useState } from 'react';
import Parse from '@/app/libs/parse-client';
import { ChapSchedule } from '../types/parse-objects';
import { CreatingVideoStatus, ParseClass, UploadingVideoStatus, GetContentStatus } from '../consts/parse-class';
import { Accordion, Button, Checkbox, Divider, Input, Modal, ScrollArea, Select } from '@mantine/core';
import dayjs from 'dayjs';
import { IconDeviceFloppy, IconEye, IconEyeCheck, IconPlayerPlay } from '@tabler/icons-react';
import { DateInput, TimeInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
import axios from 'axios';
import { Env } from '../consts/env';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { toast } from 'react-toastify';

const vnWords = [
    'á', 'à', 'ả', 'ã', 'ạ',
    'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ',
    'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ',
    'é', 'è', 'ẻ', 'ẽ', 'ẹ',
    'ế', 'ề', 'ể', 'ễ', 'ệ',
    'ó', 'ò', 'ỏ', 'õ', 'ọ',
    'ố', 'ồ', 'ổ', 'ỗ', 'ộ',
    'ớ', 'ờ', 'ở', 'ỡ', 'ợ',
    'ú', 'ù', 'ủ', 'ũ', 'ụ',
    'ứ', 'ừ', 'ử', 'ữ', 'ự',
    'í', 'ì', 'ỉ', 'ĩ', 'ị'
]

const vnSpecialWords = ['nghiêng', 'nguyệch', 'khuyếch']

function checkVNSpelling(word: string) {
    word = word.replace(/[.,?!:“”""]/g, '').toLocaleLowerCase();
    let result = 0;
    for (let i = 0; i < word.length; i++) {
        if (vnWords.includes(word[i])) {
            result += 1
        }
    };
    return result <= 1;
}

function extractTextFromHTML(htmlString: string) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const textContent = tempElement.textContent || tempElement.innerText || '';
    tempElement.remove();
    return textContent;
}

export type ColumnType = Parse.Object.ToJSON<ChapSchedule> & { objectId: string };

export const EditContent = memo(function (props: { chapIndex: number, html: string, onChange: (evt: ContentEditableEvent, chapIndex: number) => void }) {
    return <div>
        <ScrollArea h={480}>
            <ContentEditable
                style={{ padding: '0.5rem 1rem' }}
                html={
                    props.html.split('\n').map((line, lineIndex) => {
                        return line.split(' ').map((word, wordIndex) => {
                            const length = word.replace(/[.,?!:“”""]/g, '').length;
                            if ((length >= 7 || !checkVNSpelling(word)) && !vnSpecialWords.includes(word.toLocaleLowerCase())) {
                                return `<span class='tw-text-red-700'>${word} </span>`
                            } else if (length >= 6) {
                                return `<span class='tw-text-red-300'>${word} </span>`
                            } else {
                                return `<span>${word} </span>`
                            }
                        }).join('')
                    }).join('<br/><br/>')
                }
                disabled={false}
                onChange={(evt) => { props.onChange(evt, props.chapIndex) }}
            />
        </ScrollArea>
    </div>
})

export default function TableSort() {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ColumnType>>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    const [records, setRecords] = useState<Array<ColumnType>>([]);
    const [currentRecord, setCurrentRecord] = useState<{
        record: ColumnType;
        content: Array<{
            chapIndex: number;
            title: string;
            episode: string;
            content: string;
        }>;
    }>();

    const [chapScheduleObj, setChapScheduleObj] = useState<{
        createVideoAt: Date,
        createVideoAtTime: string,
        creatingVideoStatus: CreatingVideoStatus,
        uploadVideoAt: Date,
        uploadVideoAtTime: string,
        uploadingVideoStatus: UploadingVideoStatus
    }>()

    const [relativeChapSchedules, setRelativeChapSchedules] = useState<{
        sameDate: Array<{
            schedule: Parse.Object<ChapSchedule>;
            checked: boolean;
        }>;
        beforeDate: Array<{
            schedule: Parse.Object<ChapSchedule>;
            checked: boolean;
        }>;
        afterDate: Array<{
            schedule: Parse.Object<ChapSchedule>;
            checked: boolean;
        }>;
    }>({
        sameDate: [],
        beforeDate: [],
        afterDate: [],
    });

    const [createVideoAt, setCreateVideoAt] = useState<Date>(new Date());
    const [uploadVideoAt, setUploadVideoAt] = useState<Date>(new Date());
    const [opened, setOpened] = useState(false);
    const [openDetailContent, setOpenDetailContent] = useState(false);
    const [getNEpisodes, setGetNEpisodes] = useState({
        opened: false,
        eposideFrom: 1,
        eposideTo: 10
    });
    const [currentContentIndex, setCurrentContentIndex] = useState(0);
    const [currentContent, setCurrentContent] = useState('');
    const [currentContentEditing, setCurrentContentEditing] = useState<string>('');

    const [statusType, setStatusType] = useState<{
        creating: boolean;
        uploading: boolean;
    }>({
        creating: true,
        uploading: false,
    });

    useEffect(() => {
        const data = sortBy(records, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    useEffect(() => {
        getSchedules();
    }, [createVideoAt, uploadVideoAt, statusType]);

    const getSchedules = async () => {
        const queries: Array<Parse.Query<Parse.Object<ChapSchedule>>> = []
        const schedulesByCreateVideo = new Parse.Query<Parse.Object<ChapSchedule>>(ParseClass.ChapSchedule)
            .greaterThanOrEqualTo('createVideoAt', dayjs(createVideoAt).startOf('day').toDate())
            .lessThanOrEqualTo('createVideoAt', dayjs(createVideoAt).endOf('day').toDate());

        const schedulesByUploadVideo = new Parse.Query<Parse.Object<ChapSchedule>>(ParseClass.ChapSchedule)
            .greaterThanOrEqualTo('uploadVideoAt', dayjs(uploadVideoAt).startOf('day').toDate())
            .lessThanOrEqualTo('uploadVideoAt', dayjs(uploadVideoAt).endOf('day').toDate());
        if (!statusType.creating && !statusType.uploading) {
            setRecords([]);
        }
        if (statusType.creating) {
            queries.push(schedulesByCreateVideo);
        }
        if (statusType.uploading) {
            queries.push(schedulesByUploadVideo);
        }

        if (queries.length) {
            const query = await Parse.Query.or<Parse.Object<ChapSchedule>>(...queries);
            if (statusType.creating) {
                query.addAscending('createVideoAt')
            }
            if (statusType.uploading) {
                query.addAscending('uploadVideoAt')
            }
            const schedules = await query
                .addAscending('storyId')
                .addAscending('episodeNum')
                .find();
            const data = schedules.map(item => item.toJSON());
            setRecords(schedules.map(item => item.toJSON()));
        }
    }

    const renderStatus = (status: CreatingVideoStatus | UploadingVideoStatus | GetContentStatus) => {
        switch (status) {
            case CreatingVideoStatus.NEW:
            case UploadingVideoStatus.NEW:
                return <span className='tw-text-violet-500'>{status}</span>;
            case CreatingVideoStatus.PROCESSING:
            case UploadingVideoStatus.PROCESSING:
                return <span className='tw-text-yellow-500'>{status}</span>;
            case CreatingVideoStatus.SUCCESS:
            case UploadingVideoStatus.SUCCESS:
                return <span className='tw-text-green-500'>{status}</span>;
            case CreatingVideoStatus.FAILED:
            case UploadingVideoStatus.FAILED:
                return <span className='tw-text-red-500'>{status}</span>;
            default:
                return <span className='tw-text-violet-500'>NEW</span>;
        }
    }

    const getScheduleDetail = async (record: ColumnType) => {
        const { data } = await axios.post(`${Env.API}/schedule-detail`, { storyId: record.storyId, episodeNum: record.episodeNum });
        setCurrentRecord({ record, content: data.content });
        setChapScheduleObj({
            createVideoAt: dayjs(record?.createVideoAt?.iso!).toDate(),
            createVideoAtTime: dayjs(record?.createVideoAt?.iso!).format('HH:mm'),
            creatingVideoStatus: record?.creatingVideoStatus!,
            uploadVideoAt: dayjs(record?.uploadVideoAt?.iso!).toDate(),
            uploadVideoAtTime: dayjs(record?.uploadVideoAt?.iso!).format('HH:mm'),
            uploadingVideoStatus: record?.uploadingVideoStatus!
        });
        const relativeChapSchedules = await new Parse.Query<Parse.Object<ChapSchedule>>(ParseClass.ChapSchedule).equalTo('storyId', record.storyId).limit(10000).find();
        console.log(relativeChapSchedules);
        console.log(currentRecord);
        setRelativeChapSchedules({
            sameDate: relativeChapSchedules
                .filter(item => item.get('createVideoAt').getTime() === new Date(record.createVideoAt.iso).getTime() && item.get('episodeNum') != record.episodeNum)
                .sort((a, b) => a.get('episodeNum') - b.get('episodeNum'))
                .map(item => ({
                    schedule: item,
                    checked: false
                })),
            beforeDate: relativeChapSchedules
                .filter(item => item.get('createVideoAt').getTime() < new Date(record.createVideoAt.iso).getTime())
                .sort((a, b) => a.get('episodeNum') - b.get('episodeNum'))
                .map(item => ({
                    schedule: item,
                    checked: false
                })),
            afterDate: relativeChapSchedules
                .filter(item => item.get('createVideoAt').getTime() > new Date(record.createVideoAt.iso).getTime())
                .sort((a, b) => a.get('episodeNum') - b.get('episodeNum'))
                .map(item => ({
                    schedule: item,
                    checked: false
                })),
        });
        setOpened(true);
    }

    const saveUpdate = async () => {
        modals.openConfirmModal({
            title: 'Update Schedule',
            children: (
                <div>
                    Do you want to update the Schedule?
                </div>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: async () => {
                const obj = new Parse.Object(ParseClass.ChapSchedule) as Parse.Object<ChapSchedule>;
                obj.set('id', currentRecord?.record.objectId!);
                obj.set('createVideoAt', new Date(dayjs(chapScheduleObj?.createVideoAt).format('YYYY-MM-DD') + ' ' + chapScheduleObj?.createVideoAtTime));
                obj.set('uploadVideoAt', new Date(dayjs(chapScheduleObj?.uploadVideoAt).format('YYYY-MM-DD') + ' ' + chapScheduleObj?.uploadVideoAtTime));
                obj.set('creatingVideoStatus', chapScheduleObj?.creatingVideoStatus!);
                obj.set('uploadingVideoStatus', chapScheduleObj?.uploadingVideoStatus!);
                await obj.save(null);
                const relatives: Array<Parse.Object<ChapSchedule>> = [];
                relativeChapSchedules.sameDate.forEach(item => {
                    item.schedule.set('createVideoAt', new Date(dayjs(chapScheduleObj?.createVideoAt).format('YYYY-MM-DD') + ' ' + chapScheduleObj?.createVideoAtTime));
                    item.schedule.set('uploadVideoAt', new Date(dayjs(chapScheduleObj?.uploadVideoAt).format('YYYY-MM-DD') + ' ' + chapScheduleObj?.uploadVideoAtTime));
                    item.checked && relatives.push(item.schedule);
                });
                relativeChapSchedules.beforeDate.forEach(item => {
                    item.checked && relatives.push(item.schedule);
                });
                relativeChapSchedules.afterDate.forEach(item => {
                    item.checked && relatives.push(item.schedule);
                });
                relatives.forEach(obj => {
                    obj.set('creatingVideoStatus', chapScheduleObj?.creatingVideoStatus!);
                    obj.set('uploadingVideoStatus', chapScheduleObj?.uploadingVideoStatus!);
                })
                await Parse.Object.saveAll(relatives);
                await getSchedules();
            },
        });
    }

    const handleEpisodeContentEditing = useCallback((evt: ContentEditableEvent, chapIndex: number) => {
        const content = evt.target.value.split('<br>').filter(item => item).map(item => (extractTextFromHTML(item))).join('\n');
        setCurrentContentIndex(chapIndex);
        setCurrentContentEditing(content);
    }, [])

    const saveEpisodeContentEditing = async () => {
        const { data } = await axios.post<any>(`${Env.API}/update-content`, {
            id: currentRecord?.record.storyId!,
            episode: currentRecord?.record.episodeNum,
            chap: currentContentIndex,
            content: currentContentEditing
        });
    }

    const getEpisodeContent = async (episodeFrom: number, episodeTo: number) => {
        const { data } = await axios.post<any>(`${Env.API}/get-content`, {
            id: currentRecord?.record.storyId!,
            episodeFrom,
            episodeTo
        });
        console.log(data);
        toast.info(data.message);
    }

    const parser: () => DOMParser = () => {
        return typeof DOMParser !== 'undefined' ? new DOMParser() : null as any;
    };

    return (
        <>
            <div className='tw-flex tw-items-end tw-gap-4 tw-py-4'>
                <div className='tw-flex tw-flex-col tw-gap-2'>
                    <div className='tw-text-sm tw-font-bold'>Creating At:</div>
                    <DateInput value={createVideoAt} onChange={(value) => setCreateVideoAt(value!)}
                        disabled={!statusType.creating}
                        rightSection={<Checkbox className='!tw-cursor-pointer' checked={statusType.creating}
                            onChange={(event) => setStatusType({ ...statusType, creating: event.currentTarget.checked })} />} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2'>
                    <div className='tw-text-sm tw-font-bold'>Uploading At</div>
                    <DateInput value={uploadVideoAt} onChange={(value) => setUploadVideoAt(value!)}
                        disabled={!statusType.uploading}
                        rightSection={<Checkbox className='!tw-cursor-pointer' checked={statusType.uploading}
                            onChange={(event) => setStatusType({ ...statusType, uploading: event.currentTarget.checked })} />} />
                </div>
                <Button onClick={() => {
                    setCreateVideoAt(dayjs(createVideoAt).subtract(1, 'day').toDate());
                    setUploadVideoAt(dayjs(uploadVideoAt).subtract(1, 'day').toDate());
                }}>Prev</Button>
                <Button onClick={() => {
                    setCreateVideoAt(new Date());
                    setUploadVideoAt(new Date());
                }}>Today</Button>
                <Button onClick={() => {
                    setCreateVideoAt(dayjs(createVideoAt).add(1, 'day').toDate());
                    setUploadVideoAt(dayjs(uploadVideoAt).add(1, 'day').toDate());
                }}>Next</Button>
                <Button onClick={() => {
                    getSchedules();
                }}>Refresh</Button>
                <div className='tw-text-lg tw-font-bold tw-text-blue-600'>Total: {records.length} items</div>
            </div>
            <ScrollArea>
                <DataTable className='tw-bg-zinc-900'
                    withTableBorder
                    withColumnBorders
                    records={records}
                    columns={[
                        {
                            accessor: 'storyName', title: 'Story Name', width: 360, sortable: true,
                            render: (value) => <>
                                <div className='tw-flex tw-gap-2 tw-items-center'>
                                    <IconEye className='tw-cursor-pointer' onClick={() => getScheduleDetail(value)} />
                                    <span>{parser()?.parseFromString(value.storyName, 'text/html')?.body?.textContent}</span>
                                    {/* <div dangerouslySetInnerHTML={{ __html: value.storyName }}></div> */}
                                </div>
                            </>
                        },
                        { accessor: 'storyId', title: 'Story ID', width: 360, sortable: true },
                        { accessor: 'episodeNum', title: 'Episode', sortable: true },
                        {
                            accessor: 'isEnd', title: 'Is End', width: 96, sortable: true,
                            render: (value) => value.isEnd ? <span className='tw-text-red-500'>Yes</span> : <span className='tw-text-green-500'>No</span>
                        },
                        {
                            accessor: 'getContentStatus', title: 'Get Content', width: 150, sortable: true, render: (value) => <>
                                <div className="tw-flex tw-justify-between tw-gap-2">
                                    {renderStatus(value.getContentStatus)}
                                    <IconPlayerPlay className='tw-cursor-pointer tw-text-blue-500' />
                                </div>
                            </>
                        },
                        {
                            accessor: 'createVideoAt', title: 'Create Video At', width: 175, sortable: true, render: (value) => {
                                const date = dayjs(value.createVideoAt.iso).format('YYYY-MM-DD HH:mm').split(' ');
                                return <>
                                    <span>{date[0] + ' '}</span>
                                    <span className='tw-text-yellow-500 tw-font-bold tw-text-lg'>{date[1]}</span>
                                </>
                            }
                        },
                        {
                            accessor: 'creatingVideoStatus', title: 'Creating', width: 150, sortable: true, render: (value) => <>
                                <div className="tw-flex tw-justify-between tw-gap-2">
                                    {renderStatus(value.creatingVideoStatus)}
                                    <IconPlayerPlay className='tw-cursor-pointer tw-text-blue-500' />
                                </div>
                            </>
                        },
                        {
                            accessor: 'uploadVideoAt', title: 'Upload Video At', width: 175, sortable: true, render: (value) => {
                                const date = dayjs(value.uploadVideoAt.iso).format('YYYY-MM-DD HH:mm').split(' ');
                                return <>
                                    <span>{date[0] + ' '}</span>
                                    <span className='tw-text-yellow-500 tw-font-bold tw-text-lg'>{date[1]}</span>
                                </>
                            }
                        },
                        {
                            accessor: 'uploadingVideoStatus', title: 'Uploading', width: 150, sortable: true, render: (value) => <>
                                <div className="tw-flex tw-justify-between tw-gap-2">
                                    {renderStatus(value.uploadingVideoStatus)}
                                    <IconPlayerPlay className='tw-cursor-pointer tw-text-fuchsia-500' />
                                </div>
                            </>
                        },
                        { accessor: 'chapId', title: 'Chap ID', width: 150, sortable: true },
                        { accessor: 'from', title: 'From', width: 80, sortable: true },
                        { accessor: 'to', title: 'To', width: 80, sortable: true },
                        { accessor: 'audio', title: 'Audio', width: 100, sortable: true },
                        { accessor: 'audioVol', title: 'Audio Vol', width: 120, sortable: true, render: (value) => `${(value.audioVol ?? 0) * 100} %` },
                        { accessor: 'playlistId', title: 'Playlist ID', width: 360 },
                        {
                            accessor: 'screenshot', title: 'Screenshot', width: 140, sortable: true,
                            render: (value) => value.screenshot ? <span className='tw-text-red-500'>Yes</span> : <span className='tw-text-green-500'>No</span>
                        },
                    ]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    scrollAreaProps={{ type: 'never' }}
                />
            </ScrollArea>
            <Modal opened={opened} onClose={() => { setOpened(false) }} title="Episode Detail" size={'xl'} scrollAreaComponent={ScrollArea.Autosize}>
                {!!currentRecord && <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                    <div>
                        <div className='tw-text-lg tw-font-bold tw-text-red-500'>
                            <span className='tw-mr-4'>
                                {parser()?.parseFromString(currentRecord?.record?.storyName, 'text/html').body?.textContent}
                            </span>
                            <span className='tw-text-yellow-500'>[episode {currentRecord?.record?.episodeNum}] [{currentRecord?.record?.chapId}]</span>
                        </div>
                    </div>
                    <div className='tw-grid tw-gap-4 tw-grid-cols-2'>
                        <div className='tw-grid tw-gap-2'>
                            <div className='tw-text-sm'>Creating Video At</div>
                            <div className='tw-grid tw-grid-cols-4 tw-gap-2'>
                                <DateInput className='tw-col-span-3' defaultValue={chapScheduleObj?.createVideoAt}
                                    onChange={(value) => { setChapScheduleObj({ ...chapScheduleObj!, createVideoAt: dayjs(value).toDate() }) }} />
                                <TimeInput defaultValue={chapScheduleObj?.createVideoAtTime}
                                    onChange={(e) => { setChapScheduleObj({ ...chapScheduleObj!, createVideoAtTime: e.target.value }) }} />
                            </div>
                        </div>
                        <div className='tw-grid tw-gap-2'>
                            <div className='tw-text-sm'>Creating Video Status</div>
                            <Select defaultValue={chapScheduleObj?.creatingVideoStatus} data={[
                                CreatingVideoStatus.NEW,
                                CreatingVideoStatus.PROCESSING,
                                CreatingVideoStatus.SUCCESS,
                                CreatingVideoStatus.FAILED,
                            ]} onChange={(value) => { setChapScheduleObj({ ...chapScheduleObj!, creatingVideoStatus: value as any }) }} />
                        </div>
                    </div>
                    <div className='tw-grid tw-gap-4 tw-grid-cols-2'>
                        <div className='tw-grid tw-gap-2'>
                            <div className='tw-text-sm'>Uploading Video At</div>
                            <div className='tw-grid tw-grid-cols-4 tw-gap-2'>
                                <DateInput className='tw-col-span-3' value={chapScheduleObj?.uploadVideoAt}
                                    onChange={(value) => { setChapScheduleObj({ ...chapScheduleObj!, uploadVideoAt: dayjs(value).toDate() }) }} />
                                <TimeInput defaultValue={chapScheduleObj?.uploadVideoAtTime}
                                    onChange={(e) => { setChapScheduleObj({ ...chapScheduleObj!, uploadVideoAtTime: e.target.value }) }} />
                            </div>
                        </div>
                        <div className='tw-grid tw-gap-2'>
                            <div className='tw-text-sm'>Uploading Video Status</div>
                            <Select defaultValue={chapScheduleObj?.uploadingVideoStatus} data={[
                                UploadingVideoStatus.NEW,
                                UploadingVideoStatus.PROCESSING,
                                UploadingVideoStatus.SUCCESS,
                                UploadingVideoStatus.FAILED,
                            ]} onChange={(value) => { setChapScheduleObj({ ...chapScheduleObj!, uploadingVideoStatus: value as any }) }} />
                        </div>
                    </div>
                    <div>
                        <Accordion multiple>
                            <Accordion.Item key='before_date' value='before_date'>
                                <Accordion.Control>Before Date</Accordion.Control>
                                <Accordion.Panel>
                                    <div className='tw-grid tw-gap-2'>
                                        <div className='tw-flex tw-items-center tw-gap-2'>
                                            <Checkbox onChange={e => {
                                                setRelativeChapSchedules({
                                                    ...relativeChapSchedules,
                                                    beforeDate: relativeChapSchedules.beforeDate.map((item, index) => {
                                                        return {
                                                            ...item,
                                                            checked: e.target.checked
                                                        }
                                                    })
                                                });
                                            }} />
                                            <div>Select All</div>
                                        </div>
                                        {relativeChapSchedules.beforeDate.map((mItem, index) => {
                                            return <div className='tw-flex tw-items-center tw-gap-2' key={index}>
                                                <Checkbox checked={mItem.checked} onChange={(e) => {
                                                    setRelativeChapSchedules({
                                                        ...relativeChapSchedules,
                                                        beforeDate: relativeChapSchedules.beforeDate.map((item, index) => {
                                                            if (item.schedule.id === mItem.schedule.id) {
                                                                return {
                                                                    ...item,
                                                                    checked: e.target.checked
                                                                }
                                                            }
                                                            return item;
                                                        })
                                                    });
                                                }} />
                                                <div>{mItem.schedule.get('storyName')} - </div>
                                                <div>Episode: {mItem.schedule.get('episodeNum')}</div>
                                            </div>
                                        })}
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item key='same_date' value='same_date'>
                                <Accordion.Control>Same Date</Accordion.Control>
                                <Accordion.Panel>
                                    <div className='tw-grid tw-gap-2'>
                                        <div className='tw-flex tw-items-center tw-gap-2'>
                                            <Checkbox onChange={e => {
                                                setRelativeChapSchedules({
                                                    ...relativeChapSchedules,
                                                    sameDate: relativeChapSchedules.sameDate.map((item, index) => {
                                                        return {
                                                            ...item,
                                                            checked: e.target.checked
                                                        }
                                                    })
                                                });
                                            }} />
                                            <div>Select All</div>
                                        </div>
                                        {relativeChapSchedules.sameDate.map((mItem, index) => {
                                            return <div className='tw-flex tw-items-center tw-gap-2' key={index}>
                                                <Checkbox checked={mItem.checked} onChange={(e) => {
                                                    setRelativeChapSchedules({
                                                        ...relativeChapSchedules,
                                                        sameDate: relativeChapSchedules.sameDate.map((item, index) => {
                                                            if (item.schedule.id === mItem.schedule.id) {
                                                                return {
                                                                    ...item,
                                                                    checked: e.target.checked
                                                                }
                                                            }
                                                            return item;
                                                        })
                                                    });
                                                }} />
                                                <div>{mItem.schedule.get('storyName')} - </div>
                                                <div>Episode: {mItem.schedule.get('episodeNum')}</div>
                                            </div>
                                        })}
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item key='after_date' value='after_date'>
                                <Accordion.Control>After Date</Accordion.Control>
                                <Accordion.Panel>
                                    <div className='tw-grid tw-gap-2'>
                                        <div className='tw-flex tw-items-center tw-gap-2'>
                                            <Checkbox onChange={e => {
                                                setRelativeChapSchedules({
                                                    ...relativeChapSchedules,
                                                    afterDate: relativeChapSchedules.afterDate.map((item, index) => {
                                                        return {
                                                            ...item,
                                                            checked: e.target.checked
                                                        }
                                                    })
                                                });
                                            }} />
                                            <div>Select All</div>
                                        </div>
                                        {relativeChapSchedules.afterDate.map((mItem, index) => {
                                            return <div className='tw-flex tw-items-center tw-gap-2' key={index}>
                                                <Checkbox checked={mItem.checked} onChange={(e) => {
                                                    setRelativeChapSchedules({
                                                        ...relativeChapSchedules,
                                                        afterDate: relativeChapSchedules.afterDate.map((item, index) => {
                                                            if (item.schedule.id === mItem.schedule.id) {
                                                                return {
                                                                    ...item,
                                                                    checked: e.target.checked
                                                                }
                                                            }
                                                            return item;
                                                        })
                                                    });
                                                }} />
                                                <div>{mItem.schedule.get('storyName')} - </div>
                                                <div>Episode: {mItem.schedule.get('episodeNum')}</div>
                                            </div>
                                        })}
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className='tw-grid tw-gap-4 tw-grid-cols-3'>
                        <Button color='yellow'>
                            Ins Create +1
                        </Button>
                        <Button color='yellow'>
                            Ins Upload +1
                        </Button>
                        <Button onClick={saveUpdate}>
                            Save
                        </Button>
                    </div>
                    <div className='tw-grid tw-gap-4 tw-grid-cols-3'>
                        <Button color='green' onClick={() => getEpisodeContent(currentRecord?.record.episodeNum, currentRecord?.record.episodeNum)}>
                            Get 1 Episode
                        </Button>
                        <Button color='teal' onClick={() => setGetNEpisodes({ ...getNEpisodes, opened: true })}>
                            Get N Episodes
                        </Button>
                        <Button color='orange' onClick={() => getEpisodeContent(1, 10000)}>
                            Get ALL Episodes
                        </Button>
                    </div>
                    {
                        currentRecord?.content?.map((item, index) => <div key={index} className={`tw-grid tw-gap-4 tw-p-4 tw-rounded-lg ${index % 2 === 0 ? 'tw-bg-slate-700' : 'tw-bg-slate-800'}`}>
                            <div className={`tw-font-bold tw-text-lg tw-text-yellow-500 tw-flex tw-justify-between ${item.content.indexOf('nội dung ảnh') >= 0 ? '!tw-text-red-500' : ''}`}>
                                {item.title}
                                <IconEye className='tw-cursor-pointer' onClick={() => {
                                    setOpenDetailContent(true);
                                    setCurrentContentIndex(index);
                                }} />
                            </div>
                            <div className='tw-grid tw-gap-4 tw-whitespace-pre-line'>
                                <div>{item.content.split('\n').slice(0, 3).join('\n')}</div>
                                <Divider color='white' />
                                <div>{item.content.split('\n').slice(Math.ceil(item.content.split('\n').length / 2), Math.ceil(item.content.split('\n').length / 2) + 3).join('\n')}</div>
                                <Divider color='white' />
                                <div>{item.content.split('\n').slice(item.content.split('\n').length - 3).join('\n')}</div>
                            </div>
                        </div>)
                    }
                </div>}
            </Modal>
            <Modal opened={openDetailContent} onClose={() => { setOpenDetailContent(false); getScheduleDetail(currentRecord?.record!) }}
                title={<div className='tw-font-bold tw-text-lg tw-text-yellow-500'>
                    {parser()?.parseFromString(currentRecord?.record?.storyName!, 'text/html').body?.textContent} - {currentRecord?.record?.episode}
                </div>}
                size={'xl'} scrollAreaComponent={ScrollArea.Autosize}>
                <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                    <Accordion defaultValue={currentContentIndex.toString()}>
                        {
                            currentRecord?.content?.map((item, index) => {
                                return <Accordion.Item key={index} value={index.toString()}>
                                    <Accordion.Control>
                                        <div className='tw-font-bold tw-text-yellow-300'>{item.title}</div>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <div className='tw-relative'>
                                            <div className='tw-text-red-500'></div>
                                            <div className='tw-absolute tw-top-2 tw-right-2 tw-p-1 tw-bg-green-300/30 tw-rounded-md tw-cursor-pointer tw-z-10' onClick={saveEpisodeContentEditing}>
                                                <IconDeviceFloppy size={32} className='tw-text-green-300' />
                                            </div>
                                            <EditContent chapIndex={index} html={item.content} onChange={handleEpisodeContentEditing} />
                                        </div>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            })
                        }

                    </Accordion>
                </div>
            </Modal>
            <Modal opened={getNEpisodes.opened} onClose={() => { setGetNEpisodes({ ...getNEpisodes, opened: false }) }}
                title={<div className='tw-font-bold tw-text-lg tw-text-yellow-500'>Get N Episode Content</div>}
                size={'sm'} scrollAreaComponent={ScrollArea.Autosize}>
                <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                    <div className='tw-flex tw-gap-2 tw-items-center'>
                        <div className='tw-w-12'>From</div>
                        <Input className='tw-w-full' type='number' value={getNEpisodes.eposideFrom} onChange={(e) => setGetNEpisodes({ ...getNEpisodes, eposideFrom: parseInt(e.target.value) })} />
                    </div>
                    <div className='tw-flex tw-gap-2 tw-items-center'>
                        <div className='tw-w-12'>To</div>
                        <Input className='tw-w-full' type='number' value={getNEpisodes.eposideTo} onChange={(e) => setGetNEpisodes({ ...getNEpisodes, eposideTo: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <Button color='green' onClick={() => { getEpisodeContent(getNEpisodes.eposideFrom, getNEpisodes.eposideTo) }}>OK</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}