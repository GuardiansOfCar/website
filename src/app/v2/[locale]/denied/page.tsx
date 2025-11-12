import {Main} from "@/components/main";

export default function Page() {
    return (
        <div className={"bg-hero"}>
            <Main hideNav rightHref={""} leftHref={""}>
                <div
                    className={"bg-white w-full mx-auto max-w-md p-5 border-black border-4 overflow-y-scroll max-h-[70vh] break-words break-all"}>
                    <strong>🚨 [Important Notice] Full Refund for Participants from Restricted
                        Countries</strong><br/><br/>

                    Dear GOTCAR Community,<br/>
                    At GOTCAR, we are committed to complying with the regulatory frameworks of all jurisdictions. In
                    line with this commitment, we have decided to fully refund all presale participants from countries
                    subject to participation restrictions.<br/><br/>

                    📌 Please note: Participants from the countries listed below will not be able to claim tokens in the
                    future. We strongly advise eligible users to request a refund.<br/><br/>

                    Restricted Countries:<br/>
                    The USA, China, North Korea, South Korea, Iran, Cuba, and other jurisdictions subject to United
                    Nations sanctions.<br/>
                    <br/><br/>

                    <strong>💸 Refund Request Procedure</strong><br/><br/>

                    To request your refund, please submit the following information via email:<br/>
                    📩 Email : admin@guardiansofthecar.com<br/><br/>

                    Required Information:<br/>
                    1. Participated Network: BSC, SOL, or ETH<br/>
                    2. Presale Transaction Hash / Signature<br/>
                    {"->"} You can find this information by entering your wallet address on the relevant block
                    explorer:<br/>
                    • BSC: https://bscscan.com<br/>
                    • ETH: https://etherscan.io<br/>
                    • SOL: https://solscan.io<br/>
                    <br/><br/>

                    <strong>⚠️ Important Notes</strong><br/><br/>

                    • Refunds will only be processed to the original wallet address used in the presale.<br/>
                    • All submissions will be reviewed manually and processed in the order received.<br/>
                    • Refunds will be completed within 5 business days if the request is submitted by October 31,
                    2025.<br/>
                    • Requests made after the deadline may be subject to additional verification or delays.<br/>
                    <br/><br/>

                    <strong>📧 Email Format Example</strong><br/><br/>

                    To: admin@guardiansofthecar.com<br/>
                    Subject: GOTCAR Presale Refund Request<br/><br/>

                    Body:<br/>
                    1. Participated Network: BSC<br/>
                    2. Transaction Hash / Signature:<br/>
                    0x0000000000000000794b04398649f7a328fa2020153f6ec9fe23086a3d544b80a<br/>
                    <br/><br/>

                    GOTCAR is committed to protecting our community and ensuring regulatory compliance at every step. We
                    apologize for any inconvenience and appreciate your understanding as we take responsible steps
                    forward.<br/><br/>

                    Thank you for your continued support.<br/><br/>

                    — GOTCAR Project Team

                </div>
            </Main>
        </div>
    )
}