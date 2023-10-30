import { ApproveReceiptRequest, CancelReceiptRequest, FilterReceipts, ReceiptsResponse } from "app/pages/Payment/Receipts/slice/types";
import { Pageable } from "types";
import { serialize } from "utils/helpers";
import { createService } from "./axios";
import { ApproveRefundRequest, FilterRefunds, RefundsResponse } from "app/pages/Payment/Refunds/slice/types";

const instance = createService(process.env.REACT_APP_API_URL);

const fetchReceipts = async (
  params?: FilterReceipts,
): Promise<Pageable<ReceiptsResponse>> => {
  const res = await instance.get(`/api/receipt?${serialize(params)}`);
  return res.data;
};

const fetchRefunds = async (
  params?: FilterRefunds,
): Promise<Pageable<RefundsResponse>> => {
  const res = await instance.get(`/api/refund?${serialize(params)}`);
  return res.data;
};

const fetchReceiptInformation = async (
  params: string,
): Promise<ReceiptsResponse> => {
  const res = await instance.get(`/api/receipt/${params}`);
  return res.data;
}

const fetchRefundInformation = async (
  params: string,
): Promise<RefundsResponse> => {
  const res = await instance.get(`/api/refund/${params}`);
  return res.data;
}

const approveReceiptFormData = async (
  params: ApproveReceiptRequest
): Promise<any> => {
  const _params: any = {...params};
  delete _params.id;
  const res = await instance.patch(`/api/receipt/approve-receipt/${params.id}`, _params);
  return res.data;
}

const approveRefundFormData = async (
  params: ApproveRefundRequest
): Promise<any> => {
  const _params: any = {...params};
  delete _params.id;
  const res = await instance.patch(`/api/refund/approve-refund/${params.id}`, _params);
  return res.data;
}

const cancelReceipt = async (
  params: CancelReceiptRequest
): Promise<any> => {
  const _params: any = {...params};
  delete _params.id;
  const res = await instance.patch(`/api/receipt/cancel-receipt/${params.id}`, _params);
  return res.data;
}

const cancelRefund = async (
  params: CancelReceiptRequest
): Promise<any> => {
  const _params: any = {...params};
  delete _params.id;
  const res = await instance.patch(`/api/refund/cancel-refund/${params.id}`, _params);
  return res.data;
}

export default {
  fetchReceipts,
  fetchReceiptInformation,
  approveReceiptFormData,
  approveRefundFormData,
  cancelReceipt,
  cancelRefund,
  fetchRefunds,
  fetchRefundInformation
};
