import { Modal, ScrollArea } from "@mantine/core";
import { backgrounds } from "../consts/backgrounds";

export function BackgroundModal(props: { opened: boolean, onClose: (bg?: string) => void }) {
    return <>
        <Modal opened={props.opened} onClose={() => { props.onClose() }} title="Select background" size={'lg'} scrollAreaComponent={ScrollArea.Autosize}>
            <div>
                <div className="tw-grid tw-grid-cols-3 tw-gap-2">
                    {backgrounds.map((item, index) => {
                        return <div className="tw-aspect-square tw-bg-gray-950 tw-bg-contain tw-bg-no-repeat tw-bg-center tw-cursor-pointer"
                            key={index} style={{ backgroundImage: `url("${item}")` }}
                            onClick={() => { props.onClose(item) }}></div>
                    })}
                </div>
            </div>
        </Modal>
    </>
}