import React, { useEffect, useRef, useState } from "react";
import RoomTopBar from "../components/RoomTopBar";
import { channelTypes, useWs } from "../context/ws";
import { useParams } from "react-router-dom";
import { useUserCtx } from "../context/user";
import { fetchRoomMessageApi, sendMessageApi } from "../api/message";
import { api } from "../api";

type Message = {
	user_id: number;
	username: string;
	content: string;
	time: string;
};

const RoomChatPage: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [page, setPage] = useState<number>(1);
	const [pageCount, setPageCount] = useState<number>();
	const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
	const { user } = useUserCtx();
	const { roomId } = useParams();
	const [subscribe, unsubscribe] = useWs();

	useEffect(() => {
		if (!roomId) {
			alert("Room ID not found");
			return;
		}

		const channel = channelTypes.createMessageInChat(roomId);

		subscribe(channel, (message) => {
			console.log("Received message", message);
			setMessages((prev) => [
				...prev,
				{
					user_id: Number(message.sender_id),
					username: message.sender_name,
					content: message.content,
					time: new Date(message.sent_at).toLocaleTimeString(),
				},
			]);
			setIsNewMessage(true);
		});
		console.log("Subscribed to channel", channel);

		return () => {
			console.log("Unsubscribing from channel", channel);
			unsubscribe(channel);
		};
	}, [roomId, subscribe, unsubscribe]);

	useEffect(() => {
		if (!roomId) {
			alert("Room ID not found");
			return;
		}

		const fetchMessages = async () => {
			const res = await fetchRoomMessageApi(api, roomId, page);

			if (res.status !== 200) {
				alert("Failed to fetch messages");
				return;
			}

			const newMsgs = res.data.data.messages.map((msg) => ({
				user_id: msg.sender.id,
				username: msg.sender.username,
				content: msg.content,
				time: new Date(msg.sent_at).toLocaleTimeString(),
			}));

			setIsNewMessage(false);
			setMessages((prev) =>
				[...newMsgs, ...prev].sort(
					(a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
				)
			);
			setPageCount(res.data.data.page_count);
		};

		fetchMessages();
	}, [roomId, page]);

	const fetchMoreMessages = () => {
		if (page < (pageCount || 0)) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	const handleSend = async (text: string) => {
		if (!roomId) {
			alert("Room ID not found");
			return;
		}

		const res = await sendMessageApi(api, roomId?.toString(), text);

		if (res.status !== 200) {
			alert("Failed to send message");
			return;
		}
	};

	return (
		<div className="h-full flex flex-col bg-gray-200">
			<RoomTopBar title="Chat" />
			<ChatMessages
				messages={messages}
				currentUserId={user.uid}
				isNewMessage={isNewMessage}
				fetchMore={fetchMoreMessages}
			/>
			<ChatInput onSend={handleSend} />
		</div>
	);
};

const ChatMessages: React.FC<{
	messages: Message[];
	currentUserId: number;
	isNewMessage: boolean;
	fetchMore: () => void;
}> = ({ messages, currentUserId, isNewMessage, fetchMore }) => {
	const latestMessageRef = useRef<HTMLDivElement>(null);
	const messageListRef = useRef<HTMLDivElement>(null);

	// scroll to latest message whenever new message is added
	useEffect(() => {
		if (latestMessageRef.current && isNewMessage) {
			latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isNewMessage]);

	const handleScroll = () => {
		if (messageListRef.current?.scrollTop === 0) {
			fetchMore();
		}
	};

	return (
		<div
			ref={messageListRef}
			onScroll={handleScroll}
			className="flex-1 p-4 overflow-y-auto"
		>
			{messages.map((message, index) => (
				<div
					key={index}
					className={`max-w-[85%] w-fit mb-4 px-3 py-2 rounded-xl text-black bg-white border-[1.5px] border-justjio-secondary ${
						message.user_id === currentUserId
							? "ml-auto rounded-br-none"
							: "rounded-bl-none"
					}`}
				>
					<div
						className={`flex gap-3 ${
							message.user_id === currentUserId
								? "flex-row-reverse "
								: "flex-row"
						}`}
					>
						<img
							src="https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg"
							alt="User"
							className="w-6 h-6 rounded-full"
						/>
						<div className="flex flex-col">
							<div
								className={`flex items-start gap-2 ${
									message.user_id === currentUserId
										? "flex-row-reverse"
										: "flex-row"
								}`}
							>
								<h3 className="text-md font-semibold leading-none">
									{message.username}
								</h3>
								<span className="text-sm text-gray-500 leading-[1.275]">
									{message.time}
								</span>
							</div>
							<p className="text-lg text-wrap break-word leading-tight">
								{message.content}
							</p>
						</div>
					</div>

					{index === messages.length - 1 ? (
						<div ref={latestMessageRef} />
					) : null}
				</div>
			))}
		</div>
	);
};

const ChatInput: React.FC<{ onSend: (message: string) => void }> = ({
	onSend,
}) => {
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (!input.trim()) {
			return;
		}

		onSend(input);
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSend();
		}
	};

	return (
		<div className="w-full px-4 pt-3 pb-4 flex">
			<input
				type="text"
				className="flex-1 p-2 border border-gray-900 rounded-lg rounded-tr-none rounded-br-none text-black placeholder-black border-r-0 bg-justjio-primary focus:outline-none"
				value={input}
				onKeyDown={handleKeyDown}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type a message..."
			/>
			<button
				onClick={handleSend}
				className="bg-justjio-secondary hover:bg-purple-800 text-white rounded-tl-none rounded-bl-none border-l-0 font-bold py-2 px-4 rounded"
			>
				Send
			</button>
		</div>
	);
};

export default RoomChatPage;
