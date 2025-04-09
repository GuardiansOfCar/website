import { Main } from "@/components/main";

export const G2EContainer = () => {
  return (
    <div className={"bg-hero"}>
      <Main leftHref={"/referral"} rightHref={""}>
        <div
          className={
            "flex items-center z-10 relative h-[750px]  max-h-screen justify-center"
          }
        >
          <video width="300" height="400" autoPlay={true} loop>
            <source src="/videos/g2e.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Main>
    </div>
  );
};
