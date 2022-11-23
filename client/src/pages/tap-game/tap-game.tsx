import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Indicator } from "../../components";
import { generateRandomNumber } from "../../helpers";
import { tapGameContent } from "./tap-game.content";


export function TapGame() {

    const [isWaiting, setIsWaiting] = useState<boolean>(true);

    const [isRight, setIsRight] = useState<boolean>(false);

    const [isUserTapAnyKey, setIsUserTapAnyKey] = useState<boolean>(true);

    const showRightIndicator = isRight && !isWaiting;
    const showLeftIndicator = !isRight && !isWaiting;

    useEffect(() => {
        if(isWaiting) {
            handleUserReaction();

            const randomTimeToWait = generateRandomNumber(2, 6) * 1000;

            return setIsWaitingStateWithTimeout(randomTimeToWait);
        }else {
            setIsUserTapAnyKey(false);

            const randomNumberBetweenZeroToOne = generateRandomNumber(0, 2);
            setIsRight(() => randomNumberBetweenZeroToOne ? true : false)

            const timeToWait = 1000;
            return setIsWaitingStateWithTimeout(timeToWait);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWaiting])
    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardClicked);
        return () => window.removeEventListener('keydown', handleKeyboardClicked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showRightIndicator, showLeftIndicator])

    function handleKeyboardClicked(e: KeyboardEvent) {
        setIsUserTapAnyKey(true);
        const { key } = e;
        const isTapA = key.toLowerCase() === "a";
        const isTapL = key.toLowerCase() === "l";
        
        handleUserReaction(isTapA, isTapL)
    }

    function handleUserReaction(isTapA?: boolean, isTapL?: boolean) {

        const isPassKeysPress = (isTapA !== undefined && isTapL !== undefined);

        const isTooLate = !isUserTapAnyKey && !isPassKeysPress;
        if(isTooLate) {
            return toast(tapGameContent.tooLateTapMessage, { type: "error" })
        }

        if(!isPassKeysPress) return;

        const isTapWrongKeys = (showLeftIndicator && !isTapA) || (showRightIndicator && !isTapL);
        if(isTapWrongKeys) {
            return toast(tapGameContent.wrongKeyTapMessage, {type: "error"});
        }

        const isTapTooSoon = (!showLeftIndicator && !showRightIndicator) && (isTapA || isTapL);
        if(isTapTooSoon) {
            return toast(tapGameContent.tooSoonTapMessage, {type: "error"});
        }

        const isSuccess = (isTapA && showLeftIndicator) || (isTapL && showRightIndicator);
        if(isSuccess) {
            return toast(tapGameContent.successTapMessage, {type: "success"});
        }

    }

    const setIsWaitingStateWithTimeout = (timeToWait: number) => {
        const timer = setTimeout(() => {
            setIsWaiting((prev) => !prev);
        }, timeToWait);
        return () => clearTimeout(timer);
    }

    return (
        <Grid
        container
        height={"100vh"}
        width={"100%"}
        direction={"column"}
        alignItems={"center"}>
            <Box
            bgcolor={"#FFF"}
            padding={"12px"}
            borderRadius={"0 0 5px 5px"}
            width={"fit-content"}>
                <Typography fontSize={12}>
                    {tapGameContent.instractors}
                </Typography>
            </Box>
            <Grid
            container
            height={"90%"}
            direction={"row"}>
                <Indicator 
                indicatorColor={"red"} 
                showIndicator={showLeftIndicator}/>
                <Indicator 
                indicatorColor={"blue"} 
                showIndicator={showRightIndicator}/>
            </Grid>
        </Grid>
    )
}