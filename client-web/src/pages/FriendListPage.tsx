import { useEffect, useState } from "react";
import { IUser } from "../types/user";
import { addFriendApi, fetchFriendsApi } from "../api/user";
import { useUserCtx } from "../context/user";
import { api } from "../api";
import { TrashIcon } from "@heroicons/react/24/outline";
import SearchUserModal from "../components/modals/SearchUserModal";
import { ArrowLeftIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

type FriendListTopBarProps = {
	title: string;
};

const FriendListTopBar: React.FC<FriendListTopBarProps> = ({ title }) => {
	const navigate = useNavigate();

	return (
		<div
			className={`relative top-0 flex h-[8%] items-center w-full py-4 px-3 bg-purple-200 justify-between`}
		>
			<button
				onClick={() => navigate(-1)}
				className={`flex items-center justify-center p-1 hover:scale-110 `}
			>
				<ArrowLeftIcon className="w-6 h-6 text-black" />
			</button>

			<h1 className={`text-xl font-bold text-justjio-secondary`}>{title}</h1>

			<button
				onClick={() => navigate(-1)}
				className={`flex items-center justify-center p-1 hover:scale-110 `}
			>
				<UserGroupIcon className="w-8 h-8 text-justjio-secondary" />
			</button>
		</div>
	);
};

const FriendListPage = () => {
	const [friends, setFriends] = useState<IUser[]>([]);
	const { user } = useUserCtx();
	const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

	useEffect(() => {
		const fetchFriends = async () => {
			const res = await fetchFriendsApi(api, user.id);
			setFriends(res.data.data);
		};

		fetchFriends();
	}, [user.id]);

	const handleAddFriend = async (newFriend: IUser) => {
		try {
			const res = await addFriendApi(api, user.id, newFriend.id);
			if (res.status !== 200) {
				alert("Failed to add friend");
				return;
			}

			alert("Friend added successfully");
			setFriends((prev) => [...prev, newFriend]);
			setIsSearchModalVisible(false);
		} catch (error) {
			alert(`Failed to add friend: ${error}`);
		}
	};

	return (
		<div className="h-full flex flex-col items-center gap-4 bg-gray-200">
			<FriendListTopBar title="Friends" />

			<div className="w-full h-full flex flex-col items-center px-4 gap-3">
				<div className="w-full h-[85%] overflow-y-auto flex flex-col items-center justify-center gap-4">
					{friends.length > 0 ? (
						friends.map((friend) => (
							<div
								key={friend.id}
								className="w-4/5 flex items-center justify-between py-2 px-3 bg-white rounded-xl shadow-md"
							>
								<div className="flex items-center gap-2">
									<img
										src="https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg"
										alt="Profile Image"
										className="w-7 h-7 rounded-full"
									/>
									<p className="text-black">{friend.username}</p>
								</div>
								<TrashIcon
									className="h-6 w-6 text-red-500 hover:text-red-600 cursor-pointer"
									onClick={() => alert(`Delete ${friend.username}?`)}
								/>
							</div>
						))
					) : (
						<p className="text-lg font-semibold text-gray-500">
							No friends found
						</p>
					)}
				</div>

				<button
					onClick={() => setIsSearchModalVisible(true)}
					className="bg-justjio-secondary hover:shadow-lg hover:border-2 hover:border-white text-white font-bold py-2 px-4 rounded-full mt-2 w-2/5"
				>
					Add Friend
				</button>
			</div>

			<SearchUserModal
				isVisible={isSearchModalVisible}
				closeModal={() => setIsSearchModalVisible(false)}
				userId={user.id}
				addFriend={handleAddFriend}
			/>
		</div>
	);
};

export default FriendListPage;
