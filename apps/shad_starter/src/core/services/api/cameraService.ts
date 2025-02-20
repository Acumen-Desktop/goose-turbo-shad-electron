import type { CameraTriggerRequest } from '$core/types/cameraModel';
import { axiosClient } from '../client';

export class CameraService {
	static async trigger(request: CameraTriggerRequest) {
		return axiosClient.post<boolean>('/camera/trigger', request);
	}
}
