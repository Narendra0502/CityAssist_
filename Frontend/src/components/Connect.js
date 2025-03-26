import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Connect = () => {
    const [roomName, setRoomName] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const navigate = useNavigate();

    const handleCreateMeeting = async () => {
        if (!roomName.trim()) {
            alert("Please enter a meeting room name.");
            return;
        }

        // Generate Jitsi meeting link
        const jitsiLink = `https://meet.jit.si/${roomName}`;
        setMeetingLink(jitsiLink);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Join Jitsi Meeting</h2>
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

                        <p className="mt-2 text-gray-500">or</p>

                        <button
                            onClick={() => navigate(`/Jitsi/${roomName}`)} // Navigate to embedded Jitsi
                            className="mt-2 w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Join Meeting Here
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connect;
