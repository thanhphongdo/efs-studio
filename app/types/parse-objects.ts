import { CreatingVideoStatus, UploadingVideoStatus, GetContentStatus } from "../consts/parse-class";

export type StoryBackground = {
    storyId: string,
    config: any,
    scheduled: boolean
    playlistId?: string,
    episodes?: number,
    chapInEpisode?: number,
    episodePerDay?: number
}

export type ChapSchedule = {
    id: string;
    storyId: string,
    storyName: string,
    chaps: number,
    links: Array<Array<string>>;
    chapId: string,
    from: string,
    to: string,
    isEnd: boolean,
    screenshot: boolean,
    title: string,
    episode: string,
    episodeNum: number,
    videoTitle: string,
    videoDesc: string,
    tags: Array<string>,
    createVideoAt: Date,
    uploadVideoAt: Date,
    audio: string,
    audioVol: number,
    index: number,
    playlistId?: string,
    groupId?: string,
    creatingVideoStatus: CreatingVideoStatus,
    uploadingVideoStatus: UploadingVideoStatus,
    getContentStatus: GetContentStatus,
    config?: Parse.Object<StoryBackground>
}