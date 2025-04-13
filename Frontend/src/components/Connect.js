import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Connect = () => {
    const [roomName, setRoomName] = useState("");
    const [meetingType, setMeetingType] = useState("jitsi"); // Add meeting type state
    const [meetingLink, setMeetingLink] = useState("");
    const navigate = useNavigate();

    const handleCreateMeeting = async () => {
        if (!roomName.trim()) {
            toast.error("Please enter a meeting room name.");
            return;
        }

        try {
            if (meetingType === "zoom") {
                const response = await fetch("http://localhost:5000/zoom/create-meeting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ topic: roomName })
                });

                if (!response.ok) throw new Error("Failed to create Zoom meeting");
                const data = await response.json();
                setMeetingLink(data.meeting.join_url);
                toast.success("Zoom meeting created successfully!");
            } else {
                // Generate Jitsi meeting link
                const jitsiLink = `https://meet.jit.si/${roomName}`;
                setMeetingLink(jitsiLink);
                toast.success("Jitsi meeting created successfully!");
            }
        } catch (error) {
            console.error("Meeting creation error:", error);
            toast.error("Failed to create meeting");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Create Meeting</h2>
                
                {/* Meeting Type Selection */}
                <div className="flex justify-center space-x-4 mb-4">
                    <button
                        onClick={() => setMeetingType("jitsi")}
                        className={`px-4 py-2 rounded ${
                            meetingType === "jitsi" 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Jitsi Meet
                    </button>
                    <button
                        onClick={() => setMeetingType("zoom")}
                        className={`px-4 py-2 rounded ${
                            meetingType === "zoom" 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Zoom
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Enter Meeting Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleCreateMeeting}
                    className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                    Generate Meeting Link
                </button>

                {meetingLink && (
                    <div className="text-center mt-4">
                        <p className="text-green-600">Meeting Link:</p>
                        <a
                            href={meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {meetingLink}
                        </a>

                        {meetingType === "jitsi" && (
                            <>
                                <p className="mt-2 text-gray-500">or</p>
                                <button
                                    onClick={() => navigate(`/Jitsi/${roomName}`)}
                                    className="mt-2 w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Join Meeting Here
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connect;