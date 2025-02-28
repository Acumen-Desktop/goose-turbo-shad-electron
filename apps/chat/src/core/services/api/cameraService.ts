import type { DemoModelRequest, DemoModelResponse } from 'src/core/types/demoModel';
import { axiosClient } from '../client';

export class DemoService {
  static async getDemoModel(request: DemoModelRequest) {
    return axiosClient.get<DemoModelResponse>('/demo/model', request);
  }
}
