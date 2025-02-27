import { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse } from ".";

interface LoginResponse extends ApiResponse {
	data: {
		id: number;
		username: string;
		email: string;
	};
	token: string;
}

interface SignUpResponse extends ApiResponse {}

export const loginApi = (
	api: AxiosInstance,
	username: string,
	password: string,
	mock: boolean = false
): Promise<AxiosResponse<LoginResponse>> => {
	if (!mock) {
		return api.post<LoginResponse>("/auth", { username, password });
	}

	return new Promise<AxiosResponse<LoginResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: {
						id: 6,
						username: username,
						email: "test123@test.com",
					},
					message: "Login successfully",
					status: "success",
					token: "token123",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<LoginResponse>);
		}, 1500);
	});
};

export const signUpApi = (
	api: AxiosInstance,
	username: string,
	// phoneNum: string,
	email: string,
	password: string,
	mock: boolean = false
): Promise<AxiosResponse<SignUpResponse>> => {
	if (!mock) {
		return api.post<SignUpResponse>("/auth/signup", {
			username,
			email,
			password,
		});
	}

	return new Promise<AxiosResponse<SignUpResponse>>((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					data: {
						id: 6,
						username: "test",
						email: "test@test.com",
					},
					message: "Sign up successfully",
					status: "success",
				},
				status: 200,
				statusText: "OK",
				headers: {},
				config: {},
			} as AxiosResponse<SignUpResponse>);
		}, 1500);
	});
};
