"use client";
import TableSort from "../components/TableSort";

export default function Schedule() {
  return (
    <>
      <div className="tw-container tw-mx-auto tw-h-screen tw-py-12 tw-flex tw-flex-col tw-gap-8">
        <h1 className="tw-text-3xl tw-font-bold">Schedule Management</h1>
        <TableSort></TableSort>
      </div>
    </>
  );
}
