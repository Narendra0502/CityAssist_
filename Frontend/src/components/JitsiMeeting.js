import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const JitsiMeeting = () => {
    const { roomName } = useParams(); // Get room name from the URL

    useEffect(() => {
        if (!roomName) return;

        const domain = "meet.jit.si";
        const options = {
            roomName: roomName,
            width: "100%",
            height: 600,
            parentNode: document.getElementById("jitsi-container"),
            userInfo: { displayName: "User" },
        };

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => {
            new window.JitsiMeetExternalAPI(domain, options);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [roomName]);

    return <div id="jitsi-container" className="w-full"></div>;
};

export default JitsiMeeting;
