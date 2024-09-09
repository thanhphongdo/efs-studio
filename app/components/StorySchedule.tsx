import { Button, Checkbox, Input, Modal, NumberInput, ScrollArea, Select, rem } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import { memo, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Env } from '../consts/env';
import { toast } from 'react-toastify';


const musics = ['music-001', 'music-002', 'music-003', 'music-004'];

export type ScheduleType = {
    id: string,
    name: string,
    url: string,
    chapInEpisode: number,
    episodePerDay: number,
    audio: string,
    audioVol: number,
    startDate: string,
    step: number,
    createVideoAt: number,
    uploadVideoAt: number,
    isFull?: boolean,
    from?: number,
    to?: number
}

export function msToTime(duration: number) {
    const seconds = Math.floor((duration / 1000) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

export function timeToMs(time: string) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 * 60 * 1000 + parseInt(minutes) * 60 * 1000;
}


export default memo(function (props: { url: string, name: string }) {
    const [opened, setOpened] = useState(false);
    const refCreatingVideo = useRef<HTMLInputElement>(null);
    const refUploadingVideo = useRef<HTMLInputElement>(null);

    const [schedule, setSchedule] = useState<ScheduleType>({
        id: '',
        name: '',
        url: props.url,
        chapInEpisode: 10,
        episodePerDay: 4,
        audio: musics[0],
        audioVol: 1,
        startDate: dayjs().format('YYYY-MM-DD') + ':00:00:00',
        step: 1,
        createVideoAt: 0,
        uploadVideoAt: 32400000,
        isFull: true,
        from: 1,
        to: 10000
    });

    const getStoryId = () => {
        return new URL(props.url).pathname.split('/').slice(-2)[0];
    }

    useEffect(() => {
        setSchedule({ ...schedule, id: getStoryId(), name: props.name.split('\n').join(' '), url: props.url });
    }, [props]);

    const createSchedule = async () => {
        const obj = { ...schedule };
        if (obj.createVideoAt > obj.uploadVideoAt) {
            obj.uploadVideoAt = obj.uploadVideoAt + 24 * 60 * 60 * 1000;
        }
        const { data } = await axios.post(`${Env.API}/create-schedule`, obj);
        toast.info(data.message);
    }

    const reSchedule = async () => {
        const obj = { ...schedule };
        if (obj.createVideoAt > obj.uploadVideoAt) {
            obj.uploadVideoAt = obj.uploadVideoAt + 24 * 60 * 60 * 1000;
        }
        const { data } = await axios.post(`${Env.API}/re-schedule`, obj);
        toast.info(data.message);
    }

    return <>
        <Button onClick={() => setOpened(true)}>Set Schedule</Button>
        <Modal opened={opened} onClose={() => { setOpened(false) }} title="Set Schedule" size={'lg'} scrollAreaComponent={ScrollArea.Autosize}>
            <div className='tw-grid tw-grid-cols-6 tw-gap-4'>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>URL:</div>
                    <Input value={schedule.url} readOnly />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Name:</div>
                    <Input value={schedule.name} readOnly />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Chap in Episode:</div>
                    <NumberInput defaultValue={10} step={10}
                        onChange={(value) => { setSchedule({ ...schedule, chapInEpisode: parseInt(value!.toString()) }) }} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Episode per day:</div>
                    <NumberInput defaultValue={4}
                        onChange={(value) => { setSchedule({ ...schedule, episodePerDay: parseInt(value!.toString()) }) }} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Music:</div>
                    <Select placeholder='Select Music' value={schedule.audio} data={musics}
                        onChange={(value) => { setSchedule({ ...schedule, audio: value! }) }}></Select>
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Music Vol (%):</div>
                    <NumberInput placeholder='Set Music Vol' value={schedule.audioVol * 100} step={5} defaultValue={100} min={5}
                        onChange={(value) => { setSchedule({ ...schedule, audioVol: parseInt(value!.toString()) / 100 }) }} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Start Date:</div>
                    <DateInput placeholder='Select Start Date' value={new Date(schedule.startDate)}
                        onChange={(value) => { setSchedule({ ...schedule, startDate: dayjs(value).format('YYYY-MM-DD') + ':00:00:00' }) }}
                        rightSection={<IconCalendar className='tw-cursor-pointer' width={rem(10)} stroke={1.5} />} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Loop Req:</div>
                    <NumberInput placeholder='Set Loop Req' defaultValue={1} value={schedule.step} step={1} min={1}
                        onChange={(value) => { setSchedule({ ...schedule, step: parseInt(value!.toString()) }) }} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Creating At:</div>
                    <TimeInput ref={refCreatingVideo} placeholder='Select Creating At' value={msToTime(schedule.createVideoAt)}
                        onChange={(value) => { setSchedule({ ...schedule, createVideoAt: timeToMs(value.target.value) }) }}
                        rightSection={<IconClock className='tw-cursor-pointer' width={rem(10)} stroke={1.5}
                            onClick={() => refCreatingVideo.current?.showPicker()} />} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Uploading At:</div>
                    <TimeInput ref={refUploadingVideo} placeholder='Select Creating At' value={msToTime(schedule.uploadVideoAt)}
                        onChange={(value) => { setSchedule({ ...schedule, uploadVideoAt: timeToMs(value.target.value) }) }}
                        rightSection={<IconClock className='tw-cursor-pointer' width={rem(10)} stroke={1.5}
                            onClick={() => refUploadingVideo.current?.showPicker()} />} />
                </div>
                <div className='tw-flex tw-flex-col tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'>Schedule range:</div>
                    <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
                        <NumberInput placeholder='From' value={schedule.from} step={1} min={1}
                            onChange={(value) => { setSchedule({ ...schedule, from: parseInt(value!.toString()) }) }} />
                        <NumberInput placeholder='To' value={schedule.to} step={1} min={1}
                            onChange={(value) => { setSchedule({ ...schedule, to: parseInt(value!.toString()) }) }} />
                    </div>
                </div>
                <div className='tw-flex tw-flex-col tw-justify-end tw-items-center tw-gap-2 tw-col-span-3'>
                    <div className='tw-text-sm'></div>
                    <Checkbox label="Is Full" defaultChecked onChange={(e) => { setSchedule({ ...schedule, isFull: e.currentTarget.checked }) }} />
                </div>
                <Button color='cyan' className='tw-col-span-2' onClick={reSchedule}>Create Background</Button>
                <Button color='yellow' className='tw-col-span-2' onClick={reSchedule}>Re-Schedule</Button>
                <Button className='tw-col-span-2' onClick={createSchedule}>Create Schedule</Button>
            </div>
        </Modal>
    </>
})