import { AxiosInstance, AxiosResponse } from "axios";
import { IRoom, IRoomInvite } from "../types/room";
import { ApiResponse } from ".";
import { IUser } from "../types/user";

interface FetchRecentRoomsResponse extends ApiResponse {
	data: IRoom[];
}

interface CreateRoomResponse extends ApiResponse {
	data: {
		room: IRoom;
		invites: [];
	};
}

interface RespondToInviteResponse extends ApiResponse {
	data: {
		room?: IRoom;
		attendees?: [];
	};
}

interface FetchRoomInvitesResponse extends ApiResponse {
	data: IRoomInvite[];
}

interface FetchNumRoomInvitesResponse extends ApiResponse {
	data: {
		count: number;
	};
}

interface FetchRoomResponse extends ApiResponse {
	data: IRoom;
}

interface FetchRoomAttendeesResponse extends ApiResponse {
	data: IUser[];
}

export const fetchRecentRoomsApi = (
	api: AxiosInstance,
	mock: boolean = false
): Promise<AxiosResponse<FetchRecentRoomsResponse>> => {
	if (!mock) {
		return api.get<FetchRecentRoomsResponse>("/rooms");
	}

	return new Promise<AxiosResponse<FetchRecentRoomsResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: [
						{
							id: "1",
							name: "Test Room",
							time: "5:00pm",
							venue: "ntu hall 9",
							date: "2022-09-04T00:00:00Z",
							hostId: 6,
							host: {},
							createdAt: "2021-09-25T02:00:00Z",
							updatedAt: "2021-09-25T02:00:00Z",
							attendeesCount: 1,
							url: "",
							isClosed: false,
						},
					],
					message: "Fetched recent rooms successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<FetchRecentRoomsResponse>);
		}, 1500);
	});
};

export const createRoomApi = (
	api: AxiosInstance,
	roomData: Partial<IRoom>,
	mock: boolean = false
): Promise<AxiosResponse<CreateRoomResponse>> => {
	if (!mock) {
		return api.post<CreateRoomResponse>("/rooms", {
			room: roomData,
			// TODO: Implement invitees (friends)
			invitees: [],
		});
	}

	return new Promise<AxiosResponse<CreateRoomResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: {
						room: {
							id: "1",
							name: roomData.name,
							time: roomData.time,
							venue: roomData.venue,
							date: roomData.date,
							hostId: 6,
							host: {},
							createdAt: "2021-09-25T02:00:00Z",
							updatedAt: "2021-09-25T02:00:00Z",
							attendeesCount: 1,
							url: "",
							isClosed: false,
						},
						invites: [],
					},
					message: "Room created successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<CreateRoomResponse>);
		}, 1500);
	});
};

export const respondToInviteApi = (
	api: AxiosInstance,
	roomId: string,
	accept: boolean,
	mock: boolean = false
): Promise<AxiosResponse<RespondToInviteResponse>> => {
	if (!mock) {
		return api.patch<RespondToInviteResponse>(`/rooms/${roomId}`, { accept });
	}

	return new Promise<AxiosResponse<RespondToInviteResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: {},
					message: "Responded to invite successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<RespondToInviteResponse>);
		}, 1500);
	});
};

export const closeRoomApi = (
	api: AxiosInstance,
	roomId: string,
	mock: boolean = false
): Promise<AxiosResponse<ApiResponse>> => {
	if (!mock) {
		return api.patch<ApiResponse>(`/rooms/${roomId}/close`);
	}

	return new Promise<AxiosResponse<ApiResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					message: "Closed room successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<ApiResponse>);
		}, 1500);
	});
};

export const fetchRoomInvitesApi = (
	api: AxiosInstance,
	mock: boolean = false
): Promise<AxiosResponse<FetchRoomInvitesResponse>> => {
	if (!mock) {
		return api.get<FetchRoomInvitesResponse>("/rooms/invites");
	}

	return new Promise<AxiosResponse<FetchRoomInvitesResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: [
						{
							id: 1,
							roomId: "1",
							room: {
								id: "1",
								name: "Test Room",
								time: "5:00pm",
								venue: "ntu hall 9",
								date: "2022-09-04T00:00:00Z",
								hostId: 6,
								host: {
									username: "testuser",
								},
								createdAt: "2021-09-25T02:00:00Z",
								updatedAt: "2021-09-25T02:00:00Z",
								attendeesCount: 1,
								url: "",
								isClosed: false,
							},
							message: "Test message",
						},
					],
					message: "Fetched room invites successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<FetchRoomInvitesResponse>);
		}, 1500);
	});
};

export const fetchNumRoomInvitesApi = (
	api: AxiosInstance,
	mock: boolean = false
): Promise<AxiosResponse<FetchNumRoomInvitesResponse>> => {
	if (!mock) {
		return api.get<FetchNumRoomInvitesResponse>("/rooms/invites/count");
	}

	return new Promise<AxiosResponse<FetchNumRoomInvitesResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: {
						count: 1,
					},
					message: "Fetched room invites successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<FetchNumRoomInvitesResponse>);
		}, 1500);
	});
};

export const fetchRoomApi = (
	api: AxiosInstance,
	roomId: string,
	mock: boolean = false
): Promise<AxiosResponse<FetchRoomResponse>> => {
	if (!mock) {
		return api.get<FetchRoomResponse>(`/rooms/${roomId}`);
	}

	return new Promise<AxiosResponse<FetchRoomResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: {
						id: "1",
						name: "Test Room",
						time: "5:00pm",
						venue: "ntu hall 9",
						date: "2022-09-04T00:00:00Z",
						hostId: 6,
						host: {
							username: "testuser",
						},
						createdAt: "2021-09-25T02:00:00Z",
						updatedAt: "2021-09-25T02:00:00Z",
						attendeesCount: 1,
						url: "",
						isClosed: false,
					},
					message: "Fetched room successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<FetchRoomResponse>);
		}, 1500);
	});
};

export const fetchRoomAttendeesApi = (
	api: AxiosInstance,
	roomId: string,
	mock: boolean = false
): Promise<AxiosResponse<FetchRoomAttendeesResponse>> => {
	if (!mock) {
		return api.get<FetchRoomAttendeesResponse>(`/rooms/${roomId}/attendees`);
	}

	return new Promise<AxiosResponse<FetchRoomAttendeesResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: [
						{
							id: 1,
							username: "testuser",
							email: "test@test.com",
							password: "test",
							name: "Test User",
							phoneNum: "12345678",
							isEmailValid: true,
							isOnline: false,
							lastSeen: "2021-09-25T02:00:00Z",
							registeredAt: "2021-09-25T02:00:00Z",
						},
					],
					message: "Fetched room attendees successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<FetchRoomAttendeesResponse>);
		}, 1500);
	});
};
