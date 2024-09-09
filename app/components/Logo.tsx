export default (props: { className?: string }) => {
    return <div className={`tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-8 ${props.className}`}>
        <div className="tw-relative tw-w-24 tw-h-24">
            <img className="tw-w-full tw-absolute tw-rounded-full tw-rotate-[20deg]" src="/images/logo-1.png" />
            <img className="tw-w-[60%] tw-absolute tw-rounded-full tw-top-9 tw-right-0" src="/images/logo-2.png" />
        </div>
        <div className="tw-text-[#1fb7ed] tw-rounded-md tw-text-[1.5rem] tw-font-[LogoFont] tw-font-semibold">© Mê Truyện Full</div>
    </div>
}