// 征信报告上传相关接口
import request from '@/utils/request'

// API响应类型定义
export interface ApiResponse<T = any> {
  code: number
  msg?: string
  message?: string
  data?: T
}
// 上传征信报告
export function uploadCreditReport(data: FormData) {
  console.log('data', data)
  return Promise.resolve({ code: 0, message: '上传成功' })
}

// 获取征信报告状态
export function getCreditReportStatus(mockType = 3) {
  const mockData = {
    1: {
      status: 'strong-reject',
      message: '很抱歉，您暂时不符合贷款条件',
      amount: 0,
    },
    2: {
      status: 'weak-reject',
      message: '建议您3个月后再次尝试',
      amount: 0,
    },
    3: {
      status: 'success',
      message: '恭喜您，审核通过！',
      amount: 65000,
    },
  }

  return Promise.resolve({
    code: 0,
    data: mockData[mockType] || mockData[3],
  })
}

export function fileUpload(data: { file: File }): Promise<ApiResponse<{ url: string }>> {
  const formData = new FormData()
  formData.append('file', data.file)
  return request.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export function ocrIdCard(data: { frontImageUrl: string, backImageUrl: string }): Promise<ApiResponse> {
  return request.post('/v1/ocr/idCard', data)
}

// 大数据风控查询接口
export function bigDataQuery(data: { idCard: string, phone: string, name: string }): Promise<ApiResponse> {
  return request.post('/v1/bigData/query', data)
}

// 征信风控解析接口
export function creditAnalysis(data: { url: string, analysisType: string }): Promise<ApiResponse> {
  return request.post(`/credit/parseSave?url=${data.url}&analysisType=${data.analysisType}`)
}

// 发送验证码接口

export function sendCode(data: { phone: string }): Promise<ApiResponse> {
  return request.post(`/sms/sendCode?phone=${data.phone}`)
}

// 手动新增

