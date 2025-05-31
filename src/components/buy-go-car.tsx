"use client";

import {useTranslations} from "next-intl";
import Image from "next/image";
import clsx from "clsx";
import {useEffect, useMemo, useState} from "react";
import {Checkbox} from "@/components/checkbox";
import {Button} from "@/components/button";
import {useWallet} from "@/lib/use-wallet";
import {useReferralStore} from "@/lib/use-referral-store";
import {useForm} from "react-hook-form";
import {API_BASE_URL} from "@/lib/constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {useParams, useSearchParams} from "next/navigation";
import {cn, getCoinLabel, getReferral} from "@/lib/utils";
import {Coin, Network} from "@/lib/use-wallet-store";
import {useMetaMask} from "@/lib/use-metamask";
import {usePhantom} from "@/lib/use-phantom";
import {useTrustWallet} from "@/lib/use-trust-wallet";
import {useWalletConnect} from "@/lib/use-wallet-connect";
import useSWR, {useSWRConfig} from "swr";
import {useWalletConnectorStore} from "@/lib/use-wallet-connector-store";

dayjs.extend(duration);

interface FormData {
    referral: string;
    amount: string;
}

export const BuyGoCar = (props: { rewards?: boolean }) => {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const [expectIcoGocar, setExpectIcoGocar] = useState(0);
    const form = useForm<FormData>({
        defaultValues: {amount: "0", referral: ""},
    });
    const wallet = useWallet();

    const referralStore = useReferralStore((s) => s);
    const coin = wallet.coin;
    const network = wallet.network;
    const amount = form.watch("amount");
    const [networkPerGocar, setNetworkPerGoCar] = useState(0);

    const sp = useSearchParams();
    useEffect(() => {
        const r = getReferral(sp);
        if (r) {
            referralStore.setValue(r);
        }
        const a = sp.get("amount");
        if (a && !Number.isNaN(a)) {
            form.setValue("amount", a);
        }
    }, [sp]);

    useEffect(() => {
        if (!wallet.coin) return setNetworkPerGoCar(0);
        fetch(`${API_BASE_URL}/v1/icosales/gocar/swap/amount/${wallet.coin}`)
            .then((res) => res.json())
            .then((result) => {
                setNetworkPerGoCar(result.gocarPerSymbol);
            });
    }, [wallet.coin]);

    useEffect(() => {
        setExpectIcoGocar(networkPerGocar * parseFloat(amount || "0.0"));
    }, [networkPerGocar, amount]);

    useEffect(() => {
        const r = getReferral(searchParams);
        if (r) {
            form.setValue("referral", r);
        }
    }, [searchParams]);

    const handleCoinClick = (net: Network) => () => {
        wallet.setNetwork(net);
    };

    const walletConnectorStore = useWalletConnectorStore();

    const handleCreateWalletClick = () => {
        walletConnectorStore.setCreate(true);
    };

    const meta = useMetaMask();
    const phantom = usePhantom();
    const trustwallet = useTrustWallet();
    const walletConnect = useWalletConnect();
    const [rewaredIds, setRewaredIds] = useState<number[]>([]);

    const handlePurchaseClick = async () => {
        if (parseFloat(amount) <= 0) {
            return alert("Amount must be greater than zero.");
        }
        // 1. Submit request payload first to server for batch checking.
        try {
            const res = await fetch(`${API_BASE_URL}/v1/icosales/participate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    solana_address: wallet.network === "SOL" ? wallet.address : "",
                    ico_address: wallet.address,
                    ico_network: wallet.network,
                    ico_token_symbol: wallet.coin,
                    icoAmount: parseFloat(amount),
                    gocarAmount: expectIcoGocar,
                    ico_type: "PUBLIC",
                    lock_release_date: "",
                    referral_code: referral,
                    bonus_reward_ids: rewaredIds,
                }),
            });

            if (res.status !== 201 && res.status !== 200) {
                throw new Error("Failed to server request.");
            }
            mutate(["icosalesCumulativeStatus"]);
            mutate(["stakingsStatusMe"]);
        } catch (error: unknown) {
            console.error("Failed to participate ico sales.", error);
            return alert("Failed to sign transaction.");
        }

        // 2. And request generate transaction
        try {
            switch (wallet.provider) {
                case "metamask":
                    await meta.generateTx(parseFloat(amount));
                    break;
                case "phantom":
                    if (wallet.network === "BNB") {
                        throw new Error("Unsupported bsc network for phantom wallet.");
                    }
                    await phantom.generateTx(parseFloat(amount));
                    break;
                case "trustwallet":
                    await trustwallet.generateTx(parseFloat(amount));
                    break;

                case "walletconnect":
                    await walletConnect.generateTx(parseFloat(amount));
                    break;
            }
        } catch (error: unknown) {
            console.error("Failed to sign ico purchase transaction.", error);
        }
    };

    const handleCollectWalletClick = () => {
        walletConnectorStore.setConnect(true);
    };

    useEffect(() => {
        form.setValue("amount", "0");
    }, [network, wallet.coin]);

    useEffect(() => {
        form.setValue("referral", referralStore.value || "");
    }, [referralStore.value]);

    const referralDisalbed = !!referralStore.value;

    const {mutate} = useSWRConfig();
    const [activeSetting, setActiveSetting] = useState<{
        endDate: string;
        gocarAmount: number;
        gocarPrice: number;
    }>({endDate: "", gocarAmount: 0, gocarPrice: 0});

    useEffect(() => {
        fetch(`${API_BASE_URL}/v1/icosales/step/setting`)
            .then((res) => res.json())
            .then((result) => {
                const activeStep = result.data.find((x: any) => x.active);
                if (activeStep) {
                    setActiveSetting(activeStep);
                }
            });
    }, []);

    const referral = form.watch("referral");
    const {locale} = useParams();
    return (
        <>
            <div
                className={
                    "flex border-4 border-black flex-col text-neutral-0 bg-[#EEF6FC] relative"
                }
            >
                <div className={"flex items-center justify-center pt-5 pb-4"}>
                    <p className={cn("text-header-3 text-center ", locale === 'ru' && '!text-header-4')}>{t("home.presalePurchase1")}</p>
                </div>
                <div className={"bg-neutral-0 flex items-center justify-center py-2"}>
                    <p className={"text-label-1 text-neutral-100"}>
                        {t("home.presalePurchase2")}
                    </p>
                </div>
                <div className={"space-y-4 py-4 flex flex-col items-center px-4"}>
                    <PresaleCountdown endDate={activeSetting.endDate}/>
                    <div className={"flex items-center space-x-2 self-stretch"}>
                        {[
                            ["ETH", "eth.png", "ETH"],
                            ["SOL", "sol.png", "SOL"],
                            ["BNB", "bnb.png", "BNB"],
                        ].map((item) => (
                            <button
                                key={item[2]}
                                onClick={handleCoinClick(item[2] as any)}
                                className={clsx(
                                    "flex items-center px-[30px] py-2 space-x-2 max-tablet:px-2 flex-1",
                                    network === item[2] ? "bg-neutral-0" : "bg-neutral-80",
                                )}
                            >
                                <Image
                                    src={`/images/${item[1]}`}
                                    alt={item[2]}
                                    width={24}
                                    height={24}
                                />
                                <span
                                    className={clsx(
                                        "text-body-3",
                                        network === item[2] && "text-neutral-100",
                                    )}
                                >
                  {item[0]}
                </span>
                            </button>
                        ))}
                    </div>

                    <ICOState/>

                    <MyICOInfo/>

                    <div
                        className={"relative self-stretch flex items-center justify-center"}
                    >
                        <span className={"w-full h-[1px] bg-neutral-60 absolute"}/>
                        <p className={"text-label-1 absolute bg-[#EEF6FC] px-2"}>
                            1 $GOTCAR = ${activeSetting.gocarPrice}
                        </p>
                    </div>

                    {/** */}
                    <div
                        className={
                            "flex items-center space-x-4 w-full max-md:flex-col max-md:space-x-0 max-md:space-y-4 max-md:items-stretch"
                        }
                    >
                        <div className={"flex flex-col space-y-1 flex-1"}>
                            <div className={"flex items-center justify-between text-label-1"}>
                                <select
                                    value={coin}
                                    onChange={(e) => {
                                        wallet.setCoin(e.target.value as Coin);
                                        form.setValue("amount", "0");
                                    }}
                                    className={
                                        "text-label-1 bg-transparent flex items-center space-x-1"
                                    }
                                >
                                    <option
                                        className={"flex items-center space-x-1"}
                                        value={network}
                                    >
                                        {t("home.presalePurchase9", {0: getCoinLabel(network)})}
                                    </option>

                                    <option
                                        className={"flex items-center space-x-1"}
                                        value={"USDT"}
                                    >
                                        {t("home.presalePurchase9", {0: getCoinLabel("USDT")})}
                                    </option>
                                </select>
                                {/*
                                  <button onClick={handleMaxClick}>
                                    {t("home.presalePurchase10")}
                                  </button>*/}
                            </div>
                            <div className={"bg-[#CDE7E5] p-2 flex items-center space-x-2"}>
                                <Image
                                    src={`/images/${coin.toLocaleLowerCase()}.png`}
                                    alt={coin}
                                    width={24}
                                    height={24}
                                />
                                <input
                                    {...form.register("amount")}
                                    type={"number"}
                                    className={"h-[22px] bg-transparent w-full text-right"}
                                />
                            </div>
                        </div>

                        <div className={"flex flex-col space-y-1 flex-1"}>
                            <div className={"flex items-center justify-between text-label-1"}>
                                <p>{t("home.presalePurchase11")}</p>
                            </div>
                            <div className={"bg-[#CDE7E5] p-2 flex items-center space-x-2"}>
                                <Image
                                    src={"/images/gocar.png"}
                                    alt={"gocar"}
                                    width={24}
                                    height={24}
                                />
                                <p className={"text-right w-full max-w-full overflow-x-auto "}>
                                    {expectIcoGocar.toFixed(4)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <RewardList
                        expectIcoGocar={expectIcoGocar}
                        referral={referral}
                        onRewardIds={setRewaredIds}
                        gocarPrice={activeSetting.gocarPrice}
                    />

                    <div className={"flex items-center self-stretch space-x-4"}>
                        <label className={"text-body-3"}>Referral:</label>
                        <div
                            className={"bg-[#CDE7E5] p-2 flex items-center space-x-2 w-full"}
                        >
                            <input
                                {...form.register("referral")}
                                disabled={referralDisalbed}
                                className={"h-[22px] bg-transparent w-full"}
                            />
                        </div>
                    </div>

                    <Button
                        disabled={!!wallet.address && !amount}
                        onClick={
                            wallet.address ? handlePurchaseClick : handleCollectWalletClick
                        }
                        className={"w-full"}
                    >
                        {wallet.address ? t("home.presaleJoin1") : t("home.presaleJoin2")}
                    </Button>

                    <button
                        className={"text-body-3 border-b-2 border-neutral-0"}
                        onClick={handleCreateWalletClick}
                    >
                        {t("home.noWallet1")}
                    </button>
                </div>
            </div>
        </>
    );
};

const PresaleCountdown = ({endDate}: { endDate: string }) => {
    const t = useTranslations();
    const calculateTimeLeft = () => {
        const now = dayjs();
        const diff = dayjs(endDate).diff(now); // 밀리초 단위 차이

        if (diff <= 0) {
            return {days: 0, hours: 0, minutes: 0, seconds: 0};
        }

        const timeLeft = dayjs.duration(diff);
        return {
            days: timeLeft.days(),
            hours: timeLeft.hours(),
            minutes: timeLeft.minutes(),
            seconds: timeLeft.seconds(),
        };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (Object.values(timeLeft).every((t) => t === 0)) return;

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
    }, [endDate]);

    return (
        <div className={"flex items-center space-x-4 self-center"}>
            <div className={"flex flex-col space-y-1 items-center justify-center"}>
                <p className={"text-header-2"}>{timeLeft.days}</p>
                <p className={"text-body-3"}>{t("home.presalePurchase3")}</p>
            </div>
            <div className={"flex flex-col space-y-1 items-center justify-center"}>
                <p className={"text-header-2"}>{timeLeft.hours}</p>
                <p className={"text-body-3"}>{t("home.presalePurchase4")}</p>
            </div>
            <div className={"flex flex-col space-y-1 items-center justify-center"}>
                <p className={"text-header-2"}>{timeLeft.minutes}</p>
                <p className={"text-body-3"}>{t("home.presalePurchase5")}</p>
            </div>
            <div className={"flex flex-col space-y-1 items-center justify-center"}>
                <p className={"text-header-2"}>{timeLeft.seconds}</p>
                <p className={"text-body-3"}>{t("home.presalePurchase6")}</p>
            </div>
        </div>
    );
};

const ICOState = ({}: {}) => {
    const {data, error} = useSWR(
        ["icosalesCumulativeStatus"],
        (args) =>
            fetch(`${API_BASE_URL}/v1/icosales/cumulative/status`)
                .then((res) => res.json())
                .then(async (result) => {
                    return {
                        accum: parseFloat(result.accum),
                        total: parseFloat(result.total),
                    };
                }),
        {
            fallbackData: {
                accum: 0.0,
                total: 0.0,
            },
        },
    );

    const a = Math.floor((data?.accum / data?.total) * 100);

    return (
        <>
            <div>
                <p className={"text-label-1"}>
                    ${data?.accum?.toFixed(4)} / ${data?.total?.toFixed(4)}
                </p>
            </div>

            <div className={"self-stretch  h-2 bg-neutral-60 relative"}>
                <div
                    className={"h-full  bg-primary"}
                    style={{
                        width: `${Math.min(a, 100)}%`,
                    }}
                />
            </div>
        </>
    );
};

const MyICOInfo = () => {
    const t = useTranslations();
    const wallet = useWallet();

    const {data, error} = useSWR(
        wallet.id ? ["stakingsStatusMe"] : null,
        (args) =>
            fetch(
                `${API_BASE_URL}/v1/stakings/status/me/${wallet.id}?userWalletId=${wallet.id}`,
            ).then(async (res) => {
                if (res.status === 200 || res.status === 201) {
                    const data = (await res.json()) as {
                        stakedBalance: number;
                        availableBalance: number;
                        totalBalance: number;
                    };
                    return data;
                }
            }),
    );

    return (
        <div className={"flex flex-col space-y-1 items-center"}>
            <div className={"flex items-center space-x-2"}>
                <p className={"text-label-1"}>
                    {t("home.presalePurchase7")} ={" "}
                    {(data?.totalBalance ?? 0.0).toFixed(4)}
                </p>
                <Image
                    src={"/images/tooltip.png"}
                    alt={"tooltip"}
                    width={20}
                    height={20}
                />
            </div>

            <div className={"flex items-center space-x-2"}>
                <p className={"text-label-1"}>
                    {t("home.presalePurchase8")} ={" "}
                    {(data?.availableBalance ?? 0).toFixed(4)}
                </p>
                <Image
                    src={"/images/tooltip.png"}
                    alt={"tooltip"}
                    width={20}
                    height={20}
                />
            </div>
        </div>
    );
};

const RewardList = ({
                        expectIcoGocar,
                        referral,
                        gocarPrice,
                        onRewardIds,
                    }: {
    onRewardIds: (ids: number[]) => void;
    referral: string;
    expectIcoGocar: number;
    gocarPrice: number;
}) => {
    const t = useTranslations();
    const [list, setList] = useState<
        {
            id: number;
            dollar_standard: number;
            rate: number;
            text: string;
            type: string;
        }[]
    >([]);

    const checkedList = useMemo(() => {
        return list.map((x) => {
            let checked = false;

            switch (x.type) {
                case "REF":
                    if (referral) {
                        checked = true;
                    }
                    break;
                case "PURCHASE":
                    const purchaseDollar = (expectIcoGocar || 0) * (gocarPrice || 0);
                    if (purchaseDollar >= x.dollar_standard) {
                        checked = true;
                    }

                    break;
            }
            return {
                checked,
                ...x,
            };
        })
    }, [list, expectIcoGocar, referral]);

    useEffect(() => {
        onRewardIds(checkedList.filter((x) => x.checked).map((x) => x.id));
    }, [checkedList]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/v1/rewards/list`)
            .then((res) => res.json())
            .then((result) => {
                setList(
                    (result.data
                        ?.filter((x: any) => x.type !== "REFERED")
                        .sort((a: any, b: any) => {
                            // i want to sort by dollar_standard in descending order
                            // and if type includes "REF" then it should be at the end
                        if (a.type.includes("REF") && !b.type.includes("REF")) {
                            return 1;
                        }
                        if (!a.type.includes("REF") && b.type.includes("REF")) {
                            return -1;
                        }
                        if (a.type === b.type) {
                            return 0;
                        }
                          return a.dollar_standard - b.dollar_standard;
                        }
                        ) || []).reduce((a:any, b:any) => {
                            const x = {
                                ...b
                            }

                            if(x.type ==='PURCHASE') {
                                x.rate = (a[a.length - 1]?.rate || 0) +x.rate;
                            }
                        return [...a, x]
                    }, [])
            )
                ;
            });
    }, []);

    const totalRate = checkedList.reduce(
        (a, b) => (b.checked ? a + b.rate : a),
        0.0,
    );

    return (
        <>
            <div className={"flex flex-col space-y-2 self-start"}>
                <p className={"text-label-1"}>{t("home.presalePurchase12")}</p>
                {checkedList.map((x) => (
                    <Checkbox key={x.id} checked={x.checked}>
                        {x.text} {x.rate}% BONUS
                    </Checkbox>
                ))}
            </div>

            <div className={"text-body-2 self-start"}>
                TOTAL BONUS: {totalRate.toFixed(2)}%{" "}
                <span className={"text-primary-10"}>
          (+{(expectIcoGocar * (totalRate / 100)).toFixed(4)} GOTCAR)
        </span>
            </div>
        </>
    );
};
