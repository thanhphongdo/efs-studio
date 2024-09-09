"use client";
import { Button, Input, Modal, ScrollArea, Title } from "@mantine/core";
import axios from "axios";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { Env } from "../consts/env";
import { toast } from "react-toastify";
import { modals } from "@mantine/modals";

export default function () {
  const [tokens, setTokens] = useState<
    Array<{
      tokenId: number;
      limited?: boolean;
      used: number;
    }>
  >([]);

  const [opened, setOpened] = useState(false);
  const [code, setCode] = useState("");
  const [currentTokenId, setCurrentTokenId] = useState(0);

  useEffect(() => {
    getTokens();
  }, []);

  const getTokens = async () => {
    const tokens = await axios.post<{ tokens: Array<number> }>(
      `${Env.API}/get-tokens`
    );
    setTokens(
      tokens.data?.tokens?.map((item, index) => {
        return {
          tokenId: index + 1,
          used: item,
          limited: undefined,
        };
      }) || []
    );
  };

  const limitedLabel = (usedTime: number, limited?: boolean) => {
    if (usedTime >= 10) {
      return <span className="tw-text-red-500">SKIP</span>;
    }
    switch (limited) {
      case true:
        return <span className="tw-text-red-500">YES</span>;
      case false:
        return <span className="tw-text-green-500">NO</span>;
      default:
        return <span className="tw-text-gray-100">UNK</span>;
    }
  };

  const checkingToken = async (id: number) => {
    const { data } = await axios.post<{
      tokens: number[];
      limited: boolean;
    }>(`${Env.API}/checking-token`, { tokenId: id });
    setTokens(
      data?.tokens?.map((resItem, index) => {
        return {
          tokenId: index + 1,
          used: resItem,
          limited: index === id - 1 ? data.limited : tokens[index].limited,
        };
      })
    );
  };
  const skipToken = async (id: number) => {
    modals.openConfirmModal({
      title: "Skip Token",
      children: (
        <div>
          Do you want to skip the{" "}
          <span className="tw-text-red-500">
            {id.toString().padStart(3, "0")}
          </span>{" "}
          tokens?
        </div>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: async () => {
        const { data } = await axios.post<{
          tokens: number[];
          limited: boolean;
        }>(`${Env.API}/skip-token`, { tokenId: id });
        setTokens(
          data?.tokens?.map((resItem, index) => {
            return {
              tokenId: index + 1,
              used: resItem,
              limited: index === id - 1 ? data.limited : tokens[index].limited,
            };
          })
        );
      },
    });
  };

  const getOauthCode = async (id: number) => {
    const { data } = await axios.post<{
      authUrl: string;
    }>(`${Env.API}/get-oauth-code`, { tokenId: id });
    window.open(data.authUrl, "_blank");
    setOpened(true);
    setCode("");
    setCurrentTokenId(id);
  };

  const verifyTokenCode = async (id: number) => {
    try {
      const { data } = await axios.post<{ result: boolean }>(
        `${Env.API}/verify-token-code`,
        { tokenId: id, code }
      );
      if (data.result) {
        toast.success("The token is refreshed");
      } else {
        toast.error("The token refresh failed");
      }
    } catch (err) {
      toast.error("The token refresh failed");
    }
    setOpened(false);
  };

  return (
    <>
      <div className="tw-container tw-mx-auto tw-h-screen tw-py-12 tw-flex tw-flex-col tw-gap-8">
        <h1 className="tw-text-3xl tw-font-bold">Token Management</h1>
        <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-font-bold">
          {tokens?.map((item) => (
            <div
              className="tw-grid tw-grid-cols-2 tw-gap-2 tw-bg-slate-700 tw-p-4 tw-rounded-xl"
              key={item.tokenId}
            >
              <div>
                ID: 00{item.tokenId} {"<==>"} {item.used}
              </div>
              <div>Limited: {limitedLabel(item.used, item.limited)}</div>
              <div className="tw-col-span-2 tw-grid tw-grid-cols-3 tw-gap-2">
                <Button
                  color="yellow"
                  onClick={() => getOauthCode(item.tokenId)}
                >
                  Refresh
                </Button>
                <Button onClick={() => checkingToken(item.tokenId)}>
                  Checking
                </Button>
                <Button color="red" onClick={() => skipToken(item.tokenId - 1)}>
                  Skip
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="tw-flex-1"></div>
      </div>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title={<Title order={5}>Input Token Code for ID</Title>}
        size={"md"}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <div className="tw-grid tw-grid-cols-2 tw-gap-4">
          <div className="tw-flex tw-flex-col tw-gap-2 tw-col-span-2">
            <div>Input Code here:</div>
            <Input
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button color="red" onClick={() => setOpened(false)}>
            Close
          </Button>
          <Button
            onClick={async () => {
              verifyTokenCode(currentTokenId);
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
